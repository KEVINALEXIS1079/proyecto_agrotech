import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards, applyDecorators } from '@nestjs/common';
import { EpasService } from '../services/epas.service';
import { CreateEpaDto } from '../dto/create-epa.dto';
import { UpdateEpaDto } from '../dto/update-epa.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EpasGateway } from '../gateways/epas.gateway';
import { EpasDocs } from '../docs/epas.docs';

function ApiResponses(responses: { status: number; description: string }[]) {
  return applyDecorators(...responses.map(r => ApiResponse(r)));
}

@ApiTags('Epas')
@ApiBearerAuth('access-token')
@Controller('epas')
export class EpasController {
  constructor(
    private readonly epasService: EpasService,
    private readonly epasGateway: EpasGateway,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:epas:create')
  @ApiOperation(EpasDocs.create.operation)
  @ApiBody(EpasDocs.create.body)
  @ApiResponses(EpasDocs.create.response)
  async create(@Body() dto: CreateEpaDto) {
    const epa = await this.epasService.create(dto);
    this.epasGateway.server.emit('epas:created', epa);
    return epa;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:epas:read')
  @ApiOperation(EpasDocs.findAll.operation)
  @ApiResponses(EpasDocs.findAll.response)
  async findAll() {
    return this.epasService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:epas:read')
  @ApiOperation(EpasDocs.findOne.operation)
  @ApiResponses(EpasDocs.findOne.response)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.epasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:epas:update')
  @ApiOperation(EpasDocs.update.operation)
  @ApiBody(EpasDocs.update.body)
  @ApiResponses(EpasDocs.update.response)
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEpaDto) {
    const epa = await this.epasService.update(id, dto);
    this.epasGateway.server.emit('epas:updated', epa);
    return epa;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:epas:delete')
  @ApiOperation(EpasDocs.remove.operation)
  @ApiResponses(EpasDocs.remove.response)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const epa = await this.epasService.remove(id);
    this.epasGateway.server.emit('epas:removed', epa);
    return epa;
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:epas:update')
  @ApiOperation(EpasDocs.restore.operation)
  @ApiResponses(EpasDocs.restore.response)
  async restore(@Param('id', ParseIntPipe) id: number) {
    const epa = await this.epasService.restore(id);
    this.epasGateway.server.emit('epas:restored', epa);
    return epa;
  }
}
