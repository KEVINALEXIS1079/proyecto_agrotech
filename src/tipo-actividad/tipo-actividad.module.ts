import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoActividad } from './entities/tipo-actividad.entity';
import { TipoActividadService } from './tipo-actividad.service';
import { TipoActividadController } from './tipo-actividad.controller';

@Module({
  imports:[TypeOrmModule.forFeature([TipoActividad])],
  controllers: [TipoActividadController],
  providers: [TipoActividadService],
})
export class TipoActividadModule {}



