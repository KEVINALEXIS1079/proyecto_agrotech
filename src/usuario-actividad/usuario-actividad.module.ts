import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioActividad } from './entities/usuario-actividad.entity';
import { UsuarioActividadService } from './usuario-actividad.service';
import { UsuarioActividadController } from './usuario-actividad.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioActividad])],
  controllers: [UsuarioActividadController],
  providers: [UsuarioActividadService],
})
export class UsuarioActividadModule {}

