import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from '../controller/usuarios.controller';
import { Usuario } from '../entities/usuario.entity';
import { Rol } from '../../roles/entities/rol.entity';
import { Permiso } from 'src/modules/permisos/entities/permiso.entity';
import { CorreoModule } from 'src/common/services/correo/correo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Rol, Permiso]), // Registramos todos los repositorios
    CorreoModule,
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
