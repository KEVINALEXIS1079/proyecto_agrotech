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
import { MovimientoProductoService } from '../services/movimiento-producto.service';
import { CreateMovimientoProductoDto } from '../dto/create-movimiento-producto.dto';
import { UpdateMovimientoProductoDto } from '../dto/update-movimiento-producto.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Movimiento-Producto') // Agrupa los endpoints bajo "Movimiento-Producto"
@ApiBearerAuth('access-token') // Indica que se requiere autenticación JWT
@Controller('movimiento-producto')
export class MovimientoProductoController {
  constructor(private readonly movimientoProductoService: MovimientoProductoService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:movimiento-producto:create')
  @ApiOperation({
    summary: 'Crear un nuevo movimiento de producto',
    description: 'Registra un nuevo movimiento de producto en el sistema. Requiere el permiso "finanzas:movimiento-producto:create".',
  })
  @ApiResponse({
    status: 201,
    description: 'Movimiento de producto creado exitosamente',
    schema: {
      example: {
        id_movimiento_pk: 1,
        tipo_movimiento: 'entrada',
        cantidad: 100,
        fecha: '2025-09-19T08:27:00.000Z',
        descripcion: 'Ingreso de fertilizantes',
        id_producto_fk: 1,
        id_venta_fk: 10,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiBody({
    type: CreateMovimientoProductoDto,
    description: 'Datos requeridos para crear un movimiento de producto',
    examples: {
      valido: {
        value: {
          tipo_movimiento: 'entrada',
          cantidad: 100,
          fecha: '2025-09-19T08:27:00.000Z',
          descripcion: 'Ingreso de fertilizantes',
          id_producto_fk: 1,
          id_venta_fk: 10,
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          tipo_movimiento: 'invalid', // Valor inválido (no en enum)
          cantidad: -5, // Valor inválido (negativo)
          fecha: '2025-13-45', // Fecha inválida
          descripcion: '', // Valor opcional, pero válido
          id_producto_fk: null, // Valor inválido (vacío)
          id_venta_fk: -1, // Valor opcional, pero inválido
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  create(@Body() createMovimientoProductoDto: CreateMovimientoProductoDto) {
    return this.movimientoProductoService.create(createMovimientoProductoDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:movimiento-producto:read')
  @ApiOperation({
    summary: 'Obtener todos los movimientos de producto',
    description: 'Devuelve la lista completa de movimientos de producto. Requiere el permiso "finanzas:movimiento-producto:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de movimientos de producto obtenida exitosamente',
    schema: {
      example: [
        {
          id_movimiento_pk: 1,
          tipo_movimiento: 'entrada',
          cantidad: 100,
          fecha: '2025-09-19T08:27:00.000Z',
          descripcion: 'Ingreso de fertilizantes',
          id_producto_fk: 1,
          id_venta_fk: 10,
        },
        {
          id_movimiento_pk: 2,
          tipo_movimiento: 'salida',
          cantidad: 50,
          fecha: '2025-09-18T14:00:00.000Z',
          descripcion: 'Entrega de abonos',
          id_producto_fk: 2,
          id_venta_fk: 11,
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.movimientoProductoService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:movimiento-producto:read')
  @ApiOperation({
    summary: 'Obtener un movimiento de producto por ID',
    description: 'Devuelve los detalles de un movimiento de producto específico según su ID. Requiere el permiso "finanzas:movimiento-producto:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Movimiento de producto encontrado',
    schema: {
      example: {
        id_movimiento_pk: 1,
        tipo_movimiento: 'entrada',
        cantidad: 100,
        fecha: '2025-09-19T08:27:00.000Z',
        descripcion: 'Ingreso de fertilizantes',
        id_producto_fk: 1,
        id_venta_fk: 10,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Movimiento de producto no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.movimientoProductoService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:movimiento-producto:update')
  @ApiOperation({
    summary: 'Actualizar un movimiento de producto',
    description: 'Modifica los detalles de un movimiento de producto existente. Requiere el permiso "finanzas:movimiento-producto:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Movimiento de producto actualizado exitosamente',
    schema: {
      example: {
        id_movimiento_pk: 1,
        tipo_movimiento: 'entrada',
        cantidad: 150, // Actualizado
        fecha: '2025-09-19T08:27:00.000Z',
        descripcion: 'Ingreso de fertilizantes actualizado',
        id_producto_fk: 1,
        id_venta_fk: 10,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Movimiento de producto no encontrado' })
  @ApiBody({
    type: UpdateMovimientoProductoDto,
    description: 'Datos para actualizar el movimiento de producto (campos opcionales)',
    examples: {
      valido: {
        value: {
          cantidad: 150,
          descripcion: 'Ingreso de fertilizantes actualizado',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          cantidad: -5, // Valor inválido (negativo)
          descripcion: '', // Valor válido, pero opcional
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMovimientoProductoDto: UpdateMovimientoProductoDto) {
    return this.movimientoProductoService.update(id, updateMovimientoProductoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:movimiento-producto:delete')
  @ApiOperation({
    summary: 'Eliminar un movimiento de producto',
    description: 'Elimina un movimiento de producto del sistema. Requiere el permiso "finanzas:movimiento-producto:delete".',
  })
  @ApiResponse({
    status: 200,
    description: 'Movimiento de producto eliminado exitosamente',
    schema: {
      example: { message: 'Movimiento de producto con ID 1 eliminado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Movimiento de producto no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.movimientoProductoService.remove(id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:movimiento-producto:update')
  @ApiOperation({
    summary: 'Restaurar un movimiento de producto eliminado',
    description: 'Restaura un movimiento de producto previamente eliminado. Requiere el permiso "finanzas:movimiento-producto:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Movimiento de producto restaurado exitosamente',
    schema: {
      example: { message: 'Movimiento de producto con ID 1 restaurado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Movimiento de producto no encontrado' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.movimientoProductoService.restore(id);
  }
}