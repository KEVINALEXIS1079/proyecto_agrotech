import { Module } from '@nestjs/common';
import { TipoActividadService } from './tipo-actividad.service';
import { TipoActividadController } from '../controller/tipo-actividad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoActividad } from '../entities/tipo-actividad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoActividad])],
  controllers: [TipoActividadController],
  providers: [TipoActividadService],
  exports: [TypeOrmModule],
})
export class TipoActividadModule {}
