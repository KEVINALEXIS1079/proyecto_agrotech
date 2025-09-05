import { Controller, Post, Get, Param, Patch, Delete, Body, ParseIntPipe } from '@nestjs/common';
import { UsuarioActividadService } from './usuario-actividad.service';
import { CreateUsuarioActividadDto } from './dto/create-usuario-actividad.dto';
import { UpdateUsuarioActividadDto } from './dto/update-usuario-actividad.dto';
import { UsuarioActividad } from './entities/usuario-actividad.entity';
import { Roles } from 'src/common/middleware/permisos/roles.decorator';
import { JwtAuthGuard } from 'src/modules/authentication/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/middleware/permisos/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('usuario-actividad')
export class UsuarioActividadController {
  constructor(private readonly usuarioActividadService: UsuarioActividadService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  create(@Body() dto: CreateUsuarioActividadDto): Promise<string> {
    return this.usuarioActividadService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz', 'Usuario')
  findAll(): Promise<UsuarioActividad[]> {
    return this.usuarioActividadService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz', 'Usuario')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UsuarioActividad> {
    return this.usuarioActividadService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUsuarioActividadDto): Promise<string> {
    return this.usuarioActividadService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  remove(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.usuarioActividadService.remove(id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  restore(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.usuarioActividadService.restore(id);
  }
}
