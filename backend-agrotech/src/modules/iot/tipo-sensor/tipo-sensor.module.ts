import { Module } from '@nestjs/common';
import { TipoSensorService } from './services/tipo-sensor.service';
import { TipoSensorController } from './controllers/tipo-sensor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoSensor } from './entities/tipo-sensor.entity';
import { TipoSensorGateway } from './gateways/tipo-sensor.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([TipoSensor])],
  controllers: [TipoSensorController],
  providers: [TipoSensorService, TipoSensorGateway],
  exports: [TipoSensorService]
})
export class TipoSensorModule {}
