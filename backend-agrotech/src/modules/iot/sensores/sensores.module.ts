import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SensoresService } from './services/sensores.service';
import { SensoresController } from './controllers/sensores.controller';

import { Sensor } from './entities/sensor.entity';
import { Cultivo } from 'src/modules/cultivo/cultivos/entities/cultivo.entity';
import { TipoSensor } from '../tipo-sensor/entities/tipo-sensor.entity';

import { UsuariosModule } from 'src/modules/usuario/usuarios/usuarios.module'; 
import { SensoresGateway } from './gateways/sensor.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sensor, Cultivo, TipoSensor]),
    UsuariosModule, 
  ],
  controllers: [SensoresController],
  providers: [SensoresService, SensoresGateway],
  exports: [SensoresService],
})
export class SensoresModule {}
