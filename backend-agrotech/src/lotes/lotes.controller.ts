import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LotesService } from './lotes.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';

@Controller('lotes')
export class LotesController {
  constructor(private readonly lotesService: LotesService) {}

  @Post()
  create(@Body() dto: CreateLoteDto) {
    return this.lotesService.create(dto);
  }

  @Get()
  findAll() {
    return this.lotesService.findAll();
  }

  @Get(':id_lote_pk')
  findOne(@Param('id_lote_pk') id_lote_pk: number) {
    return this.lotesService.findOne(+id_lote_pk);
  }

  @Patch(':id_lote_pk')
  update(@Param('id_lote_pk') id_lote_pk: number, @Body() dto: UpdateLoteDto) {
    return this.lotesService.update(+id_lote_pk, dto);
  }

  @Delete(':id_lote_pk')
  remove(@Param('id_lote_pk') id_lote_pk: number) {
    return this.lotesService.remove(+id_lote_pk);
  }

  @Patch('restore/:id')
  restore(@Param('id') id: string) {
    return this.lotesService.restore(+id); 
  }

  
}
