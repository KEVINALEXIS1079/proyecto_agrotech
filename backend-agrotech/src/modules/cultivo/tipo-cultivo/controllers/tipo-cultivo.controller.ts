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
  applyDecorators,
} from '@nestjs/common';
import { TipoCultivoService } from '../services/tipo-cultivo.service';
import { CreateTipoCultivoDto } from '../dto/create-tipo-cultivo.dto';
import { UpdateTipoCultivoDto } from '../dto/update-tipo-cultivo.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { TipoCultivoGateway } from '../gateways/tipo-cultivo.gateway';
import { TipoCultivoDocs } from '../docs/tipo-cultivo.docs';

function ApiResponses(responses: { status: number; description: string }[]) {
  return applyDecorators(...responses.map(r => ApiResponse(r)));
}

@ApiTags('TipoCultivo')
@ApiBearerAuth('access-token')
@Controller('tipo-cultivo')
export class TipoCultivoController {
  constructor(
    private readonly tipoCultivoService: TipoCultivoService,
    private readonly tipoCultivoGateway: TipoCultivoGateway,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:tipo-cultivo:create')
  @ApiOperation(TipoCultivoDocs.create.operation)
  @ApiBody(TipoCultivoDocs.create.body)
  @ApiResponses(TipoCultivoDocs.create.response)
  async create(@Body() createDto: CreateTipoCultivoDto) {
    const entity = await this.tipoCultivoService.create(createDto);
    this.tipoCultivoGateway.server.emit('tipo-cultivo:created', entity);
    return entity;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:tipo-cultivo:read')
  @ApiOperation(TipoCultivoDocs.findAll.operation)
  @ApiResponses(TipoCultivoDocs.findAll.response)
  async findAll() {
    return await this.tipoCultivoService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:tipo-cultivo:read')
  @ApiOperation(TipoCultivoDocs.findOne.operation)
  @ApiResponses(TipoCultivoDocs.findOne.response)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.tipoCultivoService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:tipo-cultivo:update')
  @ApiOperation(TipoCultivoDocs.update.operation)
  @ApiBody(TipoCultivoDocs.update.body)
  @ApiResponses(TipoCultivoDocs.update.response)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateTipoCultivoDto) {
    const entity = await this.tipoCultivoService.update(id, updateDto);
    this.tipoCultivoGateway.server.emit('tipo-cultivo:updated', entity);
    return entity;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:tipo-cultivo:delete')
  @ApiOperation(TipoCultivoDocs.remove.operation)
  @ApiResponses(TipoCultivoDocs.remove.response)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.tipoCultivoService.remove(id);
    this.tipoCultivoGateway.server.emit('tipo-cultivo:removed', { id });
    return deleted;
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:tipo-cultivo:update')
  @ApiOperation(TipoCultivoDocs.restore.operation)
  @ApiResponses(TipoCultivoDocs.restore.response)
  async restore(@Param('id', ParseIntPipe) id: number) {
    const entity = await this.tipoCultivoService.restore(id);
    this.tipoCultivoGateway.server.emit('tipo-cultivo:restored', entity);
    return entity;
  }
}
