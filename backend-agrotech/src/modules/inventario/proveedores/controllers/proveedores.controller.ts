import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProveedoresService } from '../services/proveedores.service';
import { CreateProveedorDto } from '../dto/create-proveedor.dto';
import { UpdateProveedorDto } from '../dto/update-proveedor.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:proveedores:create')
  create(@Body() createProveedoresDto: CreateProveedorDto) {
    return this.proveedoresService.create(createProveedoresDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:proveedores:read')
  findAll() {
    return this.proveedoresService.findAll();
  }

  @Get(':id_proveedor_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:proveedores:read')
  findOne(@Param('id_proveedor_pk', ParseIntPipe) id_proveedor_pk: number) {
    return this.proveedoresService.findOne(id_proveedor_pk);
  }

  @Patch(':id_proveedor_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:proveedores:update')
  update(
    @Param('id_proveedor_pk', ParseIntPipe) id_proveedor_pk: number,
    @Body() updateProveedoresDto: UpdateProveedorDto,
  ) {
    return this.proveedoresService.update(id_proveedor_pk, updateProveedoresDto);
  }

  @Delete(':id_proveedor_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:proveedores:delete')
  remove(@Param('id_proveedor_pk', ParseIntPipe) id_proveedor_pk: number) {
    return this.proveedoresService.remove(id_proveedor_pk);
  }

  @Patch('restore/:id_proveedor_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:proveedores:update')
  restore(@Param('id_proveedor_pk', ParseIntPipe) id_proveedor_pk: number) {
    return this.proveedoresService.restore(id_proveedor_pk);
  }
}