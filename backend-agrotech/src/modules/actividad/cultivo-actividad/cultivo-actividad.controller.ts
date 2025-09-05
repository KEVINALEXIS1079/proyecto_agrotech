import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CultivoActividadService } from './cultivo-actividad.service';
import { CreateCultivoActividadDto } from './dto/create-cultivo-actividad.dto';
import { UpdateCultivoActividadDto } from './dto/update-cultivo-actividad.dto';
import { Roles } from 'src/common/middleware/permisos/roles.decorator';
import { JwtAuthGuard } from 'src/modules/authentication/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/middleware/permisos/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('cultivo-actividad')
export class CultivoActividadController {
  constructor(private readonly service: CultivoActividadService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Protegido por JWT y RolesGuard para asegurar que el usuario tiene el rol adecuado
  @Roles('Administrador', 'Instructor', 'Pasante')
  create(@Body() dto: CreateCultivoActividadDto) {
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Usuario')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id_cultivo_actividad_pk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Usuario')
  findOne(@Param('id_cultivo_actividad_pk', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id_cultivo_actividad_pk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  update(
    @Param('id_cultivo_actividad_pk', ParseIntPipe) id: number,
    @Body() dto: UpdateCultivoActividadDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id_cultivo_actividad_pk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  remove(@Param('id_cultivo_actividad_pk', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Patch('restore/:id_cultivo_actividad_pk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  restore(@Param('id_cultivo_actividad_pk', ParseIntPipe) id: number) {
    return this.service.restore(id);
  }
}
