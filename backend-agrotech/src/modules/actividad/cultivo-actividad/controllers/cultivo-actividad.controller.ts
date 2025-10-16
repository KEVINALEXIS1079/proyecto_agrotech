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
import { CultivoActividadService } from '../services/cultivo-actividad.service'; // Asegúrate de crear este servicio
import { CreateCultivoActividadDto } from '../dto/create-cultivo-actividad.dto';
import { UpdateCultivoActividadDto } from '../dto/update-cultivo-actividad.dto'; // Asegúrate de crear este DTO
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Cultivo-Actividad') // Agrupa los endpoints bajo "Cultivo-Actividad"
@ApiBearerAuth('access-token') // Indica que se requiere autenticación JWT
@Controller('cultivo-actividad')
export class CultivoActividadController {
  constructor(private readonly cultivoActividadService: CultivoActividadService) {}

  // Crear una nueva relación cultivo-actividad
  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:cultivo-actividad:create')
  @ApiOperation({
    summary: 'Crear una nueva relación cultivo-actividad',
    description: 'Asocia una actividad a un cultivo. Requiere el permiso "actividad:cultivo-actividad:create".',
  })
  @ApiResponse({
    status: 201,
    description: 'Relación cultivo-actividad creada exitosamente',
    schema: {
      example: {
        id_cultivo_actividad_pk: 1, // Asumimos un ID primario generado
        id_cultivo_fk: 5,
        id_actividad_fk: 12,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiBody({
    type: CreateCultivoActividadDto,
    description: 'Datos requeridos para asociar un cultivo con una actividad',
    examples: {
      valido: {
        value: {
          id_cultivo_fk: 5,
          id_actividad_fk: 12,
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          id_cultivo_fk: -1, // Valor inválido (negativo)
          id_actividad_fk: 0, // Valor inválido (no positivo)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  create(@Body() createCultivoActividadDto: CreateCultivoActividadDto) {
    return this.cultivoActividadService.create(createCultivoActividadDto);
  }

  // Obtener todas las relaciones cultivo-actividad
  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:cultivo-actividad:read')
  @ApiOperation({
    summary: 'Obtener todas las relaciones cultivo-actividad',
    description: 'Devuelve la lista completa de asociaciones entre cultivos y actividades. Requiere el permiso "actividad:cultivo-actividad:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de relaciones obtenida exitosamente',
    schema: {
      example: [
        {
          id_cultivo_actividad_pk: 1,
          id_cultivo_fk: 5,
          id_actividad_fk: 12,
        },
        {
          id_cultivo_actividad_pk: 2,
          id_cultivo_fk: 6,
          id_actividad_fk: 13,
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.cultivoActividadService.findAll();
  }

  // Obtener una relación cultivo-actividad por ID
  @Get(':id_cultivo_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:cultivo-actividad:read')
  @ApiOperation({
    summary: 'Obtener una relación cultivo-actividad por ID',
    description: 'Devuelve los detalles de una relación específica según su ID. Requiere el permiso "actividad:cultivo-actividad:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación encontrada',
    schema: {
      example: {
        id_cultivo_actividad_pk: 1,
        id_cultivo_fk: 5,
        id_actividad_fk: 12,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  findOne(@Param('id_cultivo_actividad_pk', ParseIntPipe) id_cultivo_actividad_pk: number) {
    return this.cultivoActividadService.findOne(+id_cultivo_actividad_pk);
  }

  // Actualizar una relación cultivo-actividad
  @Patch(':id_cultivo_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:cultivo-actividad:update')
  @ApiOperation({
    summary: 'Actualizar una relación cultivo-actividad',
    description: 'Modifica los detalles de una relación existente. Requiere el permiso "actividad:cultivo-actividad:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación actualizada exitosamente',
    schema: {
      example: {
        id_cultivo_actividad_pk: 1,
        id_cultivo_fk: 6, // Actualizado
        id_actividad_fk: 12,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  @ApiBody({
    type: UpdateCultivoActividadDto,
    description: 'Datos para actualizar la relación (campos opcionales)',
    examples: {
      valido: {
        value: {
          id_cultivo_fk: 6,
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          id_cultivo_fk: -1, // Valor inválido (negativo)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  update(
    @Param('id_cultivo_actividad_pk', ParseIntPipe) id_cultivo_actividad_pk: number,
    @Body() updateCultivoActividadDto: UpdateCultivoActividadDto,
  ) {
    return this.cultivoActividadService.update(+id_cultivo_actividad_pk, updateCultivoActividadDto);
  }

  // Eliminar una relación cultivo-actividad
  @Delete(':id_cultivo_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:cultivo-actividad:delete')
  @ApiOperation({
    summary: 'Eliminar una relación cultivo-actividad',
    description: 'Elimina una relación del sistema. Requiere el permiso "actividad:cultivo-actividad:delete".',
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
  remove(@Param('id_cultivo_actividad_pk', ParseIntPipe) id_cultivo_actividad_pk: number) {
    return this.cultivoActividadService.remove(+id_cultivo_actividad_pk);
  }

  // Restaurar una relación cultivo-actividad
  @Patch('restore/:id_cultivo_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:cultivo-actividad:update')
  @ApiOperation({
    summary: 'Restaurar una relación cultivo-actividad eliminada',
    description: 'Restaura una relación previamente eliminada. Requiere el permiso "actividad:cultivo-actividad:update".',
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
  restore(@Param('id_cultivo_actividad_pk', ParseIntPipe) id_cultivo_actividad_pk: number) {
    return this.cultivoActividadService.restore(+id_cultivo_actividad_pk);
  }
}