import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultivosActividades } from './entities/cultivos_actividade.entity';
import { CultivosActividadesService } from './cultivos_actividades.service';
import { CultivosActividadesController } from './cultivos_actividades.controller';

import { Cultivo } from 'src/cultivo/cultivos/entities/cultivo.entity';
import { Actividades } from 'src/actividad/actividades/entities/actividades.entity';

import { CultivosModule } from 'src/cultivo/cultivos/cultivos.module';
import { ActividadesModule } from 'src/actividad/actividades/actividades.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CultivosActividades,
      Cultivo,
      Actividades, 
    ]),
    CultivosModule,     
    ActividadesModule,  
  ],
  controllers: [CultivosActividadesController],
  providers: [CultivosActividadesService],
})
export class CultivosActividadesModule {}
