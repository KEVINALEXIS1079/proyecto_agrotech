import { Controller, Get, Patch, Body } from '@nestjs/common';
import { ProtocolSelectorService } from '../services/protocol-selector.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Protocolos Globales')
@Controller('protocolos')
export class ProtocolSelectorController {
  constructor(private readonly protocolSelectorService: ProtocolSelectorService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener protocolo actual' })
  getProtocoloActual() {
    return { protocolo_actual: this.protocolSelectorService.getProtocol() };
  }

  @Patch()
  @ApiOperation({ summary: 'Cambiar protocolo global de todos los sensores' })
  @ApiBody({
    schema: {
      example: { protocolo: 'MQTT' },
    },
  })
  async setProtocolo(@Body('protocolo') protocolo: 'HTTP' | 'HTTPS' | 'WebSocket' | 'MQTT') {
    return this.protocolSelectorService.setProtocol(protocolo);
  }
}
