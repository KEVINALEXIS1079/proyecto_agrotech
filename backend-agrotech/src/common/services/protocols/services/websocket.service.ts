import { Injectable, Logger } from '@nestjs/common';
import { IProtocolService } from '../../../interface/protocol.interface';
import { WebSocket } from 'ws';

interface WebSocketConnection {
  client: WebSocket;
  url: string;
}

@Injectable()
export class WebSocketService implements IProtocolService {
  private readonly logger = new Logger(WebSocketService.name);
  private connections = new Map<number, WebSocketConnection>();

  async registerSensor(id_sensor_pk: number): Promise<void> {
    this.logger.log(`WebSocket -> Registrando sensor ${id_sensor_pk}`);
  }

  async connectSensor(id_sensor_pk: number): Promise<void> {
    const url = `ws://localhost:8080/sensor/${id_sensor_pk}`;
    this.logger.log(`WebSocket -> Conectando sensor ${id_sensor_pk} (${url})`);

    const ws = new WebSocket(url);
    this.connections.set(id_sensor_pk, { client: ws, url });

    ws.on('open', () =>
      this.logger.log(`WebSocket -> Sensor ${id_sensor_pk} conectado`),
    );

    ws.on('message', (msg) =>
      this.logger.log(
        `WebSocket -> Mensaje recibido del sensor ${id_sensor_pk}: ${msg}`,
      ),
    );

    ws.on('close', () => {
      this.logger.warn(`WebSocket -> Conexión cerrada (${id_sensor_pk})`);
      this.connections.delete(id_sensor_pk);
    });

    ws.on('error', (err) =>
      this.logger.error(
        `WebSocket -> Error en sensor ${id_sensor_pk}: ${err.message}`,
      ),
    );
  }

  async disconnectSensor(id_sensor_pk: number): Promise<void> {
    const conn = this.connections.get(id_sensor_pk);
    if (!conn) return;

    conn.client.close();
    this.logger.log(`WebSocket -> Sensor ${id_sensor_pk} desconectado`);
    this.connections.delete(id_sensor_pk);
  }

  async publishData(id_sensor_pk: number, data: any): Promise<void> {
    const conn = this.connections.get(id_sensor_pk);
    if (!conn) {
      this.logger.warn(`WebSocket -> No hay conexión para ${id_sensor_pk}`);
      return;
    }

    try {
      conn.client.send(JSON.stringify(data));
      this.logger.log(`WebSocket -> Datos enviados al sensor ${id_sensor_pk}`);
    } catch (error) {
      this.logger.error(
        `WebSocket -> Error enviando datos al sensor ${id_sensor_pk}: ${error.message}`,
      );
    }
  }
}
