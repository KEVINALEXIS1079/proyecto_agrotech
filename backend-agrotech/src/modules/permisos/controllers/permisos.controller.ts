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
import { PermisosService } from '../services/permisos.service';
import { CreatePermisoDto } from '../dto/create-permiso.dto';
import { TogglePermisoDto } from '../dto/toggle-permiso.dto';
import { AssignPermisosDto } from '../dto/assign-permisos.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('permisos')
@Controller('permisos')
export class PermisosController {
  private readonly logger = new Logger(PermisosController.name);

  constructor(private readonly permisosService: PermisosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:create')
  @ApiOperation({ summary: 'Crear un nuevo permiso' })
  @ApiResponse({ status: 201, description: 'Permiso creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiBody({ type: CreatePermisoDto })
  async create(@Body() createDto: CreatePermisoDto) {
    this.logger.log(`POST /permisos - Body: ${JSON.stringify(createDto)}`);
    try {
      const result = await this.permisosService.create(createDto);
      this.logger.log('Permiso creado correctamente');
      return result;
    } catch (error) {
      this.logger.error('Error creando permiso', error.stack);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los permisos' })
  @ApiResponse({ status: 200, description: 'Lista de permisos obtenida exitosamente.' })
  @ApiResponse({ status: 400, description: 'Parámetro moduleId inválido.' })
  async findAll(@Query('moduleId') moduleId?: string) {
    this.logger.log(`GET /permisos - moduleId: ${moduleId}`);
    try {
      const result = await this.permisosService.findAll(moduleId ? Number(moduleId) : undefined);
      this.logger.log('Permisos listados correctamente');
      return result;
    } catch (error) {
      this.logger.error('Error listando permisos', error.stack);
      throw error;
    }
  }

  @Patch('toggle')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:update')
  @ApiOperation({ summary: 'Activar o desactivar un permiso para un usuario' })
  @ApiResponse({ status: 200, description: 'Permiso toggled exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiBody({ type: TogglePermisoDto })
  async toggle(@Body() body: TogglePermisoDto) {
    this.logger.log(`PATCH /permisos/toggle - Body: ${JSON.stringify(body)}`);
    try {
      const result = await this.permisosService.toggle(body);
      this.logger.log('Permiso toggled correctamente');
      return result;
    } catch (error) {
      this.logger.error('Error toggling permiso', error.stack);
      throw error;
    }
  }

  @Patch('roles/assign')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:update')
  @ApiOperation({ summary: 'Asignar permisos a un rol' })
  @ApiResponse({ status: 200, description: 'Permisos asignados al rol exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiBody({ type: AssignPermisosDto })
  async assignToRole(@Body() dto: AssignPermisosDto) {
    this.logger.log(`PATCH /permisos/roles/assign - Body: ${JSON.stringify(dto)}`);
    try {
      const result = await this.permisosService.assignPermisosToRole(dto);
      this.logger.log('Permisos asignados a rol correctamente');
      return result;
    } catch (error) {
      this.logger.error('Error asignando permisos a rol', error.stack);
      throw error;
    }
  }

  @Patch('usuarios/assign')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:update')
  @ApiOperation({ summary: 'Asignar permisos a un usuario' })
  @ApiResponse({ status: 200, description: 'Permisos asignados al usuario exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiBody({ type: AssignPermisosDto })
  async assignToUser(@Body() dto: AssignPermisosDto) {
    this.logger.log(`PATCH /permisos/usuarios/assign - Body: ${JSON.stringify(dto)}`);
    try {
      const result = await this.permisosService.assignPermisosToUser(dto);
      this.logger.log('Permisos asignados a usuario correctamente');
      return result;
    } catch (error) {
      this.logger.error('Error asignando permisos a usuario', error.stack);
      if (error.status === 401) {
        this.logger.error('Fallo de autenticación detectado en assignToUser');
      }
      throw error;
    }
  }
}