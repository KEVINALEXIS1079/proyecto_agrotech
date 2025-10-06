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
import { TipoEpaService } from '../service/tipo-epa.service';
import { CreateTipoEpaDto } from '../dto/create-tipo-epa.dto';
import { UpdateTipoEpaDto } from '../dto/update-tipo-epa.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Tipo-Epa') // Agrupa los endpoints bajo "Tipo-Epa"
@ApiBearerAuth('access-token') // Indica que se requiere autenticación JWT
@Controller('tipo-epa')
export class TipoEpaController {
  constructor(private readonly tiposEpasService: TipoEpaService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-epa:create')
  @ApiOperation({
    summary: 'Crear un nuevo tipo de EPA',
    description: 'Registra un nuevo tipo de EPA en el sistema. Requiere el permiso "actividad:tipo-epa:create".',
  })
  @ApiResponse({
    status: 201,
    description: 'Tipo de EPA creado exitosamente',
    schema: {
      example: {
        id_tipo_epa_pk: 1,
        nombre_tipo_epa: 'Gusano Cogollero',
        descripcion: 'Plaga que afecta las hojas del cultivo de cacao',
        tipo_epa_enum: 'plaga',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiBody({
    type: CreateTipoEpaDto,
    description: 'Datos requeridos para crear un tipo de EPA',
    examples: {
      valido: {
        value: {
          nombre_tipo_epa: 'Gusano Cogollero',
          descripcion: 'Plaga que afecta las hojas del cultivo de cacao',
          tipo_epa_enum: 'plaga',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_tipo_epa: '', // Valor inválido (vacío)
          descripcion: '', // Valor inválido (vacío)
          tipo_epa_enum: 'invalid', // Valor inválido (no en enum)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  create(@Body() dto: CreateTipoEpaDto) {
    return this.tiposEpasService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:tipo-epa:read')
  @ApiOperation({
    summary: 'Obtener todos los tipos de EPA',
    description: 'Devuelve la lista completa de tipos de EPA. Requiere el permiso "fitosanitario:tipo-epa:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de EPA obtenida exitosamente',
    schema: {
      example: [
        {
          id_tipo_epa_pk: 1,
          nombre_tipo_epa: 'Gusano Cogollero',
          descripcion: 'Plaga que afecta las hojas del cultivo de cacao',
          tipo_epa_enum: 'plaga',
        },
        {
          id_tipo_epa_pk: 2,
          nombre_tipo_epa: 'Mancha de oídio',
          descripcion: 'Enfermedad que afecta los frutos del café',
          tipo_epa_enum: 'enfermedad',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.tiposEpasService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:tipo-epa:read')
  @ApiOperation({
    summary: 'Obtener un tipo de EPA por ID',
    description: 'Devuelve los detalles de un tipo de EPA específico según su ID. Requiere el permiso "fitosanitario:tipo-epa:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de EPA encontrado',
    schema: {
      example: {
        id_tipo_epa_pk: 1,
        nombre_tipo_epa: 'Gusano Cogollero',
        descripcion: 'Plaga que afecta las hojas del cultivo de cacao',
        tipo_epa_enum: 'plaga',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Tipo de EPA no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tiposEpasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-epa:update')
  @ApiOperation({
    summary: 'Actualizar un tipo de EPA',
    description: 'Modifica los detalles de un tipo de EPA existente. Requiere el permiso "actividad:tipo-epa:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de EPA actualizado exitosamente',
    schema: {
      example: {
        id_tipo_epa_pk: 1,
        nombre_tipo_epa: 'Gusano Cogollero Actualizado',
        descripcion: 'Plaga que afecta las hojas del cultivo de cacao, nivel alto',
        tipo_epa_enum: 'plaga',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Tipo de EPA no encontrado' })
  @ApiBody({
    type: UpdateTipoEpaDto,
    description: 'Datos para actualizar el tipo de EPA (campos opcionales)',
    examples: {
      valido: {
        value: {
          nombre_tipo_epa: 'Gusano Cogollero Actualizado',
          descripcion: 'Plaga que afecta las hojas del cultivo de cacao, nivel alto',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_tipo_epa: '', // Valor inválido (vacío)
          descripcion: '', // Valor inválido (vacío)
          tipo_epa_enum: 'invalid', // Valor inválido (no en enum)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTipoEpaDto) {
    return this.tiposEpasService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-epa:delete')
  @ApiOperation({
    summary: 'Eliminar un tipo de EPA',
    description: 'Elimina un tipo de EPA del sistema. Requiere el permiso "actividad:tipo-epa:delete".',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de EPA eliminado exitosamente',
    schema: {
      example: { message: 'Tipo de EPA con ID 1 eliminado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Tipo de EPA no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tiposEpasService.remove(id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-epa:update')
  @ApiOperation({
    summary: 'Restaurar un tipo de EPA eliminado',
    description: 'Restaura un tipo de EPA previamente eliminado. Requiere el permiso "actividad:tipo-epa:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de EPA restaurado exitosamente',
    schema: {
      example: { message: 'Tipo de EPA con ID 1 restaurado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Tipo de EPA no encontrado' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.tiposEpasService.restore(id);
  }
}