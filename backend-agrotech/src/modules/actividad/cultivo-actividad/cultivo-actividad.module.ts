import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultivoActividad } from './entities/cultivo-actividad.entity';
import { CultivoActividadService } from './cultivo-actividad.service';
import { CultivoActividadController } from './cultivo-actividad.controller';

import { Cultivo } from 'src/modules/cultivo/cultivos/entities/cultivo.entity';
import { Actividad } from 'src/modules/actividad/actividades/entities/actividades.entity';

import { CultivosModule } from 'src/modules/cultivo/cultivos/cultivos.module';
import { ActividadesModule } from 'src/modules/actividad/actividades/actividades.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CultivoActividad,
      Cultivo,
      Actividad, 
    ]),
    CultivosModule,     
    ActividadesModule,  
  ],
  controllers: [CultivoActividadController],
  providers: [CultivoActividadService],
})
export class CultivosActividadesModule {}
