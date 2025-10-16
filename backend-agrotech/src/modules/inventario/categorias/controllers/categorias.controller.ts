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
import { CategoriasService } from '../services/categorias.service';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Categorias') // Agrupa los endpoints bajo "Categorias"
@ApiBearerAuth('access-token') // Indica que se requiere autenticación JWT
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:categorias:create')
  @ApiOperation({
    summary: 'Crear una nueva categoría',
    description: 'Registra una nueva categoría en el sistema. Requiere el permiso "inventario:categorias:create".',
  })
  @ApiResponse({
    status: 201,
    description: 'Categoría creada exitosamente',
    schema: {
      example: {
        id_categoria_pk: 1,
        nombre_categoria: 'Fertilizantes',
        descripcion_categoria: 'Productos utilizados para mejorar el rendimiento del cultivo',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiBody({
    type: CreateCategoriaDto,
    description: 'Datos requeridos para crear una categoría',
    examples: {
      valido: {
        value: {
          nombre_categoria: 'Fertilizantes',
          descripcion_categoria: 'Productos utilizados para mejorar el rendimiento del cultivo',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_categoria: '', // Valor inválido (vacío)
          descripcion_categoria: '', // Valor inválido (vacío)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  create(@Body() dto: CreateCategoriaDto) {
    return this.categoriasService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:categorias:read')
  @ApiOperation({
    summary: 'Obtener todas las categorías',
    description: 'Devuelve la lista completa de categorías. Requiere el permiso "inventario:categorias:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías obtenida exitosamente',
    schema: {
      example: [
        {
          id_categoria_pk: 1,
          nombre_categoria: 'Fertilizantes',
          descripcion_categoria: 'Productos utilizados para mejorar el rendimiento del cultivo',
        },
        {
          id_categoria_pk: 2,
          nombre_categoria: 'Herramientas',
          descripcion_categoria: 'Herramientas agrícolas para el mantenimiento de los lotes',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.categoriasService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:categorias:read')
  @ApiOperation({
    summary: 'Obtener una categoría por ID',
    description: 'Devuelve los detalles de una categoría específica según su ID. Requiere el permiso "inventario:categorias:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría encontrada',
    schema: {
      example: {
        id_categoria_pk: 1,
        nombre_categoria: 'Fertilizantes',
        descripcion_categoria: 'Productos utilizados para mejorar el rendimiento del cultivo',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:categorias:update')
  @ApiOperation({
    summary: 'Actualizar una categoría',
    description: 'Modifica los detalles de una categoría existente. Requiere el permiso "inventario:categorias:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría actualizada exitosamente',
    schema: {
      example: {
        id_categoria_pk: 1,
        nombre_categoria: 'Fertilizantes Mejorados',
        descripcion_categoria: 'Productos avanzados para mejorar el rendimiento del cultivo',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @ApiBody({
    type: UpdateCategoriaDto,
    description: 'Datos para actualizar la categoría (campos opcionales)',
    examples: {
      valido: {
        value: {
          nombre_categoria: 'Fertilizantes Mejorados',
          descripcion_categoria: 'Productos avanzados para mejorar el rendimiento del cultivo',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_categoria: '', // Valor inválido (vacío)
          descripcion_categoria: '', // Valor inválido (vacío)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoriaDto) {
    return this.categoriasService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:categorias:delete')
  @ApiOperation({
    summary: 'Eliminar una categoría',
    description: 'Elimina una categoría del sistema. Requiere el permiso "inventario:categorias:delete".',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría eliminada exitosamente',
    schema: {
      example: { message: 'Categoría con ID 1 eliminada correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.remove(id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:categorias:update')
  @ApiOperation({
    summary: 'Restaurar una categoría eliminada',
    description: 'Restaura una categoría previamente eliminada. Requiere el permiso "inventario:categorias:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría restaurada exitosamente',
    schema: {
      example: { message: 'Categoría con ID 1 restaurada correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.restore(id);
  }
}