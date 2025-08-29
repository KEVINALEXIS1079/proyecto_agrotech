import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CultivosActividadesService } from './cultivos_actividades.service';
import { CreateCultivosActividadesDto } from './dto/create-cultivos_actividade.dto';
import { UpdateCultivosActividadesDto } from './dto/update-cultivos_actividade.dto';
import { Roles } from 'src/autentication/permisos/roles.decorator';
import { JwtAuthGuard } from 'src/autentication/auth/jwt-auth.guard';
import { RolesGuard } from 'src/autentication/permisos/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('cultivos_actividades')
export class CultivosActividadesController {
  constructor(private readonly service: CultivosActividadesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Protegido por JWT y RolesGuard para asegurar que el usuario tiene el rol adecuado
  @Roles('Administrador', 'Instructor', 'Pasante')
  create(@Body() dto: CreateCultivosActividadesDto) {
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
    @Body() dto: UpdateCultivosActividadesDto,
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
