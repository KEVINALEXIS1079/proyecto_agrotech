import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioActividad } from './entities/usuario-actividad.entity';
import { Usuario } from 'src/modules/usuario/usuarios/entities/usuario.entity'
import { Actividad } from '../actividades/entities/actividades.entity'; 
import { UsuarioActividadService } from './usuario-actividad.service';
import { UsuarioActividadController } from './usuario-actividad.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioActividad, Usuario, Actividad]), 
  ],
  controllers: [UsuarioActividadController],
  providers: [UsuarioActividadService],
})
export class UsuarioActividadModule {}
