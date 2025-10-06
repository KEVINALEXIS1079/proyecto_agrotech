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
import { ProductosService } from '../service/productos.service';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { UpdateProductoDto } from '../dto/update-producto.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Productos') // Agrupa los endpoints bajo "Productos"
@ApiBearerAuth('access-token') // Indica que se requiere autenticación JWT
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:productos:create')
  @ApiOperation({
    summary: 'Crear un nuevo producto',
    description: 'Registra un nuevo producto en el sistema. Requiere el permiso "finanzas:productos:create".',
  })
  @ApiResponse({
    status: 201,
    description: 'Producto creado exitosamente',
    schema: {
      example: {
        id_producto_pk: 1,
        nombre_producto: 'Fertilizante orgánico',
        descripcion_producto: 'Fertilizante natural para mejorar la calidad del suelo',
        precio_producto: 15000.50,
        stock_producto: 500,
        fecha_ingreso_producto: '2025-09-19T08:32:00.000Z',
        fecha_caducidad_producto: '2026-12-31',
        id_cultivo_fk: 1,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiBody({
    type: CreateProductoDto,
    description: 'Datos requeridos para crear un producto',
    examples: {
      valido: {
        value: {
          nombre_producto: 'Fertilizante orgánico',
          descripcion_producto: 'Fertilizante natural para mejorar la calidad del suelo',
          precio_producto: 15000.50,
          stock_producto: 500,
          fecha_ingreso_producto: '2025-09-19T08:32:00.000Z',
          fecha_caducidad_producto: '2026-12-31',
          id_cultivo_fk: 1,
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_producto: '', // Valor inválido (vacío)
          descripcion_producto: 'ab', // Valor válido, pero opcional
          precio_producto: -100, // Valor inválido (negativo)
          stock_producto: -10, // Valor inválido (negativo)
          fecha_ingreso_producto: '2025-13-45', // Fecha inválida
          fecha_caducidad_producto: '2025-01-01', // Antes de fecha ingreso
          id_cultivo_fk: null, // Valor inválido (vacío)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:productos:read')
  @ApiOperation({
    summary: 'Obtener todos los productos',
    description: 'Devuelve la lista completa de productos. Requiere el permiso "finanzas:productos:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos obtenida exitosamente',
    schema: {
      example: [
        {
          id_producto_pk: 1,
          nombre_producto: 'Fertilizante orgánico',
          descripcion_producto: 'Fertilizante natural para mejorar la calidad del suelo',
          precio_producto: 15000.50,
          stock_producto: 500,
          fecha_ingreso_producto: '2025-09-19T08:32:00.000Z',
          fecha_caducidad_producto: '2026-12-31',
          id_cultivo_fk: 1,
        },
        {
          id_producto_pk: 2,
          nombre_producto: 'Abono líquido',
          descripcion_producto: 'Abono natural para plantas',
          precio_producto: 8000.25,
          stock_producto: 300,
          fecha_ingreso_producto: '2025-09-18T10:00:00.000Z',
          fecha_caducidad_producto: '2026-11-30',
          id_cultivo_fk: 2,
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.productosService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:productos:read')
  @ApiOperation({
    summary: 'Obtener un producto por ID',
    description: 'Devuelve los detalles de un producto específico según su ID. Requiere el permiso "finanzas:productos:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado',
    schema: {
      example: {
        id_producto_pk: 1,
        nombre_producto: 'Fertilizante orgánico',
        descripcion_producto: 'Fertilizante natural para mejorar la calidad del suelo',
        precio_producto: 15000.50,
        stock_producto: 500,
        fecha_ingreso_producto: '2025-09-19T08:32:00.000Z',
        fecha_caducidad_producto: '2026-12-31',
        id_cultivo_fk: 1,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:productos:update')
  @ApiOperation({
    summary: 'Actualizar un producto',
    description: 'Modifica los detalles de un producto existente. Requiere el permiso "finanzas:productos:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado exitosamente',
    schema: {
      example: {
        id_producto_pk: 1,
        nombre_producto: 'Fertilizante orgánico mejorado',
        descripcion_producto: 'Fertilizante natural mejorado para la calidad del suelo',
        precio_producto: 16000.75,
        stock_producto: 450,
        fecha_ingreso_producto: '2025-09-19T08:32:00.000Z',
        fecha_caducidad_producto: '2026-12-31',
        id_cultivo_fk: 1,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiBody({
    type: UpdateProductoDto,
    description: 'Datos para actualizar el producto (campos opcionales)',
    examples: {
      valido: {
        value: {
          nombre_producto: 'Fertilizante orgánico mejorado',
          descripcion_producto: 'Fertilizante natural mejorado para la calidad del suelo',
          precio_producto: 16000.75,
          stock_producto: 450,
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_producto: '', // Valor inválido (vacío)
          precio_producto: -100, // Valor inválido (negativo)
          stock_producto: -10, // Valor inválido (negativo)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:productos:delete')
  @ApiOperation({
    summary: 'Eliminar un producto',
    description: 'Elimina un producto del sistema. Requiere el permiso "finanzas:productos:delete".',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto eliminado exitosamente',
    schema: {
      example: { message: 'Producto con ID 1 eliminado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:productos:update')
  @ApiOperation({
    summary: 'Restaurar un producto eliminado',
    description: 'Restaura un producto previamente eliminado. Requiere el permiso "finanzas:productos:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto restaurado exitosamente',
    schema: {
      example: { message: 'Producto con ID 1 restaurado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.restore(id);
  }
}