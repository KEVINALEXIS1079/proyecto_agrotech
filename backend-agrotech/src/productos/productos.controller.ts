import {
  Controller, Get, Post, Body, Patch, Param, Delete,
} from '@nestjs/common';
import { ProductoService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post('registrar')
  create(@Body() dto: CreateProductoDto) {
    return this.productoService.create(dto);
  }

  @Get('listar')
  findAll() {
    return this.productoService.findAll();
  }

  @Get('buscar/:id')
  findOne(@Param('id') id: string) {
    return this.productoService.findOne(+id);
  }

  @Patch('actualizar/:id')
  update(@Param('id') id: string, @Body() dto: UpdateProductoDto) {
    return this.productoService.update(+id, dto);
  }

  @Delete('eliminar/:id')
  remove(@Param('id') id: string) {
    return this.productoService.remove(+id);
  }

  @Patch('restaurar/:id')
  restore(@Param('id') id: string) {
    return this.productoService.restore(+id);
  }
}