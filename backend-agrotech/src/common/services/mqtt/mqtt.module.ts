import { forwardRef, Global, Module } from '@nestjs/common';
import { MqttService } from './services/mqtt.service';
import { SensoresModule } from 'src/modules/iot/sensores/sensores.module';

@Global()
@Module({
  imports: [forwardRef(() => SensoresModule)], // rompe la circularidad
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
