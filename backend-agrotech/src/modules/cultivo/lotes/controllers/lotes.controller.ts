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
import { LotesService } from '../services/lotes.service';
import { CreateLoteDto } from '../dto/create-lote.dto';
import { UpdateLoteDto } from '../dto/update-lote.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LotesGateway } from '../gateways/lotes.gateway';
import { LotesDocs } from '../docs/lotes.docs';

// Helper para aplicar todos los ApiResponse de forma dinámica
function ApiResponses(responses: { status: number; description: string }[]) {
  return applyDecorators(...responses.map(r => ApiResponse(r)));
}

@ApiTags('Lotes')
@ApiBearerAuth('access-token')
@Controller('lotes')
export class LotesController {
  constructor(
    private readonly lotesService: LotesService,
    private readonly lotesGateway: LotesGateway,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:lotes:create')
  @ApiOperation(LotesDocs.create.operation)
  @ApiBody(LotesDocs.create.body)
  @ApiResponses(LotesDocs.create.response)
  async create(@Body() createLoteDto: CreateLoteDto) {
    const lote = await this.lotesService.create(createLoteDto);
    this.lotesGateway.server.emit('lotes:created', lote);
    return lote;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:lotes:read')
  @ApiOperation(LotesDocs.findAll.operation)
  @ApiResponses(LotesDocs.findAll.response)
  async findAll() {
    return await this.lotesService.findAll();
  }

  @Get(':id_lote_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:lotes:read')
  @ApiOperation(LotesDocs.findOne.operation)
  @ApiResponses(LotesDocs.findOne.response)
  async findOne(@Param('id_lote_pk', ParseIntPipe) id_lote_pk: number) {
    return await this.lotesService.findOne(id_lote_pk);
  }

  @Patch(':id_lote_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:lotes:update')
  @ApiOperation(LotesDocs.update.operation)
  @ApiBody(LotesDocs.update.body)
  @ApiResponses(LotesDocs.update.response)
  async update(
    @Param('id_lote_pk', ParseIntPipe) id_lote_pk: number,
    @Body() updateLoteDto: UpdateLoteDto,
  ) {
    const lote = await this.lotesService.update(id_lote_pk, updateLoteDto);
    this.lotesGateway.server.emit('lotes:updated', lote);
    return lote;
  }

  @Delete(':id_lote_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:lotes:delete')
  @ApiOperation(LotesDocs.remove.operation)
  @ApiResponses(LotesDocs.remove.response)
  async remove(@Param('id_lote_pk', ParseIntPipe) id_lote_pk: number) {
    const deleted = await this.lotesService.remove(id_lote_pk);
    this.lotesGateway.server.emit('lotes:removed', { id_lote_pk });
    return deleted;
  }

  @Patch('restore/:id_lote_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:lotes:update')
  @ApiOperation(LotesDocs.restore.operation)
  @ApiResponses(LotesDocs.restore.response)
  async restore(@Param('id_lote_pk', ParseIntPipe) id_lote_pk: number) {
    const lote = await this.lotesService.restore(id_lote_pk);
    this.lotesGateway.server.emit('lotes:restored', lote);
    return lote;
  }
}
