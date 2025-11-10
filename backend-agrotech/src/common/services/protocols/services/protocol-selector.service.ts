import { Injectable, Logger } from '@nestjs/common';
import { SensoresService } from 'src/modules/iot/sensores/services/sensores.service';

@Injectable()
export class ProtocolSelectorService {
  private readonly logger = new Logger(ProtocolSelectorService.name);
  private currentProtocol: 'HTTP' | 'HTTPS' | 'WebSocket' | 'MQTT' = 'MQTT';

  constructor(private readonly sensoresService: SensoresService) {}

  // =============================
  // Obtener protocolo actual
  // =============================
  getProtocol() {
    return this.currentProtocol;
  }

  // =============================
  // Cambiar protocolo global
  // =============================
  async setProtocol(
    protocol: 'HTTP' | 'HTTPS' | 'WebSocket' | 'MQTT',
  ): Promise<{ message: string; protocolo_actual: string }> {
    this.currentProtocol = protocol;
    this.logger.log(`Protocolo global actualizado a: ${protocol}`);

    // Actualiza todos los sensores activos con el nuevo protocolo
    await this.sensoresService.updateAllProtocols(protocol);

    return {
      message: `Protocolo global cambiado correctamente a ${protocol}`,
      protocolo_actual: this.currentProtocol,
    };
  }
}
