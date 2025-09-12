import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoEpaService } from './tipo-epa.service';
import { CreateTipoEpaDto } from './dto/create-tipo-epa.dto';
import { UpdateTipoEpaDto } from './dto/update-tipo-epa.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('tipo-epa')
export class TipoEpaController {
  constructor(private readonly tiposEpasService: TipoEpaService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  create(@Body() dto: CreateTipoEpaDto) {
    return this.tiposEpasService.create(dto);
  }

  @Get()
  
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz')
  findAll() {
    return this.tiposEpasService.findAll();
  }

  @Get(':id')
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz')
  findOne(@Param('id') id: string) {
    return this.tiposEpasService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  update(@Param('id') id: string, @Body() dto: UpdateTipoEpaDto) {
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