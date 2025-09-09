import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { TipoActividadService } from './tipo-actividad.service';
import { CreateTipoActividadDto } from './dto/create-tipo-actividad.dto';
import { UpdateTipoActividadDto } from './dto/update-tipo-actividad.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { UseGuards } from '@nestjs/common';


@Controller('tipo-actividad')
export class TipoActividadController {
  constructor(private readonly tipoActividadService: TipoActividadService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Protegido por JWT y RolesGuard para asegurar que el usuario tiene el rol adecuado
  @Roles('Administrador', 'Instructor')
  create(@Body() createTipoActividadDto: CreateTipoActividadDto) {
    return this.tipoActividadService.create(createTipoActividadDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz')
  findAll() {
    return this.tipoActividadService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz')
  findOne(@Param('id') id: string) {
    return this.tipoActividadService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  update(@Param('id') id: string, @Body() updateTipoActividadDto: UpdateTipoActividadDto) {
    return this.tipoActividadService.update(+id, updateTipoActividadDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  remove(@Param('id') id: string) {
    return this.tipoActividadService.remove(+id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  restore(@Param('id') id: string) {
    return this.tipoActividadService.restore(+id);
  }
}
