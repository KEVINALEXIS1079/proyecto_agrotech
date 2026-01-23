import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseGuards, applyDecorators } from '@nestjs/common';
import { CultivosService } from '../services/cultivos.service';
import { CreateCultivoDto } from '../dto/create-cultivo.dto';
import { UpdateCultivoDto } from '../dto/update-cultivo.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CultivosGateway } from '../gateways/cultivos.gateway';
import { CultivosDocs } from '../docs/cultivos.docs';

// Helper para aplicar múltiples ApiResponse
function ApiResponses(responses: { status: number; description: string }[]) {
  return applyDecorators(...responses.map(r => ApiResponse(r)));
}

@ApiTags('Cultivos')
@ApiBearerAuth('access-token')
@Controller('cultivos')
export class CultivosController {
  constructor(
    private readonly cultivosService: CultivosService,
    private readonly cultivosGateway: CultivosGateway,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:cultivos:create')
  @ApiOperation(CultivosDocs.create.operation)
  @ApiBody(CultivosDocs.create.body)
  @ApiResponses(CultivosDocs.create.response)
  async create(@Body() createCultivoDto: CreateCultivoDto) {
    const cultivo = await this.cultivosService.create(createCultivoDto);
    this.cultivosGateway.server.emit('cultivos:created', cultivo);
    return cultivo;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:cultivos:read')
  @ApiOperation(CultivosDocs.findAll.operation)
  @ApiResponses(CultivosDocs.findAll.response)
  async findAll() {
    return this.cultivosService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:cultivos:read')
  @ApiOperation(CultivosDocs.findOne.operation)
  @ApiResponses(CultivosDocs.findOne.response)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cultivosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:cultivos:update')
  @ApiOperation(CultivosDocs.update.operation)
  @ApiBody(CultivosDocs.update.body)
  @ApiResponses(CultivosDocs.update.response)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCultivoDto: UpdateCultivoDto) {
    const cultivo = await this.cultivosService.update(id, updateCultivoDto);
    this.cultivosGateway.server.emit('cultivos:updated', cultivo);
    return cultivo;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:cultivos:delete')
  @ApiOperation(CultivosDocs.remove.operation)
  @ApiResponses(CultivosDocs.remove.response)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.cultivosService.remove(id);
    this.cultivosGateway.server.emit('cultivos:removed', deleted);
    return deleted;
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:cultivos:update')
  @ApiOperation(CultivosDocs.restore.operation)
  @ApiResponses(CultivosDocs.restore.response)
  async restore(@Param('id', ParseIntPipe) id: number) {
    const cultivo = await this.cultivosService.restore(id);
    this.cultivosGateway.server.emit('cultivos:restored', cultivo);
    return cultivo;
  }
}
