import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { RolesService } from '../service/roles.service';
import { CreateRolDto } from '../dto/create-rol.dto';
import { UpdateRolDto } from '../dto/update-role.dto';
import { Rol } from '../entities/rol.entity';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Roles') // Agrupa los endpoints bajo "Roles"
@ApiBearerAuth('access-token') // Indica que se requiere autenticación JWT
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:roles:create')
  @ApiOperation({
    summary: 'Crear un nuevo rol',
    description: 'Registra un nuevo rol en el sistema. Requiere el permiso "usuario:roles:create".',
  })
  @ApiResponse({
    status: 201,
    description: 'Rol creado exitosamente',
    schema: {
      example: { message: 'Rol "Instructor" creado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiBody({
    type: CreateRolDto,
    description: 'Datos requeridos para crear un rol',
    examples: {
      valido: {
        value: {
          nombre_rol: 'Instructor',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_rol: '', // Valor inválido (vacío)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  create(@Body() dto: CreateRolDto): Promise<string> {
    return this.rolesService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:roles:read')
  @ApiOperation({
    summary: 'Obtener todos los roles',
    description: 'Devuelve la lista completa de roles. Requiere el permiso "usuario:roles:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles obtenida exitosamente',
    schema: {
      example: [
        {
          id_rol_pk: 1,
          nombre_rol: 'Administrador',
        },
        {
          id_rol_pk: 2,
          nombre_rol: 'Instructor',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll(): Promise<Rol[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:roles:read')
  @ApiOperation({
    summary: 'Obtener un rol por ID',
    description: 'Devuelve los detalles de un rol específico según su ID. Requiere el permiso "usuario:roles:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Rol encontrado',
    schema: {
      example: {
        id_rol_pk: 1,
        nombre_rol: 'Administrador',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Rol> {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:roles:update')
  @ApiOperation({
    summary: 'Actualizar un rol',
    description: 'Modifica los detalles de un rol existente. Requiere el permiso "usuario:roles:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Rol actualizado exitosamente',
    schema: {
      example: { message: 'Rol con ID 1 actualizado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  @ApiBody({
    type: UpdateRolDto,
    description: 'Datos para actualizar el rol (campos opcionales)',
    examples: {
      valido: {
        value: {
          nombre_rol: 'Instructor Actualizado',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_rol: '', // Valor inválido (vacío)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRolDto): Promise<string> {
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:roles:delete')
  @ApiOperation({
    summary: 'Eliminar un rol',
    description: 'Elimina un rol del sistema. Requiere el permiso "usuario:roles:delete".',
  })
  @ApiResponse({
    status: 200,
    description: 'Rol eliminado exitosamente',
    schema: {
      example: { message: 'Rol con ID 1 eliminado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.rolesService.remove(id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:roles:update')
  @ApiOperation({
    summary: 'Restaurar un rol eliminado',
    description: 'Restaura un rol previamente eliminado. Requiere el permiso "usuario:roles:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Rol restaurado exitosamente',
    schema: {
      example: { message: 'Rol con ID 1 restaurado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.restore(id);
  }
}