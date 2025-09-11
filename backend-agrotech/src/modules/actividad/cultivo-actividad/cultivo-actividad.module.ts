import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultivoActividad } from './entities/cultivo-actividad.entity';
import { CultivoActividadService } from './cultivo-actividad.service';
import { CultivoActividadController } from './cultivo-actividad.controller';
import { Cultivo } from 'src/modules/cultivo/cultivos/entities/cultivo.entity';
import { Actividad } from 'src/modules/actividad/actividades/entities/actividad.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CultivoActividad, Cultivo, Actividad]), 
  ],
  controllers: [CultivoActividadController], 
  providers: [CultivoActividadService],
  exports: [CultivoActividadService], 
})
export class CultivosActividadesModule {}
