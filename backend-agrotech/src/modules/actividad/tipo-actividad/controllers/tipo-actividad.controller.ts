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
import { TipoActividadService } from '../services/tipo-actividad.service';
import { CreateTipoActividadDto } from '../dto/create-tipo-actividad.dto';
import { UpdateTipoActividadDto } from '../dto/update-tipo-actividad.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Tipo-Actividad') // Agrupa los endpoints bajo "Tipo-Actividad"
@ApiBearerAuth('access-token') // Indica que se requiere autenticación JWT
@Controller('tipo-actividad')
export class TipoActividadController {
  constructor(private readonly tipoActividadService: TipoActividadService) {}

  // Crear un nuevo tipo de actividad
  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-actividad:create')
  @ApiOperation({
    summary: 'Crear un nuevo tipo de actividad',
    description: 'Registra un nuevo tipo de actividad en el sistema. Requiere el permiso "actividad:tipo-actividad:create".',
  })
  @ApiResponse({
    status: 201,
    description: 'Tipo de actividad creado exitosamente',
    schema: {
      example: {
        id_tipo_actividad_pk: 1,
        nombre_tipo_actividad: 'Riego',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiBody({
    type: CreateTipoActividadDto,
    description: 'Datos requeridos para crear un tipo de actividad',
    examples: {
      valido: {
        value: {
          nombre_tipo_actividad: 'Riego',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_tipo_actividad: '', // Valor inválido (vacío)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  create(@Body() createTipoActividadDto: CreateTipoActividadDto) {
    return this.tipoActividadService.create(createTipoActividadDto);
  }

  // Obtener todos los tipos de actividad
  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-actividad:read')
  @ApiOperation({
    summary: 'Obtener todos los tipos de actividad',
    description: 'Devuelve la lista completa de tipos de actividad. Requiere el permiso "actividad:tipo-actividad:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de actividad obtenida exitosamente',
    schema: {
      example: [
        {
          id_tipo_actividad_pk: 1,
          nombre_tipo_actividad: 'Riego',
        },
        {
          id_tipo_actividad_pk: 2,
          nombre_tipo_actividad: 'Poda',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.tipoActividadService.findAll();
  }

  // Obtener un tipo de actividad por ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-actividad:read')
  @ApiOperation({
    summary: 'Obtener un tipo de actividad por ID',
    description: 'Devuelve los detalles de un tipo de actividad específico según su ID. Requiere el permiso "actividad:tipo-actividad:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de actividad encontrado',
    schema: {
      example: {
        id_tipo_actividad_pk: 1,
        nombre_tipo_actividad: 'Riego',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Tipo de actividad no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tipoActividadService.findOne(id);
  }

  // Actualizar un tipo de actividad
  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-actividad:update')
  @ApiOperation({
    summary: 'Actualizar un tipo de actividad',
    description: 'Modifica los detalles de un tipo de actividad existente. Requiere el permiso "actividad:tipo-actividad:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de actividad actualizado exitosamente',
    schema: {
      example: {
        id_tipo_actividad_pk: 1,
        nombre_tipo_actividad: 'Riego actualizado',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Tipo de actividad no encontrado' })
  @ApiBody({
    type: UpdateTipoActividadDto,
    description: 'Datos para actualizar el tipo de actividad (campos opcionales)',
    examples: {
      valido: {
        value: {
          nombre_tipo_actividad: 'Riego actualizado',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_tipo_actividad: '', // Valor inválido (vacío)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTipoActividadDto: UpdateTipoActividadDto) {
    return this.tipoActividadService.update(id, updateTipoActividadDto);
  }

  // Eliminar un tipo de actividad
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-actividad:delete')
  @ApiOperation({
    summary: 'Eliminar un tipo de actividad',
    description: 'Elimina un tipo de actividad del sistema. Requiere el permiso "actividad:tipo-actividad:delete".',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de actividad eliminado exitosamente',
    schema: {
      example: { message: 'Tipo de actividad con ID 1 eliminado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Tipo de actividad no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tipoActividadService.remove(id);
  }

  // Restaurar un tipo de actividad
  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-actividad:update')
  @ApiOperation({
    summary: 'Restaurar un tipo de actividad eliminado',
    description: 'Restaura un tipo de actividad previamente eliminado. Requiere el permiso "actividad:tipo-actividad:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de actividad restaurado exitosamente',
    schema: {
      example: { message: 'Tipo de actividad con ID 1 restaurado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Tipo de actividad no encontrado' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.tipoActividadService.restore(id);
  }
}