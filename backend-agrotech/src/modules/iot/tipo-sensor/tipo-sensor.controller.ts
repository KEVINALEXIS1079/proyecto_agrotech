import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoSensorService } from './tipo-sensor.service';
import { CreateTipoSensorDto } from './dto/create-tipo-sensor.dto';
import { UpdateTipoSensorDto } from './dto/update-tipo-sensor.dto';
import { Roles } from 'src/common/middleware/permisos/roles.decorator';
import { JwtAuthGuard } from 'src/modules/authentication/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/middleware/permisos/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('tipo-sensor')
export class TipoSensorController {
  constructor(private readonly tipoSensorService: TipoSensorService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  create(@Body() dto: CreateTipoSensorDto) {
    return this.tipoSensorService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz', 'Usuario')
  findAll() {
    return this.tipoSensorService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz', 'Usuario')
  findOne(@Param('id') id: string) {
    return this.tipoSensorService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  update(@Param('id') id: string, @Body() dto: UpdateTipoSensorDto) {
    return this.tipoSensorService.update(+id, dto);
  }

  @Delete(':id')
  
  @Roles('Administrador', 'Instructor')
  remove(@Param('id') id: string) {
    return this.tipoSensorService.remove(+id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  restore(@Param('id') id: string) {
    return this.tipoSensorService.restore(+id);
  }
}
