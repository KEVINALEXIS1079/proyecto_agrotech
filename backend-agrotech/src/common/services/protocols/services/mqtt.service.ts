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

  async onModuleInit() {
    try {
      const sensores = await this.sensoresService.findAll();
      for (const sensor of sensores) {
        if (sensor.activo) {
          this.connectSensor({
            id_sensor_pk: sensor.id_sensor_pk,
            broker: sensor.broker_sensor,
            puerto: sensor.puerto_sensor,
            topico: sensor.topico_sensor,
          }).catch((err) =>
            this.logger.error(
              `Error al conectar sensor ${sensor.id_sensor_pk}: ${err.message}`,
            ),
          );
        }
      }
    } catch (err) {
      this.logger.error(`Error en onModuleInit MQTT: ${(err as Error).message}`);
    }
  }

  async connectSensor(options: ConnectSensorOptions) {
    const { id_sensor_pk, broker, puerto, topico, onMessage } = options;

    if (this.connections.has(id_sensor_pk)) {
      await this.disconnectSensor(id_sensor_pk);
    }

    const url = `mqtt://${broker}:${puerto}`;
    this.logger.log(
      `MQTT -> Intentando conectar sensor ${id_sensor_pk} (${url})`,
    );

    const client = mqtt.connect(url, { reconnectPeriod: 0 });

    this.connections.set(id_sensor_pk, {
      client,
      topic: topico,
      config: { broker, puerto, topico },
    });

    const scheduleReconnect = () => {
      const conn = this.connections.get(id_sensor_pk);
      if (!conn) return;

      if (conn.reconnectTimeout) clearTimeout(conn.reconnectTimeout);
      this.logger.warn(`MQTT -> Reintentando sensor ${id_sensor_pk} en 5s`);

      conn.reconnectTimeout = setTimeout(async () => {
        try {
          await this.connectSensor({ id_sensor_pk, broker, puerto, topico });
        } catch (err) {
          this.logger.error(
            `MQTT -> Error reintentando conexión del sensor ${id_sensor_pk}: ${
              (err as Error).message
            }`,
          );
          const existing = this.connections.get(id_sensor_pk);
          if (existing) {
            existing.reconnectTimeout = setTimeout(scheduleReconnect, 5000);
          }
        }
      }, 5000);
    };

    client.on('connect', async () => {
      this.logger.log(`MQTT -> Sensor ${id_sensor_pk} conectado (${topico})`);
      client.subscribe(topico, (err) => {
        if (err)
          this.logger.error(`MQTT -> Error suscribiéndose: ${err.message}`);
      });
      await this.sensoresService.updateStatus(id_sensor_pk, 'conectado');
    });

    client.on('message', async (_, message) => {
      const valor = parseFloat(message.toString());
      if (isNaN(valor)) return;

      try {
        const sensorActualizado = await this.sensoresService.saveSensorData({
          id_sensor_pk,
          valor,
        });
        this.eventEmitter.emit('sensor.updated', sensorActualizado);
        if (onMessage) await onMessage(valor);
      } catch (err) {
        this.logger.error(
          `MQTT -> Error guardando dato de sensor ${id_sensor_pk}: ${
            (err as Error).message
          }`,
        );
      }
    });

    client.on('error', async (err: any) => {
      this.logger.error(
        `MQTT -> Error en sensor ${id_sensor_pk}: ${err.message}`,
      );
      await this.sensoresService.updateStatus(id_sensor_pk, 'desconectado');
      scheduleReconnect();
    });

    client.on('close', async () => {
      this.logger.warn(`MQTT -> Conexión cerrada (${id_sensor_pk})`);
      await this.sensoresService.updateStatus(id_sensor_pk, 'desconectado');
      scheduleReconnect();
    });
  }

  async disconnectSensor(id_sensor_pk: number) {
    const conn = this.connections.get(id_sensor_pk);
    if (!conn) return;

    try {
      conn.client.unsubscribe(conn.topic);
      conn.client.end(true);
      if (conn.reconnectTimeout) clearTimeout(conn.reconnectTimeout);
      await this.sensoresService.updateStatus(id_sensor_pk, 'desconectado');
      this.connections.delete(id_sensor_pk);
      this.logger.log(`MQTT -> Sensor ${id_sensor_pk} desconectado`);
    } catch (err) {
      this.logger.error(
        `MQTT -> Error al desconectar sensor ${id_sensor_pk}: ${
          (err as Error).message
        }`,
      );
    }
  }

  async publish(id_sensor_pk: number, message: string) {
    const conn = this.connections.get(id_sensor_pk);
    if (!conn) {
      this.logger.warn(`MQTT -> No existe conexión para ${id_sensor_pk}`);
      return;
    }
    conn.client.publish(conn.topic, message);
  }

  async onModuleDestroy() {
    this.logger.log('MQTT -> Cerrando todas las conexiones...');
    for (const [id, conn] of this.connections.entries()) {
      if (conn.reconnectTimeout) clearTimeout(conn.reconnectTimeout);
      conn.client.end(true);
      await this.sensoresService.updateStatus(id, 'desconectado');
    }
    this.connections.clear();
  }
}
