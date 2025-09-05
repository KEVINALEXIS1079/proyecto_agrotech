import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoCultivoService } from './tipo-cultivo.service';
import { CreateTipoCultivoDto } from './dto/create-tipo-cultivo.dto';
import { UpdateTipoCultivoDto } from './dto/update-tipo-cultivo.dto';
import { Roles } from 'src/common/middleware/permisos/roles.decorator';
import { JwtAuthGuard } from 'src/modules/authentication/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/middleware/permisos/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('tipo-cultivo')
export class TipoCultivoController {
  constructor(private readonly tipoCultivoService: TipoCultivoService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  create(@Body() createTipoCultivoDto: CreateTipoCultivoDto) {
    return this.tipoCultivoService.create(createTipoCultivoDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz', 'Usuario')
  findAll() {
    return this.tipoCultivoService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz', 'Usuario')
  findOne(@Param('id') id: string) {
    return this.tipoCultivoService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  update(@Param('id') id: string, @Body() updateTipoCultivoDto: UpdateTipoCultivoDto) {
    return this.tipoCultivoService.update(+id, updateTipoCultivoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  remove(@Param('id') id: string) {
    return this.tipoCultivoService.remove(+id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  restore(@Param('id') id: string) {
    return this.tipoCultivoService.restore(+id);
  }
}
