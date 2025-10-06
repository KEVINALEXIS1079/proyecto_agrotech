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
import { SublotesService } from '../service/sublotes.service';
import { CreateSubloteDto } from '../dto/create-sublote.dto';
import { UpdateSubloteDto } from '../dto/update-sublote.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Sublotes') // Agrupa los endpoints bajo "Sublotes"
@ApiBearerAuth('access-token') // Indica que se requiere autenticación JWT
@Controller('sublotes')
export class SublotesController {
  constructor(private readonly sublotesService: SublotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:sublotes:create')
  @ApiOperation({
    summary: 'Crear un nuevo sublote',
    description: 'Registra un nuevo sublote en el sistema. Requiere el permiso "cultivo:sublotes:create".',
  })
  @ApiResponse({
    status: 201,
    description: 'Sublote creado exitosamente',
    schema: {
      example: {
        id_sublote_pk: 1,
        latitud_sublote: 6.25,
        longitud_sublote: 5.56,
        nombre_sublote: 'Cacao 2',
        descripcion_sublote: 'Sublote destinado a cultivo de cacao',
        id_lote_fk: 3,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiBody({
    type: CreateSubloteDto,
    description: 'Datos requeridos para crear un sublote',
    examples: {
      valido: {
        value: {
          latitud_sublote: 6.25,
          longitud_sublote: 5.56,
          nombre_sublote: 'Cacao 2',
          descripcion_sublote: 'Sublote destinado a cultivo de cacao',
          id_lote_fk: 3,
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          latitud_sublote: '6.25', // No es número
          longitud_sublote: '5.56', // No es número
          nombre_sublote: '', // Valor inválido (vacío)
          descripcion_sublote: '', // Valor inválido (vacío)
          id_lote_fk: -1, // No positivo
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  create(@Body() createSubloteDto: CreateSubloteDto) {
    return this.sublotesService.create(createSubloteDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:sublotes:read')
  @ApiOperation({
    summary: 'Obtener todos los sublotes',
    description: 'Devuelve la lista completa de sublotes. Requiere el permiso "cultivo:sublotes:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de sublotes obtenida exitosamente',
    schema: {
      example: [
        {
          id_sublote_pk: 1,
          latitud_sublote: 6.25,
          longitud_sublote: 5.56,
          nombre_sublote: 'Cacao 2',
          descripcion_sublote: 'Sublote destinado a cultivo de cacao',
          id_lote_fk: 3,
        },
        {
          id_sublote_pk: 2,
          latitud_sublote: 6.30,
          longitud_sublote: 5.60,
          nombre_sublote: 'Café 1',
          descripcion_sublote: 'Sublote destinado a cultivo de café',
          id_lote_fk: 4,
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.sublotesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:sublotes:read')
  @ApiOperation({
    summary: 'Obtener un sublote por ID',
    description: 'Devuelve los detalles de un sublote específico según su ID. Requiere el permiso "cultivo:sublotes:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Sublote encontrado',
    schema: {
      example: {
        id_sublote_pk: 1,
        latitud_sublote: 6.25,
        longitud_sublote: 5.56,
        nombre_sublote: 'Cacao 2',
        descripcion_sublote: 'Sublote destinado a cultivo de cacao',
        id_lote_fk: 3,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Sublote no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sublotesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:sublotes:update')
  @ApiOperation({
    summary: 'Actualizar un sublote',
    description: 'Modifica los detalles de un sublote existente. Requiere el permiso "cultivo:sublotes:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Sublote actualizado exitosamente',
    schema: {
      example: {
        id_sublote_pk: 1,
        latitud_sublote: 6.26,
        longitud_sublote: 5.57,
        nombre_sublote: 'Cacao 2 Actualizado',
        descripcion_sublote: 'Sublote actualizado para cultivo de cacao',
        id_lote_fk: 3,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Sublote no encontrado' })
  @ApiBody({
    type: UpdateSubloteDto,
    description: 'Datos para actualizar el sublote (campos opcionales)',
    examples: {
      valido: {
        value: {
          latitud_sublote: 6.26,
          longitud_sublote: 5.57,
          nombre_sublote: 'Cacao 2 Actualizado',
          descripcion_sublote: 'Sublote actualizado para cultivo de cacao',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          latitud_sublote: '6.26', // No es número
          longitud_sublote: '5.57', // No es número
          nombre_sublote: '', // Valor inválido (vacío)
          descripcion_sublote: '', // Valor inválido (vacío)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSubloteDto: UpdateSubloteDto) {
    return this.sublotesService.update(id, updateSubloteDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:sublotes:delete')
  @ApiOperation({
    summary: 'Eliminar un sublote',
    description: 'Elimina un sublote del sistema. Requiere el permiso "cultivo:sublotes:delete".',
  })
  @ApiResponse({
    status: 200,
    description: 'Sublote eliminado exitosamente',
    schema: {
      example: { message: 'Sublote con ID 1 eliminado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Sublote no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sublotesService.remove(id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:sublotes:update')
  @ApiOperation({
    summary: 'Restaurar un sublote eliminado',
    description: 'Restaura un sublote previamente eliminado. Requiere el permiso "cultivo:sublotes:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Sublote restaurado exitosamente',
    schema: {
      example: { message: 'Sublote con ID 1 restaurado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Sublote no encontrado' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.sublotesService.restore(id);
  }
}