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
import { MovimientoInsumoService } from '../services/movimiento-insumo.service';
import { CreateMovimientoInsumoDto } from '../dto/create-movimiento-insumo.dto';
import { UpdateMovimientoInsumoDto } from '../dto/update-movimiento-insumo.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { MovimientoInsumoGateway } from '../gateways/movimiento-insumo.gateway';
import { MovimientoInsumoDocs } from '../docs/movimineto-insumo.docs';

// Helper para aplicar todos los ApiResponse de forma dinámica
function ApiResponses(responses: { status: number; description: string }[]) {
  return applyDecorators(...responses.map(r => ApiResponse(r)));
}

@ApiTags('Movimiento-Insumo')
@ApiBearerAuth('access-token')
@Controller('movimiento-insumo')
export class MovimientoInsumoController {
  constructor(
    private readonly movimientosService: MovimientoInsumoService,
    private readonly movimientoInsumoGateway: MovimientoInsumoGateway,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:movimientos:read')
  @ApiOperation(MovimientoInsumoDocs.create.operation)
  @ApiBody(MovimientoInsumoDocs.create.body)
  @ApiResponses(MovimientoInsumoDocs.create.response)
  async create(@Body() createMovimientoInsumoDto: CreateMovimientoInsumoDto) {
    const movimiento = await this.movimientosService.create(createMovimientoInsumoDto);
    this.movimientoInsumoGateway.server.emit('movimiento-insumo:created', movimiento);
    return movimiento;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:movimientos:read')
  @ApiOperation(MovimientoInsumoDocs.findAll.operation)
  @ApiResponses(MovimientoInsumoDocs.findAll.response)
  async findAll() {
    return await this.movimientosService.findAll();
  }

  @Get(':id_movimiento_insumo_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:movimientos:read')
  @ApiOperation(MovimientoInsumoDocs.findOne.operation)
  @ApiResponses(MovimientoInsumoDocs.findOne.response)
  async findOne(@Param('id_movimiento_insumo_pk', ParseIntPipe) id_movimiento_insumo_pk: number) {
    return await this.movimientosService.findOne(id_movimiento_insumo_pk);
  }

  @Patch(':id_movimiento_insumo_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:movimientos:update')
  @ApiOperation(MovimientoInsumoDocs.update.operation)
  @ApiBody(MovimientoInsumoDocs.update.body)
  @ApiResponses(MovimientoInsumoDocs.update.response)
  async update(
    @Param('id_movimiento_insumo_pk', ParseIntPipe) id_movimiento_insumo_pk: number,
    @Body() updateMovimientoInsumoDto: UpdateMovimientoInsumoDto,
  ) {
    const movimiento = await this.movimientosService.update(id_movimiento_insumo_pk, updateMovimientoInsumoDto);
    this.movimientoInsumoGateway.server.emit('movimiento-insumo:updated', movimiento);
    return movimiento;
  }

  @Delete(':id_movimiento_insumo_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:movimientos:delete')
  @ApiOperation(MovimientoInsumoDocs.remove.operation)
  @ApiResponses(MovimientoInsumoDocs.remove.response)
  async remove(@Param('id_movimiento_insumo_pk', ParseIntPipe) id_movimiento_insumo_pk: number) {
    const deleted = await this.movimientosService.remove(id_movimiento_insumo_pk);
    this.movimientoInsumoGateway.server.emit('movimiento-insumo:removed', { id_movimiento_insumo_pk });
    return deleted;
  }

  @Patch('restore/:id_movimiento_insumo_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:movimientos:restore')
  @ApiOperation(MovimientoInsumoDocs.restore.operation)
  @ApiResponses(MovimientoInsumoDocs.restore.response)
  async restore(@Param('id_movimiento_insumo_pk', ParseIntPipe) id_movimiento_insumo_pk: number) {
    const movimiento = await this.movimientosService.restore(id_movimiento_insumo_pk);
    this.movimientoInsumoGateway.server.emit('movimiento-insumo:restored', movimiento);
    return movimiento;
  }
}