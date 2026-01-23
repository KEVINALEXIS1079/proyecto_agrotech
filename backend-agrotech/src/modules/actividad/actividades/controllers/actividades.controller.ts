import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ActividadesService } from '../services/actividades.service';
import { ActividadesGateway } from '../gateways/actividades.gateway';
import { CreateActividadDto } from '../dto/create-actividad.dto';
import { UpdateActividadDto } from '../dto/update-actividad.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ActividadesDocs } from '../docs/actividades.docs';

@ApiTags('Actividades')
@ApiBearerAuth('access-token')
@Controller('actividades')
export class ActividadesController {
  constructor(
    private readonly actividadesService: ActividadesService,
    private readonly actividadesGateway: ActividadesGateway,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:actividades:create')
  @ApiOperation(ActividadesDocs.create.operation)
  @ApiBody({ type: CreateActividadDto, examples: ActividadesDocs.create.examples })
  @ApiResponse(ActividadesDocs.create.responses[201])
  create(@Body() dto: CreateActividadDto) {
    const actividad = this.actividadesService.create(dto);
    this.actividadesGateway.server.emit('actividades:created', actividad);
    return actividad;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:actividades:read')
  @ApiOperation(ActividadesDocs.findAll.operation)
  @ApiResponse(ActividadesDocs.findAll.responses[200])
  findAll() {
    return this.actividadesService.findAll();
  }

  @Get(':id_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:actividades:read')
  @ApiOperation(ActividadesDocs.findOne.operation)
  @ApiResponse(ActividadesDocs.findOne.responses[200])
  findOne(@Param('id_actividad_pk', ParseIntPipe) id: number) {
    return this.actividadesService.findOne(id);
  }

  @Patch(':id_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:actividades:update')
  @ApiOperation(ActividadesDocs.update.operation)
  @ApiBody({ type: UpdateActividadDto, examples: ActividadesDocs.update.examples })
  @ApiResponse(ActividadesDocs.update.responses[200])
  update(@Param('id_actividad_pk', ParseIntPipe) id: number, @Body() dto: UpdateActividadDto) {
    const actividad = this.actividadesService.update(id, dto);
    this.actividadesGateway.server.emit('actividades:updated', actividad);
    return actividad;
  }

  @Delete(':id_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:actividades:delete')
  @ApiOperation(ActividadesDocs.remove.operation)
  @ApiResponse(ActividadesDocs.remove.responses[200])
  remove(@Param('id_actividad_pk', ParseIntPipe) id: number) {
    const actividad = this.actividadesService.remove(id);
    this.actividadesGateway.server.emit('actividades:removed', { id });
    return actividad;
  }

  @Patch('restore/:id_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:actividades:update')
  @ApiOperation(ActividadesDocs.restore.operation)
  @ApiResponse(ActividadesDocs.restore.responses[200])
  restore(@Param('id_actividad_pk', ParseIntPipe) id: number) {
    const actividad = this.actividadesService.restore(id);
    this.actividadesGateway.server.emit('actividades:restored', actividad);
    return actividad;
  }
}
