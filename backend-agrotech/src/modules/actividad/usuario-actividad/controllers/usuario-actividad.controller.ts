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
} from '@nestjs/common';
import { UsuarioActividadService } from '../services/usuario-actividad.service';
import { CreateUsuarioActividadDto } from '../dto/create-usuario-actividad.dto';
import { UpdateUsuarioActividadDto } from '../dto/update-usuario-actividad.dto';
import { UsuarioActividad } from '../entities/usuario-actividad.entity';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Usuario-Actividad') // Agrupa los endpoints bajo "Usuario-Actividad"
@ApiBearerAuth('access-token') // Indica que se requiere autenticación JWT
@Controller('usuario-actividad')
export class UsuarioActividadController {
  constructor(private readonly usuarioActividadService: UsuarioActividadService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:usuario-actividad:create')
  @ApiOperation({
    summary: 'Crear una nueva relación usuario-actividad',
    description: 'Asocia un usuario a una actividad. Requiere el permiso "actividad:usuario-actividad:create".',
  })
  @ApiResponse({
    status: 201,
    description: 'Relación usuario-actividad creada exitosamente',
    schema: {
      example: {
        id_usuario_actividad_pk: 1,
        dni_usuario_fk: '1023456789',
        id_actividad_fk: 7,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiBody({
    type: CreateUsuarioActividadDto,
    description: 'Datos requeridos para asociar un usuario con una actividad',
    examples: {
      valido: {
        value: {
          dni_usuario_fk: '1023456789',
          id_actividad_fk: 7,
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          dni_usuario_fk: '', // Valor inválido (vacío)
          id_actividad_fk: 0, // Valor inválido (no positivo)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  create(@Body() dto: CreateUsuarioActividadDto): Promise<string> {
    return this.usuarioActividadService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:usuario-actividad:read')
  @ApiOperation({
    summary: 'Obtener todas las relaciones usuario-actividad',
    description: 'Devuelve la lista completa de asociaciones entre usuarios y actividades. Requiere el permiso "actividad:usuario-actividad:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de relaciones obtenida exitosamente',
    schema: {
      example: [
        {
          id_usuario_actividad_pk: 1,
          dni_usuario_fk: '1023456789',
          id_actividad_fk: 7,
        },
        {
          id_usuario_actividad_pk: 2,
          dni_usuario_fk: '9876543210',
          id_actividad_fk: 8,
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll(): Promise<UsuarioActividad[]> {
    return this.usuarioActividadService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:usuario-actividad:read')
  @ApiOperation({
    summary: 'Obtener una relación usuario-actividad por ID',
    description: 'Devuelve los detalles de una relación específica según su ID. Requiere el permiso "actividad:usuario-actividad:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación encontrada',
    schema: {
      example: {
        id_usuario_actividad_pk: 1,
        dni_usuario_fk: '1023456789',
        id_actividad_fk: 7,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UsuarioActividad> {
    return this.usuarioActividadService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:usuario-actividad:update')
  @ApiOperation({
    summary: 'Actualizar una relación usuario-actividad',
    description: 'Modifica los detalles de una relación existente. Requiere el permiso "actividad:usuario-actividad:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación actualizada exitosamente',
    schema: {
      example: {
        id_usuario_actividad_pk: 1,
        dni_usuario_fk: '9876543210', // Actualizado
        id_actividad_fk: 7,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  @ApiBody({
    type: UpdateUsuarioActividadDto,
    description: 'Datos para actualizar la relación (campos opcionales)',
    examples: {
      valido: {
        value: {
          dni_usuario_fk: '9876543210',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          dni_usuario_fk: '', // Valor inválido (vacío)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUsuarioActividadDto): Promise<string> {
    return this.usuarioActividadService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:usuario-actividad:delete')
  @ApiOperation({
    summary: 'Eliminar una relación usuario-actividad',
    description: 'Elimina una relación del sistema. Requiere el permiso "actividad:usuario-actividad:delete".',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación eliminada exitosamente',
    schema: {
      example: { message: 'Relación con ID 1 eliminada correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.usuarioActividadService.remove(id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:usuario-actividad:update')
  @ApiOperation({
    summary: 'Restaurar una relación usuario-actividad eliminada',
    description: 'Restaura una relación previamente eliminada. Requiere el permiso "actividad:usuario-actividad:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación restaurada exitosamente',
    schema: {
      example: { message: 'Relación con ID 1 restaurada correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  restore(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.usuarioActividadService.restore(id);
  }
}