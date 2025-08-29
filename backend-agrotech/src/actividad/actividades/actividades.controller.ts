import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { CreateActividadesDto } from './dto/create-actividades.dto';
import { UpdateActividadesDto } from './dto/update-actividades.dto';
import { Roles } from 'src/autentication/permisos/roles.decorator';
import { JwtAuthGuard } from 'src/autentication/auth/jwt-auth.guard';
import { RolesGuard } from 'src/autentication/permisos/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  //crear actividad
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Protegido por JWT y RolesGuard para asegurar que el usuario tiene el rol adecuado
  @Roles('Administrador', 'Instructor', 'Pasante')
  create(@Body() createActividadesDto: CreateActividadesDto) {
    return this.actividadesService.create(createActividadesDto);
  }


  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Usuario')
  findAll() {
    return this.actividadesService.findAll();
  }

  @Get(':id_actividad_pk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Usuario')
  findOne(@Param('id_actividad_pk', ParseIntPipe) id_actividad_pk: number) {
    return this.actividadesService.findOne(+id_actividad_pk);
  }

  
  @Patch(':id_actividad_pk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  update(@Param('id_actividad_pk', ParseIntPipe) id_actividad_pk: number, @Body() updateActividadesDto: UpdateActividadesDto) {
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




