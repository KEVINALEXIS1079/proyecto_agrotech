import { Controller, Post, Get, Param, Patch, Delete, Body } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-role.dto';
import { Rol } from './entities/rol.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() dto: CreateRolDto): Promise<string> {
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
  update(@Param('id') id: number, @Body() dto: UpdateRolDto): Promise<string> {
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
