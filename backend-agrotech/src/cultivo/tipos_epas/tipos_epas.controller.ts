import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TiposEpasService } from './tipos_epas.service';
import { CreateTiposEpaDto } from './dto/create-tipos_epa.dto';
import { UpdateTiposEpaDto } from './dto/update-tipos_epa.dto';
import { Roles } from 'src/autentication/permisos/roles.decorator';
import { JwtAuthGuard } from 'src/autentication/auth/jwt-auth.guard';
import { RolesGuard } from 'src/autentication/permisos/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('tipos-epas')
export class TiposEpasController {
  constructor(private readonly tiposEpasService: TiposEpasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  create(@Body() dto: CreateTiposEpaDto) {
    return this.tiposEpasService.create(dto);
  }

  @Get()
  
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz', 'Usuario')
  findAll() {
    return this.tiposEpasService.findAll();
  }

  @Get(':id')
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz', 'Usuario')
  findOne(@Param('id') id: string) {
    return this.tiposEpasService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  update(@Param('id') id: string, @Body() dto: UpdateTiposEpaDto) {
    return this.tiposEpasService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  remove(@Param('id') id: string) {
    return this.tiposEpasService.remove(+id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  restore(@Param('id') id: string) {
    return this.tiposEpasService.restore(+id);
  }
}