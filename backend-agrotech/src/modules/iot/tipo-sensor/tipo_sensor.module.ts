import { Module } from '@nestjs/common';
import { TipoSensorService } from './tipo-sensor.service';
import { TipoSensorController } from './tipo-sensor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoSensor } from './entities/tipo-sensor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoSensor])],
  controllers: [TipoSensorController],
  providers: [TipoSensorService],
})
export class TipoSensorModule {}
