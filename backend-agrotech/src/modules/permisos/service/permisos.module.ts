import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permiso } from '../entities/permiso.entity';
import { PermisosService } from '../service/permisos.service';
import { PermisosController } from '../controller/permisos.controller';
import { PermisoModule as PM } from 'src/modules/permiso-module/entities/permiso-module.entity';
import { Usuario } from 'src/modules/usuario/usuarios/entities/usuario.entity';
import { Rol } from 'src/modules/usuario/roles/entities/rol.entity';
import { UsuariosModule } from 'src/modules/usuario/usuarios/service/usuarios.module'; 
import { PermisosGuard } from 'src/common/guard/permisos.guard';
@Module({
  imports: [
    TypeOrmModule.forFeature([Permiso, PM, Usuario, Rol]),
    UsuariosModule, 
  ],
  controllers: [PermisosController],
  providers: [PermisosService, PermisosGuard], // registrar guard
  exports: [PermisosService, PermisosGuard], 
})
export class PermisosModule {}
