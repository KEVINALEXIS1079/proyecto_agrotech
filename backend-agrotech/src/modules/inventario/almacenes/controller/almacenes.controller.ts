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
import { AlmacenesService } from '../service/almacenes.service';
import { CreateAlmacenDto } from '../dto/create-almacen.dto';
import { UpdateAlmacenDto } from '../dto/update-almacen.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Almacenes') // Agrupa los endpoints bajo "Almacenes"
@ApiBearerAuth('access-token') // Indica que se requiere autenticación JWT
@Controller('almacenes')
export class AlmacenesController {
  constructor(private readonly almacenService: AlmacenesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:almacenes:create')
  @ApiOperation({
    summary: 'Crear un nuevo almacén',
    description: 'Registra un nuevo almacén en el sistema. Requiere el permiso "inventario:almacenes:create".',
  })
  @ApiResponse({
    status: 201,
    description: 'Almacén creado exitosamente',
    schema: {
      example: {
        id_almacen_pk: 1,
        nombre_almacen: 'Almacén Central',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiBody({
    type: CreateAlmacenDto,
    description: 'Datos requeridos para crear un almacén',
    examples: {
      valido: {
        value: {
          nombre_almacen: 'Almacén Central',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_almacen: '', // Valor inválido (vacío)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  create(@Body() dto: CreateAlmacenDto) {
    return this.almacenService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:almacenes:read')
  @ApiOperation({
    summary: 'Obtener todos los almacenes',
    description: 'Devuelve la lista completa de almacenes. Requiere el permiso "inventario:almacenes:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de almacenes obtenida exitosamente',
    schema: {
      example: [
        {
          id_almacen_pk: 1,
          nombre_almacen: 'Almacén Central',
        },
        {
          id_almacen_pk: 2,
          nombre_almacen: 'Depósito Norte',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.almacenService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:almacenes:read')
  @ApiOperation({
    summary: 'Obtener un almacén por ID',
    description: 'Devuelve los detalles de un almacén específico según su ID. Requiere el permiso "inventario:almacenes:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Almacén encontrado',
    schema: {
      example: {
        id_almacen_pk: 1,
        nombre_almacen: 'Almacén Central',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Almacén no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.almacenService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:almacenes:update')
  @ApiOperation({
    summary: 'Actualizar un almacén',
    description: 'Modifica los detalles de un almacén existente. Requiere el permiso "inventario:almacenes:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Almacén actualizado exitosamente',
    schema: {
      example: {
        id_almacen_pk: 1,
        nombre_almacen: 'Almacén Central Actualizado',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Almacén no encontrado' })
  @ApiBody({
    type: UpdateAlmacenDto,
    description: 'Datos para actualizar el almacén (campos opcionales)',
    examples: {
      valido: {
        value: {
          nombre_almacen: 'Almacén Central Actualizado',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_almacen: '', // Valor inválido (vacío)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAlmacenDto) {
    return this.almacenService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:almacenes:delete')
  @ApiOperation({
    summary: 'Eliminar un almacén',
    description: 'Elimina un almacén del sistema. Requiere el permiso "inventario:almacenes:delete".',
  })
  @ApiResponse({
    status: 200,
    description: 'Almacén eliminado exitosamente',
    schema: {
      example: { message: 'Almacén con ID 1 eliminado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Almacén no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.almacenService.remove(id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:almacenes:update')
  @ApiOperation({
    summary: 'Restaurar un almacén eliminado',
    description: 'Restaura un almacén previamente eliminado. Requiere el permiso "inventario:almacenes:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Almacén restaurado exitosamente',
    schema: {
      example: { message: 'Almacén con ID 1 restaurado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Almacén no encontrado' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.almacenService.restore(id);
  }
}