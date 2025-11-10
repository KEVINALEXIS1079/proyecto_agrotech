import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SensoresService } from './services/sensores.service';
import { SensoresController } from './controllers/sensores.controller';
import { SensoresGateway } from './gateways/sensor.gateway';

import { Sensor } from './entities/sensor.entity';
import { Lote } from 'src/modules/cultivo/lotes/entities/lote.entity';
import { TipoSensor } from '../tipo-sensor/entities/tipo-sensor.entity';

import { UsuariosModule } from 'src/modules/usuario/usuarios/usuarios.module';
import { ProtocolsModule } from 'src/common/services/protocols/protocols.module';
import { SensorLectura } from './entities/sensorLectura.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sensor, Lote, TipoSensor, SensorLectura]),
    UsuariosModule,
    forwardRef(() => ProtocolsModule), // rompe la circularidad
  ],
  controllers: [SensoresController],
  providers: [SensoresService, SensoresGateway], // Gateway normal
  exports: [SensoresService],
})
export class SensoresModule {}
