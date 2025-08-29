import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioActividad } from './entities/usuario_actividad.entity';
import { Usuario } from 'src/usuario/usuarios/entities/usuario.entity'
import { Actividades } from '../actividades/entities/actividades.entity'; 
import { UsuarioActividadService } from './usuario_actividad.service';
import { UsuarioActividadController } from './usuario_actividad.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioActividad, Usuario, Actividades]), 
  ],
  controllers: [UsuarioActividadController],
  providers: [UsuarioActividadService],
})
export class UsuarioActividadModule {}
