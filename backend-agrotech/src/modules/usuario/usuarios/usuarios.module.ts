import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './services/usuarios.service';
import { UsuariosController } from './controllers/usuarios.controller';
import { Usuario } from './entities/usuario.entity';
import { Rol } from '../roles/entities/rol.entity';
import { Permiso } from 'src/modules/permisos/entities/permiso.entity';
import { CorreoModule } from 'src/common/services/correo/correo.module';
import { UsuariosGateway } from './gateways/usuarios.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Rol, Permiso]), // Registramos todos los repositorios
    CorreoModule,
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService, UsuariosGateway],
  exports: [UsuariosService],
})
export class UsuariosModule {}
