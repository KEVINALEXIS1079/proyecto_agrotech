import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensoresService } from './sensores.service';
import { SensoresController } from './sensores.controller';
import { Sensor } from './entities/sensor.entity';
import { Cultivo } from 'src/modules/cultivo/cultivos/entities/cultivo.entity';
import { TipoSensor } from '../tipo-sensor/entities/tipo-sensor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sensor, Cultivo, TipoSensor]), 
  ],
  controllers: [SensoresController],
  providers: [SensoresService],
})
export class SensoresModule {}
