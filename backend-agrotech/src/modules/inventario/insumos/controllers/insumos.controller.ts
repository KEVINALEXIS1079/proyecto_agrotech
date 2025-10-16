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
import { InsumosService } from '../services/insumos.service';
import { CreateInsumoDto } from '../dto/create-insumo.dto';
import { UpdateInsumoDto } from '../dto/update-insumo.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Insumos') // Agrupa los endpoints bajo "Insumos"
@ApiBearerAuth('access-token') // Indica que se requiere autenticación JWT
@Controller('insumos')
export class InsumosController {
  constructor(private readonly insumosService: InsumosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumos:create')
  @ApiOperation({
    summary: 'Crear un nuevo insumo',
    description: 'Registra un nuevo insumo en el sistema. Requiere el permiso "inventario:insumos:create".',
  })
  @ApiResponse({
    status: 201,
    description: 'Insumo creado exitosamente',
    schema: {
      example: {
        id_insumo_pk: 1,
        costo: 1200.5,
        stock: 10,
        estado_insumo: 'A',
        unidad_medida: 'kg',
        fecha_ingreso: '2025-09-22',
        fecha_salida: null,
        fecha_vencimiento: '2026-01-01',
        id_almacen_fk: 1,
        id_categoria_fk: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiBody({
    type: CreateInsumoDto,
    description: 'Datos requeridos para crear un insumo',
    examples: {
      valido: {
        value: {
          costo: 1200.5,
          stock: 10,
          estado_insumo: 'A',
          unidad_medida: 'kg',
          fecha_ingreso: '2025-09-22',
          fecha_salida: null,
          fecha_vencimiento: '2026-01-01',
          id_almacen_fk: 1,
          id_categoria_fk: 2,
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          costo: '1200.5', // Valor inválido (no numérico)
          stock: -5, // Valor inválido (negativo)
          estado_insumo: 'X', // Valor inválido (no en enum)
          unidad_medida: 123, // Valor inválido (no texto)
          fecha_ingreso: '2025-13-45', // Fecha inválida
          id_almacen_fk: null, // Valor inválido (vacío)
          id_categoria_fk: -1, // Valor inválido (negativo)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  create(@Body() dto: CreateInsumoDto) {
    return this.insumosService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumos:read')
  @ApiOperation({
    summary: 'Obtener todos los insumos',
    description: 'Devuelve la lista completa de insumos. Requiere el permiso "inventario:insumos:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de insumos obtenida exitosamente',
    schema: {
      example: [
        {
          id_insumo_pk: 1,
          costo: 1200.5,
          stock: 10,
          estado_insumo: 'A',
          unidad_medida: 'kg',
          fecha_ingreso: '2025-09-22',
          fecha_salida: null,
          fecha_vencimiento: '2026-01-01',
          id_almacen_fk: 1,
          id_categoria_fk: 2,
        },
        {
          id_insumo_pk: 2,
          costo: 50000,
          stock: 200,
          estado_insumo: 'I',
          unidad_medida: 'litros',
          fecha_ingreso: '2025-09-21',
          fecha_salida: '2025-09-25',
          fecha_vencimiento: '2026-12-31',
          id_almacen_fk: 3,
          id_categoria_fk: 5,
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.insumosService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumos:read')
  @ApiOperation({
    summary: 'Obtener un insumo por ID',
    description: 'Devuelve los detalles de un insumo específico según su ID. Requiere el permiso "inventario:insumos:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Insumo encontrado',
    schema: {
      example: {
        id_insumo_pk: 1,
        costo: 1200.5,
        stock: 10,
        estado_insumo: 'A',
        unidad_medida: 'kg',
        fecha_ingreso: '2025-09-22',
        fecha_salida: null,
        fecha_vencimiento: '2026-01-01',
        id_almacen_fk: 1,
        id_categoria_fk: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Insumo no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.insumosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumos:update')
  @ApiOperation({
    summary: 'Actualizar un insumo',
    description: 'Modifica los detalles de un insumo existente. Requiere el permiso "inventario:insumos:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Insumo actualizado exitosamente',
    schema: {
      example: {
        id_insumo_pk: 1,
        costo: 1300.75, // Actualizado
        stock: 15,
        estado_insumo: 'A',
        unidad_medida: 'kg',
        fecha_ingreso: '2025-09-22',
        fecha_salida: null,
        fecha_vencimiento: '2026-01-01',
        id_almacen_fk: 1,
        id_categoria_fk: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Insumo no encontrado' })
  @ApiBody({
    type: UpdateInsumoDto,
    description: 'Datos para actualizar el insumo (campos opcionales)',
    examples: {
      valido: {
        value: {
          costo: 1300.75,
          stock: 15,
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          costo: '1300.75', // Valor inválido (no numérico)
          stock: -5, // Valor inválido (negativo)
          estado_insumo: 'X', // Valor inválido (no en enum)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInsumoDto) {
    return this.insumosService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumos:delete')
  @ApiOperation({
    summary: 'Eliminar un insumo',
    description: 'Elimina un insumo del sistema. Requiere el permiso "inventario:insumos:delete".',
  })
  @ApiResponse({
    status: 200,
    description: 'Insumo eliminado exitosamente',
    schema: {
      example: { message: 'Insumo con ID 1 eliminado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Insumo no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.insumosService.remove(id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumos:update')
  @ApiOperation({
    summary: 'Restaurar un insumo eliminado',
    description: 'Restaura un insumo previamente eliminado. Requiere el permiso "inventario:insumos:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Insumo restaurado exitosamente',
    schema: {
      example: { message: 'Insumo con ID 1 restaurado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Insumo no encontrado' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.insumosService.restore(id);
  }
}