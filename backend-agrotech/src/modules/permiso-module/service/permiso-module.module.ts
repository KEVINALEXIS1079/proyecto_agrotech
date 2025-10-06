import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermisoModule } from '../entities/permiso-module.entity';
import { PermisosModuleService } from '../service/permiso-module.service';
import { PermisosModuleController } from '../controller/permiso-module.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PermisoModule])],
  controllers: [PermisosModuleController],
  providers: [PermisosModuleService],
  exports: [PermisosModuleService],
})
export class PermisoModuleModule {}
