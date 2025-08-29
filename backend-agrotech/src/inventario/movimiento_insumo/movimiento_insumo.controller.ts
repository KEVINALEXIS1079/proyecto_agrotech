import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MovimientosInsumoService } from './movimiento_insumo.service';
import { CreateMovimientoInsumoDto } from './dto/create-movimiento_insumo.dto';
import { UpdateMovimientoInsumoDto } from './dto/update-movimiento_insumo.dto';
import { Roles } from 'src/autentication/permisos/roles.decorator';
import { JwtAuthGuard } from 'src/autentication/auth/jwt-auth.guard';
import { RolesGuard } from 'src/autentication/permisos/roles.guard';

@Controller('movimientos-insumo')
export class MovimientosInsumoController {
  constructor(private readonly movimientosService: MovimientosInsumoService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  create(@Body() dto: CreateMovimientoInsumoDto) {
    return this.movimientosService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Usuario')
  findAll() {
    return this.movimientosService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Usuario')
  findOne(@Param('id') id: string) {
    return this.movimientosService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  update(@Param('id') id: string, @Body() dto: UpdateMovimientoInsumoDto) {
    return this.movimientosService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  remove(@Param('id') id: string) {
    return this.movimientosService.remove(+id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  restore(@Param('id') id: string) {
    return this.movimientosService.restore(+id);
  }
}
