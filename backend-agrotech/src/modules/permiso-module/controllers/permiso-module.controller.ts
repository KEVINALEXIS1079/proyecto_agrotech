import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { PermisosModuleService } from '../services/permiso-module.service';
import { CreatePermisoModuleDto } from '../dto/create-permiso-module.dto';
import { UpdatePermisoModuleDto } from '../dto/update-permiso-module.dto';

@Controller('permisos-module')
export class PermisosModuleController {
  constructor(private readonly permisosModuleService: PermisosModuleService) {}

  @Post()
  create(@Body() dto: CreatePermisoModuleDto) {
    return this.permisosModuleService.create(dto);
  }

  @Get()
  findAll() {
    return this.permisosModuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permisosModuleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePermisoModuleDto) {
    return this.permisosModuleService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permisosModuleService.remove(+id);
  }
}
