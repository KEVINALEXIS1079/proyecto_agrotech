import { PartialType } from '@nestjs/swagger';
import { CreatePermisoModuleDto } from './create-permiso-module.dto';

export class UpdatePermisoModuleDto extends PartialType(CreatePermisoModuleDto) {}
