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
import { EpasService } from '../service/epas.service';
import { CreateEpaDto } from '../dto/create-epa.dto';
import { UpdateEpaDto } from '../dto/update-epa.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Epas') // Agrupa los endpoints bajo "Epas"
@ApiBearerAuth('access-token') // Indica que se requiere autenticación JWT
@Controller('epas')
export class EpasController {
  constructor(private readonly epasService: EpasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:epas:create')
  @ApiOperation({
    summary: 'Crear un nuevo EPA',
    description: 'Registra un nuevo EPA en el sistema. Requiere el permiso "fitosanitario:epas:create".',
  })
  @ApiResponse({
    status: 201,
    description: 'EPA creado exitosamente',
    schema: {
      example: {
        id_epa_pk: 1,
        nombre_epa: 'Sigatoga negra',
        descripcion_epa: 'Sigatoga negra encontrada en el cacao',
        estado: 'presente',
        id_tipo_epa_fk: 1,
        id_cultivo_fk: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiBody({
    type: CreateEpaDto,
    description: 'Datos requeridos para crear un EPA',
    examples: {
      valido: {
        value: {
          nombre_epa: 'Sigatoga negra',
          descripcion_epa: 'Sigatoga negra encontrada en el cacao',
          estado: 'presente',
          id_tipo_epa_fk: 1,
          id_cultivo_fk: 2,
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_epa: '', // Valor inválido (vacío)
          descripcion_epa: '', // Valor inválido (vacío)
          estado: 'invalid', // Valor inválido (no en enum)
          id_tipo_epa_fk: null, // Valor inválido (vacío)
          id_cultivo_fk: -1, // Valor inválido (negativo)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  create(@Body() dto: CreateEpaDto) {
    return this.epasService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:epas:read')
  @ApiOperation({
    summary: 'Obtener todos los EPAs',
    description: 'Devuelve la lista completa de EPAs. Requiere el permiso "fitosanitario:epas:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de EPAs obtenida exitosamente',
    schema: {
      example: [
        {
          id_epa_pk: 1,
          nombre_epa: 'Sigatoga negra',
          descripcion_epa: 'Sigatoga negra encontrada en el cacao',
          estado: 'presente',
          id_tipo_epa_fk: 1,
          id_cultivo_fk: 2,
        },
        {
          id_epa_pk: 2,
          nombre_epa: 'Mancha anaranjada',
          descripcion_epa: 'Mancha anaranjada en café',
          estado: 'ausente',
          id_tipo_epa_fk: 2,
          id_cultivo_fk: 3,
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.epasService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:epas:read')
  @ApiOperation({
    summary: 'Obtener un EPA por ID',
    description: 'Devuelve los detalles de un EPA específico según su ID. Requiere el permiso "fitosanitario:epas:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'EPA encontrado',
    schema: {
      example: {
        id_epa_pk: 1,
        nombre_epa: 'Sigatoga negra',
        descripcion_epa: 'Sigatoga negra encontrada en el cacao',
        estado: 'presente',
        id_tipo_epa_fk: 1,
        id_cultivo_fk: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'EPA no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.epasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:epas:update')
  @ApiOperation({
    summary: 'Actualizar un EPA',
    description: 'Modifica los detalles de un EPA existente. Requiere el permiso "fitosanitario:epas:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'EPA actualizado exitosamente',
    schema: {
      example: {
        id_epa_pk: 1,
        nombre_epa: 'Sigatoga negra actualizada',
        descripcion_epa: 'Sigatoga negra encontrada en el cacao, nivel moderado',
        estado: 'presente',
        id_tipo_epa_fk: 1,
        id_cultivo_fk: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'EPA no encontrado' })
  @ApiBody({
    type: UpdateEpaDto,
    description: 'Datos para actualizar el EPA (campos opcionales)',
    examples: {
      valido: {
        value: {
          nombre_epa: 'Sigatoga negra actualizada',
          descripcion_epa: 'Sigatoga negra encontrada en el cacao, nivel moderado',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_epa: '', // Valor inválido (vacío)
          descripcion_epa: '', // Valor inválido (vacío)
          estado: 'invalid', // Valor inválido (no en enum)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEpaDto) {
    return this.epasService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:epas:delete')
  @ApiOperation({
    summary: 'Eliminar un EPA',
    description: 'Elimina un EPA del sistema. Requiere el permiso "fitosanitario:epas:delete".',
  })
  @ApiResponse({
    status: 200,
    description: 'EPA eliminado exitosamente',
    schema: {
      example: { message: 'EPA con ID 1 eliminado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'EPA no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.epasService.remove(id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:epas:update')
  @ApiOperation({
    summary: 'Restaurar un EPA eliminado',
    description: 'Restaura un EPA previamente eliminado. Requiere el permiso "fitosanitario:epas:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'EPA restaurado exitosamente',
    schema: {
      example: { message: 'EPA con ID 1 restaurado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'EPA no encontrado' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.epasService.restore(id);
  }
}