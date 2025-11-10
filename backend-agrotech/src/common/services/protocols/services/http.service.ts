import { Injectable, Logger } from '@nestjs/common';
import { IProtocolService } from '../../../interface/protocol.interface';
import axios from 'axios';

@Injectable()
export class HttpService implements IProtocolService {
  private readonly logger = new Logger(HttpService.name);

  async registerSensor(id_sensor_pk: number): Promise<void> {
    this.logger.log(`HTTP -> Registrando sensor ${id_sensor_pk}`);
  }

  async connectSensor(id_sensor_pk: number): Promise<void> {
    this.logger.log(`HTTP -> Conectando sensor ${id_sensor_pk}`);
  }

  async disconnectSensor(id_sensor_pk: number): Promise<void> {
    this.logger.log(`HTTP -> Desconectando sensor ${id_sensor_pk}`);
  }

  async publishData(id_sensor_pk: number, data: any): Promise<void> {
    this.logger.log(`HTTP -> Publicando datos del sensor ${id_sensor_pk}`);
    try {
      // await axios.post('http://api/sensores/data', { id_sensor_pk, data });
    } catch (error: any) {
      this.logger.error(`HTTP -> Error publicando datos del sensor ${id_sensor_pk}: ${error.message}`);
    }
  }
}
