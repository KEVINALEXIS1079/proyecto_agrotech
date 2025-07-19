import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoSensor } from './entities/tipo_sensor.entity';
import { TipoSensorService } from './tipo_sensor.service';
import { TipoSensorController } from './tipo_sensor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoSensor])],
  controllers: [TipoSensorController],
  providers: [TipoSensorService],
})
export class TipoSensorModule {}
