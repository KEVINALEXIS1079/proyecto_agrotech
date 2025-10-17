// src/modules/roles/controllers/roles.controller.ts
import {
  Controller, Post, Get, Param, Patch, Delete, Body,
  UseGuards, ParseIntPipe, Query,
} from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { CreateRolDto } from '../dto/create-rol.dto';
import { UpdateRolDto } from '../dto/update-role.dto';
import { Rol } from '../entities/rol.entity';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('Roles')
@ApiBearerAuth('access-token')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:roles:create')
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  @ApiResponse({ status: 201, description: 'Rol creado exitosamente' })
  @ApiBody({ type: CreateRolDto })
  create(@Body() dto: CreateRolDto): Promise<string> {
    return this.rolesService.create(dto);
  }

  /* --- SOLO ELIMINADOS --- */
  @Get('deleted')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:roles:read')
  @ApiOperation({ summary: 'Listar roles eliminados (soft-deleted)' })
  @ApiResponse({ status: 200, description: 'Lista de roles eliminados' })
  listDeleted(): Promise<Rol[]> {
    return this.rolesService.findDeleted();
  }

  /* --- ACTIVOS o TODOS (?withDeleted=1) --- */
  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:roles:read')
  @ApiOperation({ summary: 'Listar roles' })
  @ApiQuery({ name: 'withDeleted', required: false, example: '1' })
  @ApiResponse({ status: 200, description: 'Lista de roles' })
  findAll(@Query('withDeleted') withDeleted?: string): Promise<Rol[]> {
    if (withDeleted) return this.rolesService.findAllIncludingDeleted();
    return this.rolesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:roles:read')
  @ApiOperation({ summary: 'Obtener un rol por ID (incluye eliminados)' })
  @ApiResponse({ status: 200, description: 'Rol encontrado' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Rol> {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:roles:update')
  @ApiOperation({ summary: 'Actualizar un rol' })
  @ApiResponse({ status: 200, description: 'Rol actualizado' })
  @ApiBody({ type: UpdateRolDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRolDto): Promise<string> {
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:roles:delete')
  @ApiOperation({ summary: 'Eliminar (soft-delete) un rol' })
  @ApiResponse({ status: 200, description: 'Rol eliminado' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.rolesService.remove(id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:roles:update')
  @ApiOperation({ summary: 'Restaurar un rol eliminado' })
  @ApiResponse({ status: 200, description: 'Rol restaurado' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.restore(id);
  }
}
