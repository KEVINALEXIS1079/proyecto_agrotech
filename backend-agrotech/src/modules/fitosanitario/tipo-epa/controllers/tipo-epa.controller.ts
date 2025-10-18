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
import { TipoEpaService } from '../services/tipo-epa.service';
import { CreateTipoEpaDto } from '../dto/create-tipo-epa.dto';
import { UpdateTipoEpaDto } from '../dto/update-tipo-epa.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { TipoEpaGateway } from '../gateways/tipo-epa.gateway';
import { TipoEpaDocs } from '../docs/tipo-epa.docs'

// Helper para aplicar todos los ApiResponse
function ApiResponses(responses: { status: number; description: string }[]) {
  return applyDecorators(...responses.map(r => ApiResponse(r)));
}

@ApiTags('Tipo-Epa')
@ApiBearerAuth('access-token')
@Controller('tipo-epa')
export class TipoEpaController {
  constructor(
    private readonly tiposEpasService: TipoEpaService,
    private readonly tipoEpaGateway: TipoEpaGateway, // Inyectamos el gateway
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-epa:create')
  @ApiOperation(TipoEpaDocs.create.operation)
  @ApiBody(TipoEpaDocs.create.body)
  @ApiResponses(TipoEpaDocs.create.response)
  async create(@Body() createTipoEpaDto: CreateTipoEpaDto) {
    const result = await this.tiposEpasService.create(createTipoEpaDto);
    this.tipoEpaGateway.server.emit('tipo-epa:created', result); 
    return result;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:tipo-epa:read')
  @ApiOperation(TipoEpaDocs.findAll.operation)
  @ApiResponses(TipoEpaDocs.findAll.response)
  async findAll() {
    const result = await this.tiposEpasService.findAll();
    return result;
  }

  @Get(':id_tipo_epa_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:tipo-epa:read')
  @ApiOperation(TipoEpaDocs.findOne.operation)
  @ApiResponses(TipoEpaDocs.findOne.response)
  async findOne(@Param('id_tipo_epa_pk', ParseIntPipe) id_tipo_epa_pk: number) {
    const result = await this.tiposEpasService.findOne(id_tipo_epa_pk);
    return result;
  }

  @Patch(':id_tipo_epa_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-epa:update')
  @ApiOperation(TipoEpaDocs.update.operation)
  @ApiBody(TipoEpaDocs.update.body)
  @ApiResponses(TipoEpaDocs.update.response)
  async update(
    @Param('id_tipo_epa_pk', ParseIntPipe) id_tipo_epa_pk: number,
    @Body() updateTipoEpaDto: UpdateTipoEpaDto,
  ) {
    const result = await this.tiposEpasService.update(id_tipo_epa_pk, updateTipoEpaDto);
    this.tipoEpaGateway.server.emit('tipo-epa:updated', result); 
    return result;
  }

  @Delete(':id_tipo_epa_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-epa:delete')
  @ApiOperation(TipoEpaDocs.remove.operation)
  @ApiResponses(TipoEpaDocs.remove.response)
  async remove(@Param('id_tipo_epa_pk', ParseIntPipe) id_tipo_epa_pk: number) {
    const result = await this.tiposEpasService.remove(id_tipo_epa_pk);
    this.tipoEpaGateway.server.emit('tipo-epa:removed', { id_tipo_epa_pk }); 
    return result;
  }

  @Patch('restore/:id_tipo_epa_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-epa:update')
  @ApiOperation(TipoEpaDocs.restore.operation)
  @ApiResponses(TipoEpaDocs.restore.response)
  async restore(@Param('id_tipo_epa_pk', ParseIntPipe) id_tipo_epa_pk: number) {
    const result = await this.tiposEpasService.restore(id_tipo_epa_pk);
    this.tipoEpaGateway.server.emit('tipo-epa:restored', result); 
    return result;
  }
}
