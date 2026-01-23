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
import { InsumoProveedorService } from '../services/insumo-proveedor.service';
import { CreateInsumoProveedorDto } from '../dto/create-insumo-proveedor.dto';
import { UpdateInsumoProveedorDto } from '../dto/update-insumo-proveedor.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { InsumoProveedorGateway } from '../gateways/insumo-proveedor';
import { InsumoProveedorDocs } from '../docs/insumo-proveedor.docs';

// Helper para aplicar todos los ApiResponse de forma dinámica
function ApiResponses(responses: { status: number; description: string }[]) {
  return applyDecorators(...responses.map(r => ApiResponse(r)));
}

@ApiTags('Insumo-Proveedor')
@ApiBearerAuth('access-token')
@Controller('insumo-proveedor')
export class InsumoProveedorController {
  constructor(
    private readonly insumoProveedorService: InsumoProveedorService,
    private readonly insumoProveedorGateway: InsumoProveedorGateway,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumo-proveedor:create')
  @ApiOperation(InsumoProveedorDocs.create.operation)
  @ApiBody(InsumoProveedorDocs.create.body)
  @ApiResponses(InsumoProveedorDocs.create.response)
  async create(@Body() createInsumoProveedorDto: CreateInsumoProveedorDto) {
    const insumoProveedor = await this.insumoProveedorService.create(createInsumoProveedorDto);
    this.insumoProveedorGateway.server.emit('insumo-proveedor:created', insumoProveedor);
    return insumoProveedor;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumo-proveedor:read')
  @ApiOperation(InsumoProveedorDocs.findAll.operation)
  @ApiResponses(InsumoProveedorDocs.findAll.response)
  async findAll() {
    return await this.insumoProveedorService.findAll();
  }

  @Get(':id_insumo_proveedor_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumo-proveedor:read')
  @ApiOperation(InsumoProveedorDocs.findOne.operation)
  @ApiResponses(InsumoProveedorDocs.findOne.response)
  async findOne(@Param('id_insumo_proveedor_pk', ParseIntPipe) id_insumo_proveedor_pk: number) {
    return await this.insumoProveedorService.findOne(id_insumo_proveedor_pk);
  }

  @Patch(':id_insumo_proveedor_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumo-proveedor:update')
  @ApiOperation(InsumoProveedorDocs.update.operation)
  @ApiBody(InsumoProveedorDocs.update.body)
  @ApiResponses(InsumoProveedorDocs.update.response)
  async update(
    @Param('id_insumo_proveedor_pk', ParseIntPipe) id_insumo_proveedor_pk: number,
    @Body() updateInsumoProveedorDto: UpdateInsumoProveedorDto,
  ) {
    const insumoProveedor = await this.insumoProveedorService.update(id_insumo_proveedor_pk, updateInsumoProveedorDto);
    this.insumoProveedorGateway.server.emit('insumo-proveedor:updated', insumoProveedor);
    return insumoProveedor;
  }

  @Delete(':id_insumo_proveedor_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumo-proveedor:delete')
  @ApiOperation(InsumoProveedorDocs.remove.operation)
  @ApiResponses(InsumoProveedorDocs.remove.response)
  async remove(@Param('id_insumo_proveedor_pk', ParseIntPipe) id_insumo_proveedor_pk: number) {
    const deleted = await this.insumoProveedorService.remove(id_insumo_proveedor_pk);
    this.insumoProveedorGateway.server.emit('insumo-proveedor:removed', { id_insumo_proveedor_pk });
    return deleted;
  }

  @Patch('restore/:id_insumo_proveedor_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumo-proveedor:update')
  @ApiOperation(InsumoProveedorDocs.restore.operation)
  @ApiResponses(InsumoProveedorDocs.restore.response)
  async restore(@Param('id_insumo_proveedor_pk', ParseIntPipe) id_insumo_proveedor_pk: number) {
    const insumoProveedor = await this.insumoProveedorService.restore(id_insumo_proveedor_pk);
    this.insumoProveedorGateway.server.emit('insumo-proveedor:restored', insumoProveedor);
    return insumoProveedor;
  }
}