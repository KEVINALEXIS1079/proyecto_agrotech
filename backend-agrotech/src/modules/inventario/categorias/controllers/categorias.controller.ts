// src/modules/inventario/categorias/controllers/categorias.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { CategoriasService } from '../services/categorias.service';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';
import { CategoriasGateway } from '../gateways/categoria.gateway';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CategoriasDocs } from '../docs/categorias.docs';

function ApiResponses(responses: { status: number; description: string }[]) {
  return applyDecorators(...responses.map(r => ApiResponse(r)));
}

@ApiTags('Categorias')
@ApiBearerAuth('access-token')
@Controller('categorias')
@UseGuards(JwtAuthGuard, PermisosGuard)
export class CategoriasController {
  constructor(
    private readonly categoriasService: CategoriasService,
    private readonly categoriasGateway: CategoriasGateway,
  ) {}

  @Post()
  @PermisoRequerido('inventario:categorias:create')
  @ApiOperation(CategoriasDocs.create.operation)
  @ApiBody(CategoriasDocs.create.body)
  @ApiResponses(CategoriasDocs.create.response)
  async create(@Body() dto: CreateCategoriaDto) {
    const result = await this.categoriasService.create(dto);
    this.categoriasGateway.server.emit('categorias:created', result.data);
    return result;
  }

  @Get()
  @PermisoRequerido('inventario:categorias:read')
  @ApiOperation(CategoriasDocs.findAll.operation)
  @ApiResponses(CategoriasDocs.findAll.response)
  async findAll() {
    return await this.categoriasService.findAll();
  }

  @Get(':id')
  @PermisoRequerido('inventario:categorias:read')
  @ApiOperation(CategoriasDocs.findOne.operation)
  @ApiResponses(CategoriasDocs.findOne.response)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriasService.findOne(id);
  }

  @Patch(':id')
  @PermisoRequerido('inventario:categorias:update')
  @ApiOperation(CategoriasDocs.update.operation)
  @ApiBody(CategoriasDocs.update.body)
  @ApiResponses(CategoriasDocs.update.response)
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoriaDto) {
    const result = await this.categoriasService.update(id, dto);
    this.categoriasGateway.server.emit('categorias:updated', result.data);
    return result;
  }

  @Delete(':id')
  @PermisoRequerido('inventario:categorias:delete')
  @ApiOperation(CategoriasDocs.remove.operation)
  @ApiResponses(CategoriasDocs.remove.response)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.categoriasService.remove(id);
    this.categoriasGateway.server.emit('categorias:removed', { id });
    return result;
  }

  @Patch('restore/:id')
  @PermisoRequerido('inventario:categorias:update')
  @ApiOperation(CategoriasDocs.restore.operation)
  @ApiResponses(CategoriasDocs.restore.response)
  async restore(@Param('id', ParseIntPipe) id: number) {
    const result = await this.categoriasService.restore(id);
    this.categoriasGateway.server.emit('categorias:restored', result.data);
    return result;
  }
}
