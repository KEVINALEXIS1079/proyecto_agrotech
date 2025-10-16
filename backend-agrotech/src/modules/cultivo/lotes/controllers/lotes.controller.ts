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
import { LotesService } from '../services/lotes.service';
import { CreateLoteDto } from '../dto/create-lote.dto';
import { UpdateLoteDto } from '../dto/update-lote.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { LotesGateway } from '../gateways/lotes.gateway';

@Controller('lotes')
export class LotesController {
  constructor(
    private readonly lotesService: LotesService,
    private readonly lotesGateway: LotesGateway,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:lotes:create')
  async create(@Body() createLoteDto: CreateLoteDto) {
    const lote = await this.lotesService.create(createLoteDto);
    this.lotesGateway.server.emit('lotes:created', lote);
    return lote;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:lotes:read')
  async findAll() {
    return await this.lotesService.findAll();
  }

  @Get(':id_lote_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:lotes:read')
  async findOne(@Param('id_lote_pk', ParseIntPipe) id_lote_pk: number) {
    return await this.lotesService.findOne(id_lote_pk);
  }

  @Patch(':id_lote_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:lotes:update')
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
  async remove(@Param('id_lote_pk', ParseIntPipe) id_lote_pk: number) {
    const deleted = await this.lotesService.remove(id_lote_pk);
    this.lotesGateway.server.emit('lotes:removed', { id_lote_pk });
    return deleted;
  }

  @Patch('restore/:id_lote_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:lotes:update')
  async restore(@Param('id_lote_pk', ParseIntPipe) id_lote_pk: number) {
    const lote = await this.lotesService.restore(id_lote_pk);
    this.lotesGateway.server.emit('lotes:restored', lote);
    return lote;
  }
}