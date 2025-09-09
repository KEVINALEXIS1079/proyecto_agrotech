import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TipoActividadService } from './tipo-actividad.service';
import { CreateTipoActividadDto } from './dto/create-tipo-actividad.dto';
import { UpdateTipoActividadDto } from './dto/update-tipo-actividad.dto';

@Controller('tipo-actividad')
export class TipoActividadController {
  constructor(private readonly tipoActividadService: TipoActividadService) {}

  @Post()
  create(@Body() createTipoActividadDto: CreateTipoActividadDto) {
    return this.tipoActividadService.create(createTipoActividadDto);
  }

  @Get()
  findAll() {
    return this.tipoActividadService.findAll();
  }

  @Get(':id_tipo_actividad_pk')
  findOne(@Param('id_tipo_actividad_pk', ParseIntPipe) id_tipo_actividad_pk: number) {
    return this.tipoActividadService.findOne(+id_tipo_actividad_pk);
  }

  @Patch(':id_tipo_actividad_pk')
  update(@Param('id_tipo_actividad_pk', ParseIntPipe) id_tipo_actividad_pk: number, @Body() updateTipoActividadDto: UpdateTipoActividadDto) {
    return this.tipoActividadService.update(+id_tipo_actividad_pk, updateTipoActividadDto);
  }

  @Delete(':id_tipo_actividad_pk')
  remove(@Param('id_tipo_actividad_pk') id_tipo_actividad_pk: number) {
    return this.tipoActividadService.remove(+id_tipo_actividad_pk);
  }
}





