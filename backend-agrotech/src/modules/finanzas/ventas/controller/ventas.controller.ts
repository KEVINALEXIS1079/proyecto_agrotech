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
import { VentasService } from '../service/ventas.service';
import { CreateVentaDto } from '../dto/create-venta.dto';
import { UpdateVentaDto } from '../dto/update-venta.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Ventas') // Agrupa los endpoints bajo "Ventas"
@ApiBearerAuth('access-token') // Indica que se requiere autenticación JWT
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:ventas:create')
  @ApiOperation({
    summary: 'Crear una nueva venta',
    description: 'Registra una nueva venta en el sistema. Requiere el permiso "finanzas:ventas:create".',
  })
  @ApiResponse({
    status: 201,
    description: 'Venta creada exitosamente',
    schema: {
      example: {
        id_venta_pk: 1,
        cantidad: 10,
        precio_unitario: 25000.50,
        fecha: '2025-09-19',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiBody({
    type: CreateVentaDto,
    description: 'Datos requeridos para crear una venta',
    examples: {
      valido: {
        value: {
          cantidad: 10,
          precio_unitario: 25000.50,
          fecha: '2025-09-19',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          cantidad: -5, // Valor inválido (negativo)
          precio_unitario: -100, // Valor inválido (negativo)
          fecha: '2025-13-45', // Fecha inválida
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventasService.create(createVentaDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:ventas:read')
  @ApiOperation({
    summary: 'Obtener todas las ventas',
    description: 'Devuelve la lista completa de ventas. Requiere el permiso "finanzas:ventas:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ventas obtenida exitosamente',
    schema: {
      example: [
        {
          id_venta_pk: 1,
          cantidad: 10,
          precio_unitario: 25000.50,
          fecha: '2025-09-19',
        },
        {
          id_venta_pk: 2,
          cantidad: 5,
          precio_unitario: 30000.75,
          fecha: '2025-09-18',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.ventasService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:ventas:read')
  @ApiOperation({
    summary: 'Obtener una venta por ID',
    description: 'Devuelve los detalles de una venta específica según su ID. Requiere el permiso "finanzas:ventas:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Venta encontrada',
    schema: {
      example: {
        id_venta_pk: 1,
        cantidad: 10,
        precio_unitario: 25000.50,
        fecha: '2025-09-19',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:ventas:update')
  @ApiOperation({
    summary: 'Actualizar una venta',
    description: 'Modifica los detalles de una venta existente. Requiere el permiso "finanzas:ventas:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Venta actualizada exitosamente',
    schema: {
      example: {
        id_venta_pk: 1,
        cantidad: 15, // Actualizado
        precio_unitario: 26000.75,
        fecha: '2025-09-19',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  @ApiBody({
    type: UpdateVentaDto,
    description: 'Datos para actualizar la venta (campos opcionales)',
    examples: {
      valido: {
        value: {
          cantidad: 15,
          precio_unitario: 26000.75,
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          cantidad: -5, // Valor inválido (negativo)
          precio_unitario: -100, // Valor inválido (negativo)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateVentaDto: UpdateVentaDto) {
    return this.ventasService.update(id, updateVentaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:ventas:delete')
  @ApiOperation({
    summary: 'Eliminar una venta',
    description: 'Elimina una venta del sistema. Requiere el permiso "finanzas:ventas:delete".',
  })
  @ApiResponse({
    status: 200,
    description: 'Venta eliminada exitosamente',
    schema: {
      example: { message: 'Venta con ID 1 eliminada correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.remove(id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:ventas:update')
  @ApiOperation({
    summary: 'Restaurar una venta eliminada',
    description: 'Restaura una venta previamente eliminada. Requiere el permiso "finanzas:ventas:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Venta restaurada exitosamente',
    schema: {
      example: { message: 'Venta con ID 1 restaurada correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.restore(id);
  }
}