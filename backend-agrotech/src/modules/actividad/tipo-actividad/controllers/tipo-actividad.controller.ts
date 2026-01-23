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
import { TipoActividadService } from '../services/tipo-actividad.service';
import { CreateTipoActividadDto } from '../dto/create-tipo-actividad.dto';
import { UpdateTipoActividadDto } from '../dto/update-tipo-actividad.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { TipoActividadGateway } from '../gateways/tipo-actividad.gateway';
import { TipoActividadDocs } from '../docs/tipo-actividad.docs';

// Helper para aplicar todos los ApiResponse de forma dinámica
function ApiResponses(responses: { status: number; description: string }[]) {
  return applyDecorators(...responses.map(r => ApiResponse(r)));
}

@ApiTags('Tipo-Actividad')
@ApiBearerAuth('access-token')
@Controller('tipo-actividad')
export class TipoActividadController {
  constructor(
    private readonly tipoActividadService: TipoActividadService,
    private readonly tipoActividadGateway: TipoActividadGateway,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-actividad:create')
  @ApiOperation(TipoActividadDocs.create.operation)
  @ApiBody(TipoActividadDocs.create.body)
  @ApiResponses(TipoActividadDocs.create.response)
  async create(@Body() createTipoActividadDto: CreateTipoActividadDto) {
    const tipoActividad = await this.tipoActividadService.create(createTipoActividadDto);
    this.tipoActividadGateway.server.emit('tipo-actividad:created', tipoActividad);
    return tipoActividad;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-actividad:read')
  @ApiOperation(TipoActividadDocs.findAll.operation)
  @ApiResponses(TipoActividadDocs.findAll.response)
  async findAll() {
    return await this.tipoActividadService.findAll();
  }

  @Get(':id_tipo_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-actividad:read')
  @ApiOperation(TipoActividadDocs.findOne.operation)
  @ApiResponses(TipoActividadDocs.findOne.response)
  async findOne(@Param('id_tipo_actividad_pk', ParseIntPipe) id_tipo_actividad_pk: number) {
    return await this.tipoActividadService.findOne(id_tipo_actividad_pk);
  }

  @Patch(':id_tipo_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-actividad:update')
  @ApiOperation(TipoActividadDocs.update.operation)
  @ApiBody(TipoActividadDocs.update.body)
  @ApiResponses(TipoActividadDocs.update.response)
  async update(
    @Param('id_tipo_actividad_pk', ParseIntPipe) id_tipo_actividad_pk: number,
    @Body() updateTipoActividadDto: UpdateTipoActividadDto,
  ) {
    const tipoActividad = await this.tipoActividadService.update(id_tipo_actividad_pk, updateTipoActividadDto);
    this.tipoActividadGateway.server.emit('tipo-actividad:updated', tipoActividad);
    return tipoActividad;
  }

  @Delete(':id_tipo_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-actividad:delete')
  @ApiOperation(TipoActividadDocs.remove.operation)
  @ApiResponses(TipoActividadDocs.remove.response)
  async remove(@Param('id_tipo_actividad_pk', ParseIntPipe) id_tipo_actividad_pk: number) {
    const deleted = await this.tipoActividadService.remove(id_tipo_actividad_pk);
    this.tipoActividadGateway.server.emit('tipo-actividad:removed', { id_tipo_actividad_pk });
    return deleted;
  }

  @Patch('restore/:id_tipo_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-actividad:update')
  @ApiOperation(TipoActividadDocs.restore.operation)
  @ApiResponses(TipoActividadDocs.restore.response)
  async restore(@Param('id_tipo_actividad_pk', ParseIntPipe) id_tipo_actividad_pk: number) {
    const tipoActividad = await this.tipoActividadService.restore(id_tipo_actividad_pk);
    this.tipoActividadGateway.server.emit('tipo-actividad:restored', tipoActividad);
    return tipoActividad;
  }
}