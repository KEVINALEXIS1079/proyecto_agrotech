import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermisoModule } from './entities/permiso-module.entity';
import { PermisosModuleService } from './services/permiso-module.service';
import { PermisosModuleController } from './controllers/permiso-module.controller';
import { PermisosGateway } from '../permisos/gateways/permisos.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([PermisoModule])],
  controllers: [PermisosModuleController],
  providers: [PermisosModuleService, PermisosGateway],
  exports: [PermisosModuleService],
})
export class PermisoModuleModule {}
