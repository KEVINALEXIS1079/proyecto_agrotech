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
import { TipoCultivoService } from '../service/tipo-cultivo.service';
import { CreateTipoCultivoDto } from '../dto/create-tipo-cultivo.dto';
import { UpdateTipoCultivoDto } from '../dto/update-tipo-cultivo.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Tipo-Cultivo') // Agrupa los endpoints bajo "Tipo-Cultivo"
@ApiBearerAuth('access-token') // Indica que se requiere autenticación JWT
@Controller('tipo-cultivo')
export class TipoCultivoController {
  constructor(private readonly tipoCultivoService: TipoCultivoService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:tipo-cultivo:create')
  @ApiOperation({
    summary: 'Crear un nuevo tipo de cultivo',
    description: 'Registra un nuevo tipo de cultivo en el sistema. Requiere el permiso "cultivo:tipo-cultivo:create".',
  })
  @ApiResponse({
    status: 201,
    description: 'Tipo de cultivo creado exitosamente',
    schema: {
      example: {
        id_tipo_cultivo_pk: 1,
        nombre_tipo_cultivo: 'Plátano Guineo',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiBody({
    type: CreateTipoCultivoDto,
    description: 'Datos requeridos para crear un tipo de cultivo',
    examples: {
      valido: {
        value: {
          nombre_tipo_cultivo: 'Plátano Guineo',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_tipo_cultivo: '', // Valor inválido (vacío)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  create(@Body() createTipoCultivoDto: CreateTipoCultivoDto) {
    return this.tipoCultivoService.create(createTipoCultivoDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:tipo-cultivo:read')
  @ApiOperation({
    summary: 'Obtener todos los tipos de cultivo',
    description: 'Devuelve la lista completa de tipos de cultivo. Requiere el permiso "cultivo:tipo-cultivo:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de cultivo obtenida exitosamente',
    schema: {
      example: [
        {
          id_tipo_cultivo_pk: 1,
          nombre_tipo_cultivo: 'Plátano Guineo',
        },
        {
          id_tipo_cultivo_pk: 2,
          nombre_tipo_cultivo: 'Café',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.tipoCultivoService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:tipo-cultivo:read')
  @ApiOperation({
    summary: 'Obtener un tipo de cultivo por ID',
    description: 'Devuelve los detalles de un tipo de cultivo específico según su ID. Requiere el permiso "cultivo:tipo-cultivo:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de cultivo encontrado',
    schema: {
      example: {
        id_tipo_cultivo_pk: 1,
        nombre_tipo_cultivo: 'Plátano Guineo',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Tipo de cultivo no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tipoCultivoService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:tipo-cultivo:update')
  @ApiOperation({
    summary: 'Actualizar un tipo de cultivo',
    description: 'Modifica los detalles de un tipo de cultivo existente. Requiere el permiso "cultivo:tipo-cultivo:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de cultivo actualizado exitosamente',
    schema: {
      example: {
        id_tipo_cultivo_pk: 1,
        nombre_tipo_cultivo: 'Plátano Guineo Actualizado',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Tipo de cultivo no encontrado' })
  @ApiBody({
    type: UpdateTipoCultivoDto,
    description: 'Datos para actualizar el tipo de cultivo (campos opcionales)',
    examples: {
      valido: {
        value: {
          nombre_tipo_cultivo: 'Plátano Guineo Actualizado',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_tipo_cultivo: '', // Valor inválido (vacío)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTipoCultivoDto: UpdateTipoCultivoDto) {
    return this.tipoCultivoService.update(id, updateTipoCultivoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:tipo-cultivo:delete')
  @ApiOperation({
    summary: 'Eliminar un tipo de cultivo',
    description: 'Elimina un tipo de cultivo del sistema. Requiere el permiso "cultivo:tipo-cultivo:delete".',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de cultivo eliminado exitosamente',
    schema: {
      example: { message: 'Tipo de cultivo con ID 1 eliminado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Tipo de cultivo no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tipoCultivoService.remove(id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:tipo-cultivo:update')
  @ApiOperation({
    summary: 'Restaurar un tipo de cultivo eliminado',
    description: 'Restaura un tipo de cultivo previamente eliminado. Requiere el permiso "cultivo:tipo-cultivo:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de cultivo restaurado exitosamente',
    schema: {
      example: { message: 'Tipo de cultivo con ID 1 restaurado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Tipo de cultivo no encontrado' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.tipoCultivoService.restore(id);
  }
}