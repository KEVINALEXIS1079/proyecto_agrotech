import { Module } from '@nestjs/common';
import { TipoActividadService } from './services/tipo-actividad.service';
import { TipoActividadController } from './controllers/tipo-actividad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoActividad } from './entities/tipo-actividad.entity';
import { TipoActividadGateway } from './gateways/tipo-actividad.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([TipoActividad])],
  controllers: [TipoActividadController],
  providers: [TipoActividadService, TipoActividadGateway],
  exports: [TipoActividadService],
})
export class TipoActividadModule {}
