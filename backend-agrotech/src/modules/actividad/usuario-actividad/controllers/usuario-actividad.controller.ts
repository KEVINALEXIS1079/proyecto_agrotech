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
import { UsuarioActividadService } from '../services/usuario-actividad.service';
import { CreateUsuarioActividadDto } from '../dto/create-usuario-actividad.dto';
import { UpdateUsuarioActividadDto } from '../dto/update-usuario-actividad.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UsuarioActividadGateway } from '../gateways/usuario-actividad.gateway';
import { UsuarioActividadDocs } from '../docs/usuario-actividad.docs';

// Helper para aplicar todos los ApiResponse de forma dinámica
function ApiResponses(responses: { status: number; description: string }[]) {
  return applyDecorators(...responses.map(r => ApiResponse(r)));
}

@ApiTags('Usuario-Actividad')
@ApiBearerAuth('access-token')
@Controller('usuario-actividad')
export class UsuarioActividadController {
  constructor(
    private readonly usuarioActividadService: UsuarioActividadService,
    private readonly usuarioActividadGateway: UsuarioActividadGateway,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:usuario-actividad:create')
  @ApiOperation(UsuarioActividadDocs.create.operation)
  @ApiBody(UsuarioActividadDocs.create.body)
  @ApiResponses(UsuarioActividadDocs.create.response)
  async create(@Body() createUsuarioActividadDto: CreateUsuarioActividadDto) {
    const usuarioActividad = await this.usuarioActividadService.create(createUsuarioActividadDto);
    this.usuarioActividadGateway.server.emit('usuario-actividad:created', usuarioActividad);
    return usuarioActividad;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:usuario-actividad:read')
  @ApiOperation(UsuarioActividadDocs.findAll.operation)
  @ApiResponses(UsuarioActividadDocs.findAll.response)
  async findAll() {
    return await this.usuarioActividadService.findAll();
  }

  @Get(':id_usuario_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:usuario-actividad:read')
  @ApiOperation(UsuarioActividadDocs.findOne.operation)
  @ApiResponses(UsuarioActividadDocs.findOne.response)
  async findOne(@Param('id_usuario_actividad_pk', ParseIntPipe) id_usuario_actividad_pk: number) {
    return await this.usuarioActividadService.findOne(id_usuario_actividad_pk);
  }

  @Patch(':id_usuario_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:usuario-actividad:update')
  @ApiOperation(UsuarioActividadDocs.update.operation)
  @ApiBody(UsuarioActividadDocs.update.body)
  @ApiResponses(UsuarioActividadDocs.update.response)
  async update(
    @Param('id_usuario_actividad_pk', ParseIntPipe) id_usuario_actividad_pk: number,
    @Body() updateUsuarioActividadDto: UpdateUsuarioActividadDto,
  ) {
    const usuarioActividad = await this.usuarioActividadService.update(id_usuario_actividad_pk, updateUsuarioActividadDto);
    this.usuarioActividadGateway.server.emit('usuario-actividad:updated', usuarioActividad);
    return usuarioActividad;
  }

  @Delete(':id_usuario_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:usuario-actividad:delete')
  @ApiOperation(UsuarioActividadDocs.remove.operation)
  @ApiResponses(UsuarioActividadDocs.remove.response)
  async remove(@Param('id_usuario_actividad_pk', ParseIntPipe) id_usuario_actividad_pk: number) {
    const deleted = await this.usuarioActividadService.remove(id_usuario_actividad_pk);
    this.usuarioActividadGateway.server.emit('usuario-actividad:removed', { id_usuario_actividad_pk });
    return deleted;
  }

  @Patch('restore/:id_usuario_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:usuario-actividad:update')
  @ApiOperation(UsuarioActividadDocs.restore.operation)
  @ApiResponses(UsuarioActividadDocs.restore.response)
  async restore(@Param('id_usuario_actividad_pk', ParseIntPipe) id_usuario_actividad_pk: number) {
    const usuarioActividad = await this.usuarioActividadService.restore(id_usuario_actividad_pk);
    this.usuarioActividadGateway.server.emit('usuario-actividad:restored', usuarioActividad);
    return usuarioActividad;
  }
}