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
import { InsumosService } from '../services/insumos.service';
import { CreateInsumoDto } from '../dto/create-insumo.dto';
import { UpdateInsumoDto } from '../dto/update-insumo.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { InsumosGateway } from '../gateways/insumos.gateway';
import { InsumosDocs } from '../docs/insumos.docs';

// Helper para aplicar todos los ApiResponse de forma dinámica
function ApiResponses(responses: { status: number; description: string }[]) {
  return applyDecorators(...responses.map(r => ApiResponse(r)));
}

@ApiTags('Insumos')
@ApiBearerAuth('access-token')
@Controller('insumos')
export class InsumosController {
  constructor(
    private readonly insumosService: InsumosService,
    private readonly insumosGateway: InsumosGateway,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumos:create')
  @ApiOperation(InsumosDocs.create.operation)
  @ApiBody(InsumosDocs.create.body)
  @ApiResponses(InsumosDocs.create.response)
  async create(@Body() createInsumoDto: CreateInsumoDto) {
    const insumo = await this.insumosService.create(createInsumoDto);
    this.insumosGateway.server.emit('insumos:created', insumo);
    return insumo;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumos:read')
  @ApiOperation(InsumosDocs.findAll.operation)
  @ApiResponses(InsumosDocs.findAll.response)
  async findAll() {
    return await this.insumosService.findAll();
  }

  @Get(':id_insumo_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumos:read')
  @ApiOperation(InsumosDocs.findOne.operation)
  @ApiResponses(InsumosDocs.findOne.response)
  async findOne(@Param('id_insumo_pk', ParseIntPipe) id_insumo_pk: number) {
    return await this.insumosService.findOne(id_insumo_pk);
  }

  @Patch(':id_insumo_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumos:update')
  @ApiOperation(InsumosDocs.update.operation)
  @ApiBody(InsumosDocs.update.body)
  @ApiResponses(InsumosDocs.update.response)
  async update(
    @Param('id_insumo_pk', ParseIntPipe) id_insumo_pk: number,
    @Body() updateInsumoDto: UpdateInsumoDto,
  ) {
    const insumo = await this.insumosService.update(id_insumo_pk, updateInsumoDto);
    this.insumosGateway.server.emit('insumos:updated', insumo);
    return insumo;
  }

  @Delete(':id_insumo_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumos:delete')
  @ApiOperation(InsumosDocs.remove.operation)
  @ApiResponses(InsumosDocs.remove.response)
  async remove(@Param('id_insumo_pk', ParseIntPipe) id_insumo_pk: number) {
    const deleted = await this.insumosService.remove(id_insumo_pk);
    this.insumosGateway.server.emit('insumos:removed', { id_insumo_pk });
    return deleted;
  }

  @Patch('restore/:id_insumo_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumos:update')
  @ApiOperation(InsumosDocs.restore.operation)
  @ApiResponses(InsumosDocs.restore.response)
  async restore(@Param('id_insumo_pk', ParseIntPipe) id_insumo_pk: number) {
    const insumo = await this.insumosService.restore(id_insumo_pk);
    this.insumosGateway.server.emit('insumos:restored', insumo);
    return insumo;
  }
}