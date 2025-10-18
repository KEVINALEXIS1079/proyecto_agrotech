import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CultivoActividadService } from '../services/cultivo-actividad.service';
import { CultivoActividadGateway } from '../gateways/cultivo-actividades.gateway';
import { CreateCultivoActividadDto } from '../dto/create-cultivo-actividad.dto';
import { UpdateCultivoActividadDto } from '../dto/update-cultivo-actividad.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CultivoActividadDocs } from '../docs/cultivo-actividad.docs';

@ApiTags('Cultivo-Actividad')
@ApiBearerAuth('access-token')
@Controller('cultivo-actividad')
export class CultivoActividadController {
  constructor(
    private readonly cultivoActividadService: CultivoActividadService,
    private readonly cultivoActividadGateway: CultivoActividadGateway,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:cultivo-actividad:create')
  @ApiOperation(CultivoActividadDocs.create.operation)
  @ApiBody({ type: CreateCultivoActividadDto, examples: CultivoActividadDocs.create.examples })
  @ApiResponse(CultivoActividadDocs.create.responses[201])
  async create(@Body() dto: CreateCultivoActividadDto) {
    const data = await this.cultivoActividadService.create(dto);
    this.cultivoActividadGateway.server.emit('cultivo-actividad:created', data);
    return data;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:cultivo-actividad:read')
  @ApiOperation(CultivoActividadDocs.findAll.operation)
  @ApiResponse(CultivoActividadDocs.findAll.responses[200])
  findAll() {
    return this.cultivoActividadService.findAll();
  }

  @Get(':id_cultivo_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:cultivo-actividad:read')
  @ApiOperation(CultivoActividadDocs.findOne.operation)
  @ApiResponse(CultivoActividadDocs.findOne.responses[200])
  findOne(@Param('id_cultivo_actividad_pk', ParseIntPipe) id: number) {
    return this.cultivoActividadService.findOne(id);
  }

  @Patch(':id_cultivo_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:cultivo-actividad:update')
  @ApiOperation(CultivoActividadDocs.update.operation)
  @ApiBody({ type: UpdateCultivoActividadDto, examples: CultivoActividadDocs.update.examples })
  @ApiResponse(CultivoActividadDocs.update.responses[200])
  async update(@Param('id_cultivo_actividad_pk', ParseIntPipe) id: number, @Body() dto: UpdateCultivoActividadDto) {
    const data = await this.cultivoActividadService.update(id, dto);
    this.cultivoActividadGateway.server.emit('cultivo-actividad:updated', data);
    return data;
  }

  @Delete(':id_cultivo_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:cultivo-actividad:delete')
  @ApiOperation(CultivoActividadDocs.remove.operation)
  @ApiResponse(CultivoActividadDocs.remove.responses[200])
  async remove(@Param('id_cultivo_actividad_pk', ParseIntPipe) id: number) {
    const data = await this.cultivoActividadService.remove(id);
    this.cultivoActividadGateway.server.emit('cultivo-actividad:removed', { id });
    return data;
  }

  @Patch('restore/:id_cultivo_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:cultivo-actividad:update')
  @ApiOperation(CultivoActividadDocs.restore.operation)
  @ApiResponse(CultivoActividadDocs.restore.responses[200])
  async restore(@Param('id_cultivo_actividad_pk', ParseIntPipe) id: number) {
    const data = await this.cultivoActividadService.restore(id);
    this.cultivoActividadGateway.server.emit('cultivo-actividad:restored', data);
    return data;
  }
}
