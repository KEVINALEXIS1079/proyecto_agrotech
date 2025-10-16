import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultivoActividad } from 'src/modules/actividad/cultivo-actividad/entities/cultivo-actividad.entity';
import { CultivoActividadService } from './services/cultivo-actividad.service';
import { CultivoActividadController } from 'src/modules/actividad/cultivo-actividad/controllers/cultivo-actividad.controller';
import { Cultivo } from 'src/modules/cultivo/cultivos/entities/cultivo.entity';
import { Actividad } from 'src/modules/actividad/actividades/entities/actividad.entity';
import { CultivoActividadGateway } from './gateways/cultivo-actividades.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([CultivoActividad, Cultivo, Actividad]), 
  ],
  controllers: [CultivoActividadController], 
  providers: [CultivoActividadService, CultivoActividadGateway],
  exports: [CultivoActividadService], 
})
export class CultivosActividadesModule {}
