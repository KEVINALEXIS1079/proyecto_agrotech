import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
  forwardRef,
  Inject,
} from '@nestjs/common';
import * as mqtt from 'mqtt';
import { SensoresService } from 'src/modules/iot/sensores/services/sensores.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface MqttConnection {
  client: mqtt.MqttClient;
  topic: string;
  reconnectTimeout?: NodeJS.Timeout;
  config: {
    broker: string;
    puerto: number;
    topico: string;
  };
}

interface ConnectSensorOptions {
  id_sensor_pk: number;
  broker: string;
  puerto: number;
  topico: string;
  onMessage?: (valor: number) => Promise<void>;
}

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttService.name);
  private connections = new Map<number, MqttConnection>();

  constructor(
    @Inject(forwardRef(() => SensoresService))
    private readonly sensoresService: SensoresService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // Al iniciar el módulo, intentamos conectar los sensores activos
  async onModuleInit() {
    try {
      const sensores = await this.sensoresService.findAll();
      for (const sensor of sensores) {
        if (sensor.activo) {
          // ignoro el await para que las reconexiones no bloqueen todo el init,
          // pero puedes usar await si prefieres secuencial
          this.connectSensor({
            id_sensor_pk: sensor.id_sensor_pk,
            broker: sensor.broker_sensor,
            puerto: sensor.puerto_sensor,
            topico: sensor.topico_sensor,
          }).catch((err) =>
            this.logger.error(`Error al conectar sensor ${sensor.id_sensor_pk}: ${err.message}`),
          );
        }
      }
    } catch (err) {
      this.logger.error(`Error en onModuleInit MQTT: ${(err as Error).message}`);
    }
  }

  // Conectar un sensor específico
  async connectSensor(options: ConnectSensorOptions) {
    const { id_sensor_pk, broker, puerto, topico, onMessage } = options;

    // Si ya existía, desconectamos y limpiamos para re-crear la conexión
    if (this.connections.has(id_sensor_pk)) {
      await this.disconnectSensor(id_sensor_pk);
    }

    const url = `mqtt://${broker}:${puerto}`;
    this.logger.log(`Intentando conectar sensor ${id_sensor_pk} -> ${url} (topic: ${topico})`);

    // Conexión sin reconnect automático del cliente (lo manejamos nosotros)
    const client = mqtt.connect(url, { reconnectPeriod: 0 });

    // Guardamos la conexión inicial (config incluida)
    this.connections.set(id_sensor_pk, {
      client,
      topic: topico,
      config: { broker, puerto, topico },
    });

    // Función de reconexión segura (no usa non-null assertions sobre objetos potencialmente undefined)
    const scheduleReconnect = () => {
      const conn = this.connections.get(id_sensor_pk);
      if (!conn) {
        this.logger.warn(`Reconexión solicitada pero no existe conexión previa para sensor ${id_sensor_pk}`);
        return;
      }

      // Si ya hay un timeout programado, limpiarlo para evitar duplicados
      if (conn.reconnectTimeout) {
        clearTimeout(conn.reconnectTimeout);
      }

      this.logger.warn(`Programando reconexión sensor ${id_sensor_pk} en 5s`);
      conn.reconnectTimeout = setTimeout(async () => {
        // Limpia el timeout guardado antes de intentar reconectar
        const c = this.connections.get(id_sensor_pk);
        if (c) {
          c.reconnectTimeout = undefined;
        }

        // Reintento: si la conexión fue eliminada intermediaramente, se ignora
        try {
          this.logger.log(`Reintentando conectar sensor ${id_sensor_pk}`);
          await this.connectSensor({
            id_sensor_pk,
            broker,
            puerto,
            topico,
          });
        } catch (err) {
          this.logger.error(`Error re-conectando sensor ${id_sensor_pk}: ${(err as Error).message}`);
          // En caso de fallo, programar otro intento
          const existing = this.connections.get(id_sensor_pk);
          if (existing) {
            existing.reconnectTimeout = setTimeout(scheduleReconnect, 5000);
          }
        }
      }, 5000);
    };

    client.on('connect', async () => {
      this.logger.log(`Sensor ${id_sensor_pk} conectado al tópico "${topico}"`);
      client.subscribe(topico, (err) => {
        if (err) {
          this.logger.error(`Error suscribiéndose a ${topico}: ${err.message}`);
        } else {
          this.logger.log(`Subscripción OK: ${topico}`);
        }
      });

      // Actualiza estado en BD
      try {
        await this.sensoresService.updateStatus(id_sensor_pk, 'conectado');
      } catch (err) {
        this.logger.error(`No se pudo actualizar estado a 'conectado' para sensor ${id_sensor_pk}: ${(err as Error).message}`);
      }
    });

    client.on('message', async (_, message) => {
      const raw = message.toString();
      const valor = parseFloat(raw);
      if (isNaN(valor)) {
        this.logger.warn(`Mensaje no numérico desde sensor ${id_sensor_pk}: ${raw}`);
        return;
      }

      try {
        // Guardamos lectura y emitimos evento
        const sensorActualizado = await this.sensoresService.saveSensorData({ id_sensor_pk, valor });
        this.eventEmitter.emit('sensor.updated', sensorActualizado);
        if (onMessage) await onMessage(valor);
      } catch (err) {
        this.logger.error(`Error guardando dato sensor ${id_sensor_pk}: ${(err as Error).message}`);
      }
    });

    client.on('error', async (err: Error & { code?: string }) => {
      // Log más informativo según código
      if (err?.message?.includes('ECONNRESET') || err?.code === 'ECONNRESET') {
        this.logger.warn(`Sensor ${id_sensor_pk} MQTT connection reset (ECONNRESET)`);
      } else {
        this.logger.error(`Sensor ${id_sensor_pk} MQTT error: ${err.message}`);
      }

      try {
        await this.sensoresService.updateStatus(id_sensor_pk, 'desconectado');
      } catch (e) {
        this.logger.error(`No se pudo setear estado 'desconectado' para sensor ${id_sensor_pk}: ${(e as Error).message}`);
      }

      // programar reconexión controlada
      scheduleReconnect();
    });

    client.on('close', async () => {
      this.logger.warn(`Conexión MQTT cerrada para sensor ${id_sensor_pk}`);
      try {
        await this.sensoresService.updateStatus(id_sensor_pk, 'desconectado');
      } catch (e) {
        this.logger.error(`No se pudo setear estado 'desconectado' para sensor ${id_sensor_pk}: ${(e as Error).message}`);
      }
      scheduleReconnect();
    });

    // si el cliente finaliza por otro motivo, no dejamos timeouts colgados
    client.on('end', () => {
      const conn = this.connections.get(id_sensor_pk);
      if (conn?.reconnectTimeout) {
        clearTimeout(conn.reconnectTimeout);
        conn.reconnectTimeout = undefined;
      }
    });

    // Actualizamos el Map con el cliente ya configurado (por si scheduleReconnect lo necesita)
    this.connections.set(id_sensor_pk, { client, topic: topico, config: { broker, puerto, topico } });
  }

  // Desconectar sensor (limpia recursos)
  async disconnectSensor(id_sensor_pk: number) {
    const conn = this.connections.get(id_sensor_pk);
    if (!conn) return;

    try {
      conn.client.unsubscribe(conn.topic, (err) => {
        if (err) this.logger.warn(`Error al desuscribir sensor ${id_sensor_pk}: ${err.message}`);
      });
    } catch {
      // ignore
    }

    try {
      conn.client.end(true);
    } catch {
      // ignore
    }

    if (conn.reconnectTimeout) {
      clearTimeout(conn.reconnectTimeout);
      conn.reconnectTimeout = undefined;
    }

    this.connections.delete(id_sensor_pk);

    try {
      await this.sensoresService.updateStatus(id_sensor_pk, 'desconectado');
    } catch (err) {
      this.logger.error(`No se pudo actualizar estado al desconectar sensor ${id_sensor_pk}: ${(err as Error).message}`);
    }

    this.logger.log(`Sensor ${id_sensor_pk} desconectado y recursos liberados`);
  }

  // Publicar en el tópico de un sensor
  async publish(id_sensor_pk: number, message: string) {
    const conn = this.connections.get(id_sensor_pk);
    if (!conn) {
      this.logger.warn(`Publish descartado: no existe conexión para sensor ${id_sensor_pk}`);
      return;
    }
    conn.client.publish(conn.topic, message);
  }

  // Limpieza al apagar el módulo
  async onModuleDestroy() {
    this.logger.log('Cerrando conexiones MQTT...');
    for (const [id, conn] of this.connections.entries()) {
      try {
        if (conn.reconnectTimeout) clearTimeout(conn.reconnectTimeout);
        conn.client.end(true);
        await this.sensoresService.updateStatus(id, 'desconectado');
      } catch (err) {
        this.logger.error(`Error al destruir conexión ${id}: ${(err as Error).message}`);
      }
    }
    this.connections.clear();
  }
}
