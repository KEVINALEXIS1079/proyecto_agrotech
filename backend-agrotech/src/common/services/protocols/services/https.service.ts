import { Injectable, Logger } from '@nestjs/common';
import { IProtocolService } from '../../../interface/protocol.interface';
import axios from 'axios';

@Injectable()
export class HttpsService implements IProtocolService {
  private readonly logger = new Logger(HttpsService.name);

  async registerSensor(id_sensor_pk: number): Promise<void> {
    this.logger.log(`HTTPS -> Registrando sensor ${id_sensor_pk}`);
  }

  async connectSensor(id_sensor_pk: number): Promise<void> {
    this.logger.log(`HTTPS -> Conectando sensor ${id_sensor_pk}`);
  }

  async disconnectSensor(id_sensor_pk: number): Promise<void> {
    this.logger.log(`HTTPS -> Desconectando sensor ${id_sensor_pk}`);
  }

  async publishData(id_sensor_pk: number, data: any): Promise<void> {
    this.logger.log(`HTTPS -> Publicando datos del sensor ${id_sensor_pk}`);
    try {
      // await axios.post('https://secure-api/sensores/data', { id_sensor_pk, data });
    } catch (error) {
      this.logger.error(
        `HTTPS -> Error publicando datos del sensor ${id_sensor_pk}: ${error.message}`,
      );
    }
  }
}
