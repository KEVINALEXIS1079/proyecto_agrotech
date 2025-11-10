import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  ParseIntPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { PermisosService } from '../services/permisos.service';
import { CreatePermisoDto } from '../dto/create-permiso.dto';
import { TogglePermisoDto } from '../dto/toggle-permiso.dto';
import { AssignPermisosDto } from '../dto/assign-permisos.dto';

import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

@ApiTags('permisos')/* Expone el enpoind===> recibir y enviar consultas https */
@Controller('permisos')
export class PermisosController {
  private readonly logger = new Logger(PermisosController.name);

  constructor(private readonly permisosService: PermisosService) {}

  // =========================
  // CRUD del CATÁLOGO
  // =========================

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:create')
  @ApiOperation({ summary: 'Crear un nuevo permiso en el catálogo' })
  @ApiResponse({ status: 201, description: 'Permiso creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiBody({ type: CreatePermisoDto })
  async create(@Body() createDto: CreatePermisoDto) {
    this.logger.log(`POST /permisos - Body: ${JSON.stringify(createDto)}`);
    const result = await this.permisosService.create(createDto);
    this.logger.log('Permiso creado correctamente');
    return result;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar permisos del catálogo (opcional por módulo)' })
  @ApiResponse({ status: 200, description: 'Lista de permisos del catálogo.' })
  @ApiResponse({ status: 400, description: 'Parámetro moduleId inválido.' })
  async findAll(@Query('moduleId') moduleId?: string) {
    this.logger.log(`GET /permisos - moduleId: ${moduleId}`);
    const result = await this.permisosService.findAll(
      moduleId ? Number(moduleId) : undefined,
    );
    this.logger.log('Permisos listados correctamente');
    return result;
  }

  /**
   * Toggle en el CATÁLOGO (global). No confundir con los toggles de relación.
   */
  @Patch('toggle')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:update')
  @ApiOperation({ summary: 'Activar/Desactivar un permiso en el catálogo (global)' })
  @ApiResponse({ status: 200, description: 'Permiso del catálogo actualizado.' })
  @ApiBody({ type: TogglePermisoDto })
  async toggle(@Body() body: TogglePermisoDto) {
    this.logger.log(`PATCH /permisos/toggle - Body: ${JSON.stringify(body)}`);
    const result = await this.permisosService.toggle(body);
    this.logger.log('Permiso del catálogo actualizado');
    return result;
  }

  // =========================
  // Vistas para el FRONT (checklist)
  // =========================

  @Get('selection/user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Checklist para USUARIO: catálogo completo con selected + fuente (usuario/rol)',
  })
  async getSelectionForUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('moduleId') moduleId?: string,
  ) {
    this.logger.log(
      `GET /permisos/selection/user/${userId}?moduleId=${moduleId ?? ''}`,
    );
    return this.permisosService.getPermisosForUserSelection(
      userId,
      moduleId ? Number(moduleId) : undefined,
    );
  }

  @Get('selection/role/:roleId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Checklist para ROL: catálogo completo con selected',
  })
  async getSelectionForRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Query('moduleId') moduleId?: string,
  ) {
    this.logger.log(
      `GET /permisos/selection/role/${roleId}?moduleId=${moduleId ?? ''}`,
    );
    return this.permisosService.getPermisosForRoleSelection(
      roleId,
      moduleId ? Number(moduleId) : undefined,
    );
  }

  // =========================
  // Toggles de RELACIÓN (usuario-permiso / rol-permiso)
  // =========================

  @Patch('toggle/user')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:update')
  @ApiOperation({
    summary:
      'Activar/Desactivar un permiso sobre un USUARIO (relación usuario-permiso)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
        permisoId: { type: 'number' },
        enable: { type: 'boolean' },
      },
      required: ['userId', 'permisoId', 'enable'],
    },
  })
  async toggleOnUser(
    @Body()
    body: { userId: number; permisoId: number; enable: boolean },
  ) {
    this.logger.log(
      `PATCH /permisos/toggle/user - Body: ${JSON.stringify(body)}`,
    );
    return this.permisosService.togglePermisoOnUser(
      body.userId,
      body.permisoId,
      body.enable,
    );
  }

  @Patch('toggle/role')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:update')
  @ApiOperation({
    summary:
      'Activar/Desactivar un permiso sobre un ROL (relación rol-permiso)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roleId: { type: 'number' },
        permisoId: { type: 'number' },
        enable: { type: 'boolean' },
      },
      required: ['roleId', 'permisoId', 'enable'],
    },
  })
  async toggleOnRole(
    @Body()
    body: { roleId: number; permisoId: number; enable: boolean },
  ) {
    this.logger.log(
      `PATCH /permisos/toggle/role - Body: ${JSON.stringify(body)}`,
    );
    return this.permisosService.togglePermisoOnRole(
      body.roleId,
      body.permisoId,
      body.enable,
    );
  }

  // =========================
  // Asignaciones en bloque
  // =========================

  @Patch('roles/assign')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:update')
  @ApiOperation({ summary: 'Asignar un conjunto de permisos a un ROL' })
  @ApiResponse({
    status: 200,
    description: 'Permisos asignados al rol exitosamente.',
  })
  @ApiBody({ type: AssignPermisosDto })
  async assignToRole(@Body() dto: AssignPermisosDto) {
    this.logger.log(
      `PATCH /permisos/roles/assign - Body: ${JSON.stringify(dto)}`,
    );
    return this.permisosService.assignPermisosToRole(dto);
  }

  @Patch('usuarios/assign')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:update')
  @ApiOperation({ summary: 'Asignar un conjunto de permisos a un USUARIO' })
  @ApiResponse({
    status: 200,
    description: 'Permisos asignados al usuario exitosamente.',
  })
  @ApiBody({ type: AssignPermisosDto })
  async assignToUser(@Body() dto: AssignPermisosDto) {
    this.logger.log(
      `PATCH /permisos/usuarios/assign - Body: ${JSON.stringify(dto)}`,
    );
    return this.permisosService.assignPermisosToUser(dto);
  }
}
