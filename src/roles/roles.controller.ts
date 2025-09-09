import { Controller, Post, Get, Param, Patch, Delete, Body } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Rol } from './entities/role.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() dto: CreateRoleDto): Promise<Rol> {
    return this.rolesService.create(dto);
  }

  @Get()
  findAll(): Promise<Rol[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Rol> {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateRoleDto): Promise<Rol> {
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<string> {
    return this.rolesService.remove(id);
  }

  @Patch('restore/:id')
  restore(@Param('id') id: number) {
  return this.rolesService.restore(id);
  }

}
