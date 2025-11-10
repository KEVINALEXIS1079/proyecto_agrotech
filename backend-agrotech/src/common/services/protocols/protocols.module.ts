import { Global, Module, forwardRef } from '@nestjs/common';
import { SensoresModule } from 'src/modules/iot/sensores/sensores.module';

// Servicios individuales
import { MqttService } from './services/mqtt.service';
import { HttpService } from './services/http.service';
import { HttpsService } from './services/https.service';
import { WebSocketService } from './services/websocket.service';

// Factory central
import { ProtocolFactory } from './factories/protocol.factory';

// Servicio y controlador global de protocolo
import { ProtocolSelectorService } from './services/protocol-selector.service';
import { ProtocolSelectorController } from './controllers/protocol-selector.controller';

@Global()
@Module({
  imports: [forwardRef(() => SensoresModule)],
  providers: [
    MqttService,
    HttpService,
    HttpsService,
    WebSocketService,
    ProtocolFactory,
    ProtocolSelectorService,
  ],
  controllers: [ProtocolSelectorController],
  exports: [
    ProtocolFactory,
    MqttService,
    HttpService,
    HttpsService,
    WebSocketService,
    ProtocolSelectorService,
  ],
})
export class ProtocolsModule {}
