import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EvidenciasService } from './evidencias.service';
import { CreateEvidenciaDto } from './dto/create-evidencia.dto';
import { UpdateEvidenciaDto } from './dto/update-evidencia.dto';

@Controller('evidencias')
export class EvidenciasController {
  constructor(private readonly evidenciasService: EvidenciasService) {}

  @Post()
  create(@Body() createEvidenciaDto: CreateEvidenciaDto) {
    return this.evidenciasService.create(createEvidenciaDto);
  }

  @Get()
  findAll() {
    return this.evidenciasService.findAll();
  }

  @Get(':id_evidencia_pk')
  findOne(@Param('id_evidencia_pk', ParseIntPipe) id_evidencia_pk: number) {
    return this.evidenciasService.findOne(+id_evidencia_pk);
  }

  @Patch(':id_evidencia_pk')
  update(@Param('id_evidencia_pk', ParseIntPipe) id_evidencia_pk: number, @Body() updateEvidenciaDto: UpdateEvidenciaDto) {
    return this.evidenciasService.update(+id_evidencia_pk, updateEvidenciaDto);
  }

  @Delete(':id_evidencia_pk')
  remove(@Param('id_evidencia_pk', ParseIntPipe) id_evidencia_pk: number) {
    return this.evidenciasService.remove(+id_evidencia_pk);
  }
}






