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

@ApiTags('Proveedores')
@ApiBearerAuth('access-token')
@Controller('proveedores')
export class ProveedoresController {
  constructor(
    private readonly proveedoresService: ProveedoresService,
    private readonly proveedoresGateway: ProveedoresGateway,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:proveedores:create')
  @ApiOperation(ProveedoresDocs.create.operation)
  @ApiBody(ProveedoresDocs.create.body)
  @ApiResponses(ProveedoresDocs.create.response)
  async create(@Body() createProveedorDto: CreateProveedorDto) {
    const proveedor = await this.proveedoresService.create(createProveedorDto);
    this.proveedoresGateway.server.emit('proveedores:created', proveedor);
    return proveedor;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:proveedores:read')
  @ApiOperation(ProveedoresDocs.findAll.operation)
  @ApiResponses(ProveedoresDocs.findAll.response)
  async findAll() {
    return await this.proveedoresService.findAll();
  }

  @Get(':id_proveedor_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:proveedores:read')
  @ApiOperation(ProveedoresDocs.findOne.operation)
  @ApiResponses(ProveedoresDocs.findOne.response)
  async findOne(@Param('id_proveedor_pk', ParseIntPipe) id_proveedor_pk: number) {
    return await this.proveedoresService.findOne(id_proveedor_pk);
  }

  @Patch(':id_proveedor_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:proveedores:update')
  @ApiOperation(ProveedoresDocs.update.operation)
  @ApiBody(ProveedoresDocs.update.body)
  @ApiResponses(ProveedoresDocs.update.response)
  async update(
    @Param('id_proveedor_pk', ParseIntPipe) id_proveedor_pk: number,
    @Body() updateProveedorDto: UpdateProveedorDto,
  ) {
    const proveedor = await this.proveedoresService.update(id_proveedor_pk, updateProveedorDto);
    this.proveedoresGateway.server.emit('proveedores:updated', proveedor);
    return proveedor;
  }

  @Delete(':id_proveedor_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:proveedores:delete')
  @ApiOperation(ProveedoresDocs.remove.operation)
  @ApiResponses(ProveedoresDocs.remove.response)
  async remove(@Param('id_proveedor_pk', ParseIntPipe) id_proveedor_pk: number) {
    const deleted = await this.proveedoresService.remove(id_proveedor_pk);
    this.proveedoresGateway.server.emit('proveedores:removed', { id_proveedor_pk });
    return deleted;
  }

  @Patch('restore/:id_proveedor_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:proveedores:update')
  @ApiOperation(ProveedoresDocs.restore.operation)
  @ApiResponses(ProveedoresDocs.restore.response)
  async restore(@Param('id_proveedor_pk', ParseIntPipe) id_proveedor_pk: number) {
    const proveedor = await this.proveedoresService.restore(id_proveedor_pk);
    this.proveedoresGateway.server.emit('proveedores:restored', proveedor);
    return proveedor;
  }
}