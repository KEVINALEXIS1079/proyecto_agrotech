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
import { CultivosService } from '../services/cultivos.service';
import { CreateCultivoDto } from '../dto/create-cultivo.dto';
import { UpdateCultivoDto } from '../dto/update-cultivo.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Cultivos') // Agrupa los endpoints bajo "Cultivos"
@ApiBearerAuth('access-token') // Indica que se requiere autenticación JWT
@Controller('cultivos')
export class CultivosController {
  constructor(private readonly cultivosService: CultivosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:cultivos:create')
  @ApiOperation({
    summary: 'Crear un nuevo cultivo',
    description: 'Registra un nuevo cultivo en el sistema. Requiere el permiso "cultivo:cultivos:create".',
  })
  @ApiResponse({
    status: 201,
    description: 'Cultivo creado exitosamente',
    schema: {
      example: {
        id_cultivo_pk: 1,
        nombre_cultivo: 'Plátano',
        descripcion_cultivo: 'Cacao fino de aroma',
        img_cultivo: 'img/mi-servidor.com/imagenes/cacao.jpg',
        estado_cultivo: 'activo',
        fecha_inicio_cultivo: '2025-03-15',
        fecha_fin_cultivo: '2025-07-30',
        id_sublote_fk: 3,
        id_tipo_cultivo_fk: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiBody({
    type: CreateCultivoDto,
    description: 'Datos requeridos para crear un cultivo',
    examples: {
      valido: {
        value: {
          nombre_cultivo: 'Plátano',
          descripcion_cultivo: 'Cacao fino de aroma',
          img_cultivo: 'img/mi-servidor.com/imagenes/cacao.jpg',
          estado_cultivo: 'activo',
          fecha_inicio_cultivo: '2025-03-15',
          fecha_fin_cultivo: '2025-07-30',
          id_sublote_fk: 3,
          id_tipo_cultivo_fk: 2,
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_cultivo: '', // Valor inválido (vacío)
          descripcion_cultivo: 'ab', // Menos de 3 caracteres
          img_cultivo: '', // Valor inválido (vacío)
          estado_cultivo: '', // Valor inválido (vacío)
          fecha_inicio_cultivo: '2025-13-45', // Fecha inválida
          fecha_fin_cultivo: '2025-02-01', // Antes de fecha_inicio
          id_sublote_fk: -1, // No positivo
          id_tipo_cultivo_fk: 0, // No positivo
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  create(@Body() createCultivoDto: CreateCultivoDto) {
    return this.cultivosService.create(createCultivoDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:cultivos:read')
  @ApiOperation({
    summary: 'Obtener todos los cultivos',
    description: 'Devuelve la lista completa de cultivos. Requiere el permiso "cultivo:cultivos:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de cultivos obtenida exitosamente',
    schema: {
      example: [
        {
          id_cultivo_pk: 1,
          nombre_cultivo: 'Plátano',
          descripcion_cultivo: 'Cacao fino de aroma',
          img_cultivo: 'img/mi-servidor.com/imagenes/cacao.jpg',
          estado_cultivo: 'activo',
          fecha_inicio_cultivo: '2025-03-15',
          fecha_fin_cultivo: '2025-07-30',
          id_sublote_fk: 3,
          id_tipo_cultivo_fk: 2,
        },
        {
          id_cultivo_pk: 2,
          nombre_cultivo: 'Café',
          descripcion_cultivo: 'Café colombiano',
          img_cultivo: 'img/mi-servidor.com/imagenes/cafe.jpg',
          estado_cultivo: 'activo',
          fecha_inicio_cultivo: '2025-04-01',
          fecha_fin_cultivo: '2025-08-15',
          id_sublote_fk: 4,
          id_tipo_cultivo_fk: 3,
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.cultivosService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:cultivos:read')
  @ApiOperation({
    summary: 'Obtener un cultivo por ID',
    description: 'Devuelve los detalles de un cultivo específico según su ID. Requiere el permiso "cultivo:cultivos:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Cultivo encontrado',
    schema: {
      example: {
        id_cultivo_pk: 1,
        nombre_cultivo: 'Plátano',
        descripcion_cultivo: 'Cacao fino de aroma',
        img_cultivo: 'img/mi-servidor.com/imagenes/cacao.jpg',
        estado_cultivo: 'activo',
        fecha_inicio_cultivo: '2025-03-15',
        fecha_fin_cultivo: '2025-07-30',
        id_sublote_fk: 3,
        id_tipo_cultivo_fk: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Cultivo no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cultivosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:cultivos:update')
  @ApiOperation({
    summary: 'Actualizar un cultivo',
    description: 'Modifica los detalles de un cultivo existente. Requiere el permiso "cultivo:cultivos:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Cultivo actualizado exitosamente',
    schema: {
      example: {
        id_cultivo_pk: 1,
        nombre_cultivo: 'Plátano Actualizado',
        descripcion_cultivo: 'Cacao fino de aroma mejorado',
        img_cultivo: 'img/mi-servidor.com/imagenes/cacao_actualizado.jpg',
        estado_cultivo: 'activo',
        fecha_inicio_cultivo: '2025-03-15',
        fecha_fin_cultivo: '2025-07-30',
        id_sublote_fk: 3,
        id_tipo_cultivo_fk: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Cultivo no encontrado' })
  @ApiBody({
    type: UpdateCultivoDto,
    description: 'Datos para actualizar el cultivo (campos opcionales)',
    examples: {
      valido: {
        value: {
          nombre_cultivo: 'Plátano Actualizado',
          descripcion_cultivo: 'Cacao fino de aroma mejorado',
          img_cultivo: 'img/mi-servidor.com/imagenes/cacao_actualizado.jpg',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_cultivo: 'ab', // Menos de 3 caracteres
          descripcion_cultivo: '', // Valor inválido (vacío)
          img_cultivo: '', // Valor inválido (vacío)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCultivoDto: UpdateCultivoDto) {
    return this.cultivosService.update(id, updateCultivoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:cultivos:delete')
  @ApiOperation({
    summary: 'Eliminar un cultivo',
    description: 'Elimina un cultivo del sistema. Requiere el permiso "cultivo:cultivos:delete".',
  })
  @ApiResponse({
    status: 200,
    description: 'Cultivo eliminado exitosamente',
    schema: {
      example: { message: 'Cultivo con ID 1 eliminado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Cultivo no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cultivosService.remove(id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:cultivos:update')
  @ApiOperation({
    summary: 'Restaurar un cultivo eliminado',
    description: 'Restaura un cultivo previamente eliminado. Requiere el permiso "cultivo:cultivos:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Cultivo restaurado exitosamente',
    schema: {
      example: { message: 'Cultivo con ID 1 restaurado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Cultivo no encontrado' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.cultivosService.restore(id);
  }
}