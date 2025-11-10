import { Injectable, Logger } from '@nestjs/common';
import { MqttService } from '../services/mqtt.service';
import { HttpService } from '../services/http.service';
import { HttpsService } from '../services/https.service';
import { WebSocketService } from '../services/websocket.service';

export type ProtocolType = 'mqtt' | 'http' | 'https' | 'websocket';

@Injectable()
export class ProtocolFactory {
  private readonly logger = new Logger(ProtocolFactory.name);

  constructor(
    private readonly mqttService: MqttService,
    private readonly httpService: HttpService,
    private readonly httpsService: HttpsService,
    private readonly websocketService: WebSocketService,
  ) {}

  /**
   * Devuelve el servicio de protocolo correspondiente.
   * @param type Tipo de protocolo ("mqtt", "http", "https", "websocket")
   */
  getProtocol(type: ProtocolType) {
    this.logger.debug(`Obteniendo servicio de protocolo: ${type}`);

    switch (type) {
      case 'mqtt':
        return this.mqttService;
      case 'http':
        return this.httpService;
      case 'https':
        return this.httpsService;
      case 'websocket':
        return this.websocketService;
      default:
        throw new Error(`Protocolo no soportado: ${type}`);
    }
  }
}
