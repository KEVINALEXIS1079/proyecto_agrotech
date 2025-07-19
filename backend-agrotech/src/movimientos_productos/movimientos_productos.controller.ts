import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MovimientosProductosService } from './movimientos_productos.service';
import { CreateMovimientosProductosDto } from './dto/create-movimientos_producto.dto';
import { UpdateMovimientosProductosDto } from './dto/update-movimientos_producto.dto';

@Controller('movimientos-productos')
export class MovimientosProductosController {
  constructor(private readonly service: MovimientosProductosService) {}

  @Post()
  create(@Body() dto: CreateMovimientosProductosDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMovimientosProductosDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Patch('restore/:id')
  restore(@Param('id') id: string) {
    return this.service.restore(+id);
  }
}