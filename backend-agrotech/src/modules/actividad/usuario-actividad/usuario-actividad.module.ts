import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioActividad } from './entities/usuario-actividad.entity';
import { Usuario } from 'src/modules/usuario/usuarios/entities/usuario.entity'
import { Actividad } from '../actividades/entities/actividad.entity'; 
import { UsuarioActividadService } from './services/usuario-actividad.service';
import { UsuarioActividadController } from './controllers/usuario-actividad.controller';
import { UsuarioActividadGateway } from './gateways/usuario-actividad.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioActividad, Usuario, Actividad]), 
  ],
  controllers: [UsuarioActividadController],
  providers: [UsuarioActividadService, UsuarioActividadGateway],
  exports: [UsuarioActividadService]
})
export class UsuarioActividadModule {}
