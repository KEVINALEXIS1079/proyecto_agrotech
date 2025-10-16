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
import { ActividadesService } from '../services/actividades.service';
import { CreateActividadDto } from '../dto/create-actividad.dto';
import { UpdateActividadDto } from '../dto/update-actividad.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Actividades') // Agrupa los endpoints bajo "Actividades"
@ApiBearerAuth('access-token') // Indica que se requiere autenticación JWT
@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  // Crear una nueva actividad
  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:actividades:create')
  @ApiOperation({
    summary: 'Crear una nueva actividad',
    description: 'Registra una nueva actividad en el sistema. Requiere el permiso "actividad:actividades:create".',
  })
  @ApiResponse({
    status: 201,
    description: 'Actividad creada exitosamente',
    schema: {
      example: {
        id_actividad_pk: 1,
        estado_actividad: 'En progreso',
        descripcion_actividad: 'Podar las plantas en el lote 3 para mejorar la producción',
        nombre_actividad: 'Poda de plátano',
        tiempo_actividad: 4,
        costo_mano_obra_actividad: 150000,
        fecha_actividad: '2025-09-19',
        fecha_inicio_actividad: '2025-09-20',
        fecha_fin_actividad: '2025-09-25',
        id_tipo_actividad_fk: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiBody({
    type: CreateActividadDto,
    description: 'Datos requeridos para crear una actividad',
    examples: {
      valido: {
        value: {
          estado_actividad: 'En progreso',
          descripcion_actividad: 'Podar las plantas en el lote 3 para mejorar la producción',
          nombre_actividad: 'Poda de plátano',
          tiempo_actividad: 4,
          costo_mano_obra_actividad: 150000,
          fecha_actividad: '2025-09-19',
          fecha_inicio_actividad: '2025-09-20',
          fecha_fin_actividad: '2025-09-25',
          id_tipo_actividad_fk: 2,
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          estado_actividad: '', // Cadena vacía, inválida por longitud mínima
          descripcion_actividad: '', // Cadena vacía
          nombre_actividad: 'a', // Menos de 1 caracter válido según validación implícita
          tiempo_actividad: -1, // Número inválido
          costo_mano_obra_actividad: -50000, // Número inválido
          fecha_actividad: '2025-13-01', // Fecha inválida
          fecha_inicio_actividad: '2025-09-26', // Después de fecha_fin
          fecha_fin_actividad: '2025-09-25',
          id_tipo_actividad_fk: 0, // ID inválido
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  create(@Body() createActividadesDto: CreateActividadDto) {
    return this.actividadesService.create(createActividadesDto);
  }

  // Obtener todas las actividades
  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:actividades:read')
  @ApiOperation({
    summary: 'Obtener todas las actividades',
    description: 'Devuelve la lista completa de actividades. Requiere el permiso "actividad:actividades:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de actividades obtenida exitosamente',
    schema: {
      example: [
        {
          id_actividad_pk: 1,
          estado_actividad: 'En progreso',
          descripcion_actividad: 'Podar las plantas en el lote 3 para mejorar la producción',
          nombre_actividad: 'Poda de plátano',
          tiempo_actividad: 4,
          costo_mano_obra_actividad: 150000,
          fecha_actividad: '2025-09-19',
          fecha_inicio_actividad: '2025-09-20',
          fecha_fin_actividad: '2025-09-25',
          id_tipo_actividad_fk: 2,
        },
        {
          id_actividad_pk: 2,
          estado_actividad: 'Pendiente',
          descripcion_actividad: 'Cosecha de maíz en el lote 2',
          nombre_actividad: 'Cosecha de maíz',
          tiempo_actividad: 6,
          costo_mano_obra_actividad: 200000,
          fecha_actividad: '2025-09-18',
          fecha_inicio_actividad: '2025-09-21',
          fecha_fin_actividad: '2025-09-27',
          id_tipo_actividad_fk: 3,
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.actividadesService.findAll();
  }

  // Obtener una actividad por ID
  @Get(':id_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:actividades:read')
  @ApiOperation({
    summary: 'Obtener una actividad por ID',
    description: 'Devuelve los detalles de una actividad específica según su ID. Requiere el permiso "actividad:actividades:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Actividad encontrada',
    schema: {
      example: {
        id_actividad_pk: 1,
        estado_actividad: 'En progreso',
        descripcion_actividad: 'Podar las plantas en el lote 3 para mejorar la producción',
        nombre_actividad: 'Poda de plátano',
        tiempo_actividad: 4,
        costo_mano_obra_actividad: 150000,
        fecha_actividad: '2025-09-19',
        fecha_inicio_actividad: '2025-09-20',
        fecha_fin_actividad: '2025-09-25',
        id_tipo_actividad_fk: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada' })
  findOne(@Param('id_actividad_pk', ParseIntPipe) id_actividad_pk: number) {
    return this.actividadesService.findOne(+id_actividad_pk);
  }

  // Actualizar una actividad
  @Patch(':id_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:actividades:update')
  @ApiOperation({
    summary: 'Actualizar una actividad',
    description: 'Modifica los detalles de una actividad existente. Requiere el permiso "actividad:actividades:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Actividad actualizada exitosamente',
    schema: {
      example: {
        id_actividad_pk: 1,
        estado_actividad: 'Completada',
        descripcion_actividad: 'Podar las plantas en el lote 3 (finalizado)',
        nombre_actividad: 'Poda de plátano (actualizado)',
        tiempo_actividad: 4,
        costo_mano_obra_actividad: 150000,
        fecha_actividad: '2025-09-19',
        fecha_inicio_actividad: '2025-09-20',
        fecha_fin_actividad: '2025-09-25',
        id_tipo_actividad_fk: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada' })
  @ApiBody({
    type: UpdateActividadDto,
    description: 'Datos para actualizar la actividad (campos opcionales)',
    examples: {
      valido: {
        value: {
          estado_actividad: 'Completada',
          descripcion_actividad: 'Podar las plantas en el lote 3 (finalizado)',
          nombre_actividad: 'Poda de plátano (actualizado)',
          tiempo_actividad: 5,
          costo_mano_obra_actividad: 160000,
          fecha_fin_actividad: '2025-09-26',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          estado_actividad: '', // Cadena vacía, inválida por longitud mínima
          tiempo_actividad: -1, // Número inválido
          costo_mano_obra_actividad: -50000, // Número inválido
          fecha_fin_actividad: '2025-09-19', // Antes de fecha_inicio actual
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  update(
    @Param('id_actividad_pk', ParseIntPipe) id_actividad_pk: number,
    @Body() updateActividadesDto: UpdateActividadDto,
  ) {
    return this.actividadesService.update(+id_actividad_pk, updateActividadesDto);
  }

  // Eliminar una actividad
  @Delete(':id_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:actividades:delete')
  @ApiOperation({
    summary: 'Eliminar una actividad',
    description: 'Elimina una actividad del sistema. Requiere el permiso "actividad:actividades:delete".',
  })
  @ApiResponse({
    status: 200,
    description: 'Actividad eliminada exitosamente',
    schema: {
      example: { message: 'Actividad con ID 1 eliminada correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada' })
  remove(@Param('id_actividad_pk', ParseIntPipe) id_actividad_pk: number) {
    return this.actividadesService.remove(+id_actividad_pk);
  }

  // Restaurar una actividad
  @Patch('restore/:id_actividad_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:actividades:update')
  @ApiOperation({
    summary: 'Restaurar una actividad eliminada',
    description: 'Restaura una actividad previamente eliminada. Requiere el permiso "actividad:actividades:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Actividad restaurada exitosamente',
    schema: {
      example: { message: 'Actividad con ID 1 restaurada correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada' })
  restore(@Param('id_actividad_pk', ParseIntPipe) id_actividad_pk: number) {
    return this.actividadesService.restore(+id_actividad_pk);
  }
}