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
import { LotesService } from '../service/lotes.service';
import { CreateLoteDto } from '../dto/create-lote.dto';
import { UpdateLoteDto } from '../dto/update-lote.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Lotes') // Agrupa los endpoints bajo "Lotes"
@ApiBearerAuth('access-token') // Indica que se requiere autenticación JWT
@Controller('lotes')
export class LotesController {
  constructor(private readonly lotesService: LotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:lotes:create')
  @ApiOperation({
    summary: 'Crear un nuevo lote',
    description: 'Registra un nuevo lote en el sistema. Requiere el permiso "cultivo:lotes:create".',
  })
  @ApiResponse({
    status: 201,
    description: 'Lote creado exitosamente',
    schema: {
      example: {
        id_lote_pk: 1,
        area_lote: 120,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiBody({
    type: CreateLoteDto,
    description: 'Datos requeridos para crear un lote',
    examples: {
      valido: {
        value: {
          area_lote: 120,
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          area_lote: -5, // Valor inválido (negativo)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  create(@Body() createLoteDto: CreateLoteDto) {
    return this.lotesService.create(createLoteDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:lotes:read')
  @ApiOperation({
    summary: 'Obtener todos los lotes',
    description: 'Devuelve la lista completa de lotes. Requiere el permiso "cultivo:lotes:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de lotes obtenida exitosamente',
    schema: {
      example: [
        {
          id_lote_pk: 1,
          area_lote: 120,
        },
        {
          id_lote_pk: 2,
          area_lote: 150,
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.lotesService.findAll();
  }

  @Get(':id_lote_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:lotes:read')
  @ApiOperation({
    summary: 'Obtener un lote por ID',
    description: 'Devuelve los detalles de un lote específico según su ID. Requiere el permiso "cultivo:lotes:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lote encontrado',
    schema: {
      example: {
        id_lote_pk: 1,
        area_lote: 120,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Lote no encontrado' })
  findOne(@Param('id_lote_pk', ParseIntPipe) id_lote_pk: number) {
    return this.lotesService.findOne(id_lote_pk);
  }

  @Patch(':id_lote_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:lotes:update')
  @ApiOperation({
    summary: 'Actualizar un lote',
    description: 'Modifica los detalles de un lote existente. Requiere el permiso "cultivo:lotes:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lote actualizado exitosamente',
    schema: {
      example: {
        id_lote_pk: 1,
        area_lote: 150, // Actualizado
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Lote no encontrado' })
  @ApiBody({
    type: UpdateLoteDto,
    description: 'Datos para actualizar el lote (campos opcionales)',
    examples: {
      valido: {
        value: {
          area_lote: 150,
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          area_lote: -5, // Valor inválido (negativo)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  update(
    @Param('id_lote_pk', ParseIntPipe) id_lote_pk: number,
    @Body() updateLoteDto: UpdateLoteDto,
  ) {
    return this.lotesService.update(id_lote_pk, updateLoteDto);
  }

  @Delete(':id_lote_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:lotes:delete')
  @ApiOperation({
    summary: 'Eliminar un lote',
    description: 'Elimina un lote del sistema. Requiere el permiso "cultivo:lotes:delete".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lote eliminado exitosamente',
    schema: {
      example: { message: 'Lote con ID 1 eliminado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Lote no encontrado' })
  remove(@Param('id_lote_pk', ParseIntPipe) id_lote_pk: number) {
    return this.lotesService.remove(id_lote_pk);
  }
}