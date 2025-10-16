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
import { InsumoProveedorService } from '../services/insumo-proveedor.service';
import { CreateInsumoProveedorDto } from '../dto/create-insumo-proveedor.dto';
import { UpdateInsumoProveedorDto } from '../dto/update-insumo-proveedor.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Insumo-Proveedor') // Agrupa los endpoints bajo "Insumo-Proveedor"
@ApiBearerAuth('access-token') // Indica que se requiere autenticación JWT
@Controller('insumo-proveedor')
export class InsumoProveedorController {
  constructor(private readonly insumosProveedoresService: InsumoProveedorService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:insumo-proveedor:create')
  @ApiOperation({
    summary: 'Crear una nueva relación insumo-proveedor',
    description: 'Registra una nueva relación entre un insumo y un proveedor. Requiere el permiso "inventario:insumo-proveedor:create".',
  })
  @ApiResponse({
    status: 201,
    description: 'Relación insumo-proveedor creada exitosamente',
    schema: {
      example: {
        id_insumo_proveedor_pk: 1,
        id_insumo_fk: 1,
        id_proveedor_fk: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiBody({
    type: CreateInsumoProveedorDto,
    description: 'Datos requeridos para crear una relación insumo-proveedor',
    examples: {
      valido: {
        value: {
          id_insumo_fk: 1,
          id_proveedor_fk: 2,
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          id_insumo_fk: '1', // Valor inválido (no entero)
          id_proveedor_fk: -5, // Valor inválido (negativo)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  create(@Body() createInsumosProveedoresDto: CreateInsumoProveedorDto) {
    return this.insumosProveedoresService.create(createInsumosProveedoresDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:insumo-proveedor:read')
  @ApiOperation({
    summary: 'Obtener todas las relaciones insumo-proveedor',
    description: 'Devuelve la lista completa de relaciones insumo-proveedor. Requiere el permiso "inventario:insumo-proveedor:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de relaciones insumo-proveedor obtenida exitosamente',
    schema: {
      example: [
        {
          id_insumo_proveedor_pk: 1,
          id_insumo_fk: 1,
          id_proveedor_fk: 2,
        },
        {
          id_insumo_proveedor_pk: 2,
          id_insumo_fk: 5,
          id_proveedor_fk: 7,
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.insumosProveedoresService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:insumo-proveedor:read')
  @ApiOperation({
    summary: 'Obtener una relación insumo-proveedor por ID',
    description: 'Devuelve los detalles de una relación insumo-proveedor específica según su ID. Requiere el permiso "inventario:insumo-proveedor:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación insumo-proveedor encontrada',
    schema: {
      example: {
        id_insumo_proveedor_pk: 1,
        id_insumo_fk: 1,
        id_proveedor_fk: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Relación insumo-proveedor no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.insumosProveedoresService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:insumo-proveedor:update')
  @ApiOperation({
    summary: 'Actualizar una relación insumo-proveedor',
    description: 'Modifica los detalles de una relación insumo-proveedor existente. Requiere el permiso "inventario:insumo-proveedor:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación insumo-proveedor actualizada exitosamente',
    schema: {
      example: {
        id_insumo_proveedor_pk: 1,
        id_insumo_fk: 5, // Actualizado
        id_proveedor_fk: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Relación insumo-proveedor no encontrada' })
  @ApiBody({
    type: UpdateInsumoProveedorDto,
    description: 'Datos para actualizar la relación insumo-proveedor (campos opcionales)',
    examples: {
      valido: {
        value: {
          id_insumo_fk: 5,
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          id_insumo_fk: '5', // Valor inválido (no entero)
          id_proveedor_fk: -5, // Valor inválido (negativo)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInsumosProveedoresDto: UpdateInsumoProveedorDto,
  ) {
    return this.insumosProveedoresService.update(id, updateInsumosProveedoresDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:insumo-proveedor:delete')
  @ApiOperation({
    summary: 'Eliminar una relación insumo-proveedor',
    description: 'Elimina una relación insumo-proveedor del sistema. Requiere el permiso "inventario:insumo-proveedor:delete".',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación insumo-proveedor eliminada exitosamente',
    schema: {
      example: { message: 'Relación insumo-proveedor con ID 1 eliminada correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Relación insumo-proveedor no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.insumosProveedoresService.remove(id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:insumo-proveedor:update')
  @ApiOperation({
    summary: 'Restaurar una relación insumo-proveedor eliminada',
    description: 'Restaura una relación insumo-proveedor previamente eliminada. Requiere el permiso "inventario:insumo-proveedor:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación insumo-proveedor restaurada exitosamente',
    schema: {
      example: { message: 'Relación insumo-proveedor con ID 1 restaurada correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Relación insumo-proveedor no encontrada' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.insumosProveedoresService.restore(id);
  }
}