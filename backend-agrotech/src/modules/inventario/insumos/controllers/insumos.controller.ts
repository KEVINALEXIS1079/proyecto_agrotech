// src/modules/inventario/insumos/controllers/insumos.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { InsumosService } from '../services/insumos.service';
import { CreateInsumoDto } from '../dto/create-insumo.dto';
import { UpdateInsumoDto } from '../dto/update-insumo.dto';
import { InsumosGateway } from '../gateways/insumos.gateway';
import { InsumosDocs } from '../docs/insumos.docs';

import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

// Helper para aplicar varios ApiResponse
function ApiResponses(responses: { status: number; description: string }[]) {
  return applyDecorators(...responses.map((r) => ApiResponse(r)));
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
  async create(@Body() dto: CreateInsumoDto) {
    const result = await this.insumosService.create(dto);
    this.insumosGateway.server.emit('insumos:created', result);
    return result;
  }

  // ÚNICO GET (con filtro opcional por almacén): /insumos?almacenId=1
  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumos:read')
  @ApiOperation(InsumosDocs.findAll.operation)
  @ApiResponses(InsumosDocs.findAll.response)
  async findAll(@Query('almacenId') almacenId?: string) {
    const id = almacenId ? Number(almacenId) : undefined;
    return await this.insumosService.findAll(id);
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
    @Body() dto: UpdateInsumoDto,
  ) {
    const result = await this.insumosService.update(id_insumo_pk, dto);
    this.insumosGateway.server.emit('insumos:updated', result);
    return result;
  }

  @Delete(':id_insumo_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumos:delete')
  @ApiOperation(InsumosDocs.remove.operation)
  @ApiResponses(InsumosDocs.remove.response)
  async remove(@Param('id_insumo_pk', ParseIntPipe) id_insumo_pk: number) {
    const result = await this.insumosService.remove(id_insumo_pk);
    this.insumosGateway.server.emit('insumos:removed', { id_insumo_pk });
    return result;
  }

  @Patch('restore/:id_insumo_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumos:update')
  @ApiOperation(InsumosDocs.restore.operation)
  @ApiResponses(InsumosDocs.restore.response)
  async restore(@Param('id_insumo_pk', ParseIntPipe) id_insumo_pk: number) {
    const result = await this.insumosService.restore(id_insumo_pk);
    this.insumosGateway.server.emit('insumos:restored', result);
    return result;
  }
}
