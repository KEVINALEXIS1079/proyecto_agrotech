import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { CreateActividadDto } from './dto/create-actividad.dto';
import { UpdateActividadDto } from './dto/update-actividad.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  //crear actividad
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Protegido por JWT y RolesGuard para asegurar que el usuario tiene el rol adecuado
  @Roles('Administrador', 'Instructor', 'Pasante')
  create(@Body() createActividadesDto: CreateActividadDto) {
    return this.actividadesService.create(createActividadesDto);
  }


  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz')
  findAll() {
    return this.actividadesService.findAll();
  }

  @Get(':id_actividad_pk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz')
  findOne(@Param('id_actividad_pk', ParseIntPipe) id_actividad_pk: number) {
    return this.actividadesService.findOne(+id_actividad_pk);
  }

  
  @Patch(':id_actividad_pk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  update(@Param('id_actividad_pk', ParseIntPipe) id_actividad_pk: number, @Body() updateActividadesDto: UpdateActividadDto) {
    return this.actividadesService.update(+id_actividad_pk, updateActividadesDto);
  }

  @Delete(':id_actividad_pk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  remove(@Param('id_actividad_pk', ParseIntPipe) id_actividad_pk: number) {
    return this.actividadesService.remove(+id_actividad_pk);
  }

  @Patch('restore/:id_actividad_pk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  restore(@Param('id_actividad_pk', ParseIntPipe) id_actividad_pk: number) {
    return this.actividadesService.restore(+id_actividad_pk);
  }
}




