import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { CreateProveedoresDto } from './dto/create-proveedore.dto';
import { UpdateProveedoresDto } from './dto/update-proveedore.dto';

@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  // Crear un nuevo proveedor
  @Post()
  create(@Body() createProveedoresDto: CreateProveedoresDto) {
    return this.proveedoresService.create(createProveedoresDto);
  }

  // Listar todos los proveedores
  @Get()
  findAll() {
    return this.proveedoresService.findAll();
  }

  // Buscar proveedor por ID
  @Get(':id_proveedor_pk')
  findOne(@Param('id_proveedor_pk', ParseIntPipe) id_proveedor_pk: number) {
    return this.proveedoresService.findOne(id_proveedor_pk);
  }

  // Actualizar proveedor por ID
  @Patch(':id_proveedor_pk')
  update(
    @Param('id_proveedor_pk', ParseIntPipe) id_proveedor_pk: number,
    @Body() updateProveedoresDto: UpdateProveedoresDto,
  ) {
    return this.proveedoresService.update(id_proveedor_pk, updateProveedoresDto);
  }

  // Eliminar proveedor por ID
  @Delete(':id_proveedor_pk')
  remove(@Param('id_proveedor_pk', ParseIntPipe) id_proveedor_pk: number) {
    return this.proveedoresService.remove(id_proveedor_pk);
  }
}