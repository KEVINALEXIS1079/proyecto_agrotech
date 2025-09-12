import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { MovimientoProductoService } from './movimiento-producto.service';
import { CreateMovimientoProductoDto } from './dto/create-movimiento-producto.dto';
import { UpdateMovimientoProductoDto } from './dto/update-movimiento-producto.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { UseGuards } from '@nestjs/common';


@Controller('movimiento-producto')
export class MovimientoProductoController {
  constructor(private readonly movimientoProductoService:MovimientoProductoService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Protegido por JWT y RolesGuard para asegurar que el usuario tiene el rol adecuado
  @Roles('Administrador', 'Instructor')
  create(@Body() createMovimientoProductoDto: CreateMovimientoProductoDto) {
    return this.movimientoProductoService.create(createMovimientoProductoDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz')
  findAll() {
    return this.movimientoProductoService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz')
  findOne(@Param('id') id: string) {
    return this.movimientoProductoService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  update(@Param('id') id: string, @Body() updateMovimientoProductoDto: UpdateMovimientoProductoDto) {
    return this.movimientoProductoService.update(+id, updateMovimientoProductoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  remove(@Param('id') id: string) {
    return this.movimientoProductoService.remove(+id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  restore(@Param('id') id: string) {
    return this.movimientoProductoService.restore(+id);
  }
}
