// src/common/services/mqtt/mqtt.service.ts
import { Injectable, Logger, OnModuleDestroy, OnModuleInit, forwardRef, Inject } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { SensoresService } from 'src/modules/iot/sensores/services/sensores.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface MqttConnection {
  client: mqtt.MqttClient;
  topic: string;
}

interface ConnectSensorOptions {
  id_sensor_pk: number;
  broker: string;
  puerto: number;
  topico: string;
  onMessage?: (valor: number) => Promise<void>; // callback opcional
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
    const sensores = await this.sensoresService.findAll();
    for (const sensor of sensores) {
      if (sensor.activo) {
        await this.connectSensor({
          id_sensor_pk: sensor.id_sensor_pk,
          broker: sensor.broker_sensor,
          puerto: sensor.puerto_sensor,
          topico: sensor.topico_sensor,
        });
      }
    }
  }

  async connectSensor(options: ConnectSensorOptions) {
    const { id_sensor_pk, broker, puerto, topico, onMessage } = options;

    if (this.connections.has(id_sensor_pk)) await this.disconnectSensor(id_sensor_pk);

    const url = `mqtt://${broker}:${puerto}`;
    const client = mqtt.connect(url, { reconnectPeriod: 5000 });

    client.on('connect', () => {
      this.logger.log(`Sensor ${id_sensor_pk} conectado al tópico "${topico}"`);
      client.subscribe(topico, (err) => {
        if (err) this.logger.error(`Error suscribiéndose a ${topico}: ${err.message}`);
      });
    });

    client.on('message', async (_, message) => {
      const valor = parseFloat(message.toString());
      if (isNaN(valor)) return;

      try {
        const sensorActualizado = await this.sensoresService.saveSensorData({ id_sensor_pk, valor });
        this.eventEmitter.emit('sensor.updated', sensorActualizado);

        if (onMessage) await onMessage(valor);
      } catch (error) {
        this.logger.error(`Error guardando sensor ${id_sensor_pk}: ${error.message}`);
      }
    });

    client.on('error', (err) => this.logger.error(`Sensor ${id_sensor_pk} MQTT error: ${err.message}`));
    client.on('close', () => this.logger.warn(`Conexión MQTT cerrada para sensor ${id_sensor_pk}`));

    this.connections.set(id_sensor_pk, { client, topic: topico });
  }

  async disconnectSensor(id_sensor_pk: number) {
    const conn = this.connections.get(id_sensor_pk);
    if (!conn) return;

    conn.client.unsubscribe(conn.topic, () => this.logger.log(`Sensor ${id_sensor_pk} desuscrito`));
    conn.client.end(true);
    this.connections.delete(id_sensor_pk);
  }

  async publish(id_sensor_pk: number, message: string) {
    const conn = this.connections.get(id_sensor_pk);
    if (!conn) return;
    conn.client.publish(conn.topic, message);
  }

  async onModuleDestroy() {
    for (const [id, conn] of this.connections.entries()) {
      conn.client.end(true);
    }
    this.connections.clear();
  }
}
