import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsuarioActividadService } from './usuario-actividad.service';
import { CreateUsuarioActividadDto } from './dto/create-usuario-actividad.dto';
import { UpdateUsuarioActividadDto } from './dto/update-usuario-actividad.dto';

@Controller('usuario-actividad')
export class UsuarioActividadController {
  constructor(private readonly usuarioActividadService: UsuarioActividadService) {}

  @Post()
  create(@Body() createUsuarioActividadDto: CreateUsuarioActividadDto) {
    return this.usuarioActividadService.create(createUsuarioActividadDto);
  }

  @Get()
  findAll() {
    return this.usuarioActividadService.findAll();
  }

  @Get(':id_usuarios_actividades_pk')
  findOne(@Param('id_usuarios_actividades_pk', ParseIntPipe) id_usuarios_actividades_pk: number) {
    return this.usuarioActividadService.findOne(+id_usuarios_actividades_pk);
  }

  @Patch(':id_usuarios_actividades_pk')
  update(@Param('id_usuarios_actividades_pk', ParseIntPipe) id_usuarios_actividades_pk: number, @Body() updateUsuarioActividadDto: UpdateUsuarioActividadDto) {
    return this.usuarioActividadService.update(+id_usuarios_actividades_pk, updateUsuarioActividadDto);
  }

  @Delete(':id_usuarios_actividades_pk')
  remove(@Param('id_usuarios_actividades_pk', ParseIntPipe) id_usuarios_actividades_pk: string) {
    return this.usuarioActividadService.remove(+id_usuarios_actividades_pk);
  }
}
