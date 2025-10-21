import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { ProveedoresService } from '../services/proveedores.service';
import { CreateProveedorDto } from '../dto/create-proveedor.dto';
import { UpdateProveedorDto } from '../dto/update-proveedor.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ProveedoresGateway } from '../gateways/proveedor.gateway';
import { ProveedoresDocs } from '../docs/proveedor.docs';

// Helper para aplicar todos los ApiResponse de forma dinámica
function ApiResponses(responses: { status: number; description: string }[]) {
  return applyDecorators(...responses.map(r => ApiResponse(r)));
}

// src/modules/inventario/proveedores/controllers/proveedores.controller.ts
// ...imports igual

@ApiTags('Proveedores')
@ApiBearerAuth('access-token')
@Controller('proveedores')
@UseGuards(JwtAuthGuard, PermisosGuard)
export class ProveedoresController {
  constructor(
    private readonly proveedoresService: ProveedoresService,
    private readonly proveedoresGateway: ProveedoresGateway,
  ) {}

  @Post()
  @PermisoRequerido('inventario:proveedores:create')
  @ApiOperation(ProveedoresDocs.create.operation)
  @ApiBody(ProveedoresDocs.create.body)
  @ApiResponses(ProveedoresDocs.create.response)
  async create(@Body() dto: CreateProveedorDto) {
    const result = await this.proveedoresService.create(dto);
    this.proveedoresGateway.server.emit('proveedores:created', result.data);
    return result;
  }

  @Get()
  @PermisoRequerido('inventario:proveedores:read')
  @ApiOperation(ProveedoresDocs.findAll.operation)
  @ApiResponses(ProveedoresDocs.findAll.response)
  findAll() {
    return this.proveedoresService.findAll();
  }

  @Get(':id_proveedor_pk')
  @PermisoRequerido('inventario:proveedores:read')
  @ApiOperation(ProveedoresDocs.findOne.operation)
  @ApiResponses(ProveedoresDocs.findOne.response)
  findOne(@Param('id_proveedor_pk', ParseIntPipe) id: number) {
    return this.proveedoresService.findOne(id);
  }

  @Patch(':id_proveedor_pk')
  @PermisoRequerido('inventario:proveedores:update')
  @ApiOperation(ProveedoresDocs.update.operation)
  @ApiBody(ProveedoresDocs.update.body)
  @ApiResponses(ProveedoresDocs.update.response)
  async update(@Param('id_proveedor_pk', ParseIntPipe) id: number, @Body() dto: UpdateProveedorDto) {
    const result = await this.proveedoresService.update(id, dto);
    this.proveedoresGateway.server.emit('proveedores:updated', result.data);
    return result;
  }

  @Delete(':id_proveedor_pk')
  @PermisoRequerido('inventario:proveedores:delete')
  @ApiOperation(ProveedoresDocs.remove.operation)
  @ApiResponses(ProveedoresDocs.remove.response)
  async remove(@Param('id_proveedor_pk', ParseIntPipe) id: number) {
    const result = await this.proveedoresService.remove(id);
    this.proveedoresGateway.server.emit('proveedores:removed', { id_proveedor_pk: id });
    return result;
  }

  @Patch('restore/:id_proveedor_pk')
  @PermisoRequerido('inventario:proveedores:update')
  @ApiOperation(ProveedoresDocs.restore.operation)
  @ApiResponses(ProveedoresDocs.restore.response)
  async restore(@Param('id_proveedor_pk', ParseIntPipe) id: number) {
    const result = await this.proveedoresService.restore(id);
    this.proveedoresGateway.server.emit('proveedores:restored', result.data);
    return result;
  }
}
