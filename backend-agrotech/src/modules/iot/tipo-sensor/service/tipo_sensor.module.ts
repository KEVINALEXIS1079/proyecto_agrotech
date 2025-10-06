import { Module } from '@nestjs/common';
import { TipoSensorService } from '../service/tipo-sensor.service';
import { TipoSensorController } from '../controller/tipo-sensor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoSensor } from '../entities/tipo-sensor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoSensor])],
  controllers: [TipoSensorController],
  providers: [TipoSensorService],
})
export class TipoSensorModule {}
