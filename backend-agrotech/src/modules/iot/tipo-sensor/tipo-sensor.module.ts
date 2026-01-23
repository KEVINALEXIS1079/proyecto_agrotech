import { Module } from '@nestjs/common';
import { TipoSensorService } from './services/tipo-sensor.service';
import { TipoSensorController } from './controllers/tipo-sensor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoSensor } from './entities/tipo-sensor.entity';
import { TipoSensorGateway } from './gateways/tipo-sensor.gateway';
import { CreateTiposSensorSeed } from 'src/database/seeds/create-tipos-sensor.seed';

@Module({
  imports: [TypeOrmModule.forFeature([TipoSensor])],
  controllers: [TipoSensorController],
  providers: [TipoSensorService, TipoSensorGateway, CreateTiposSensorSeed],
  exports: [TipoSensorService]
})
export class TipoSensorModule {}
