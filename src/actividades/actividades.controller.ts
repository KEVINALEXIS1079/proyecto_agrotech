import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { CreateActividadesDto } from './dto/create-actividades.dto';
import { UpdateActividadesDto } from './dto/update-actividades.dto';

@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  //crear actividad
  @Post()
  create(@Body() createActividadesDto: CreateActividadesDto) {
    return this.actividadesService.create(createActividadesDto);
  }


  @Get()
  findAll() {
    return this.actividadesService.findAll();
  }

 
  @Get(':id_actividad_pk')
  findOne(@Param('id_actividad_pk', ParseIntPipe) id_actividad_pk: number) {
    return this.actividadesService.findOne(+id_actividad_pk);
  }

  
  @Patch(':id_actividad_pk')
  update(@Param('id_actividad_pk', ParseIntPipe) id_actividad_pk: number, @Body() updateActividadesDto: UpdateActividadesDto) {
    return this.actividadesService.update(+id_actividad_pk, updateActividadesDto);
  }

  @Delete(':id_actividad_pk')
  remove(@Param('id_actividad_pk', ParseIntPipe) id_actividad_pk: number) {
    return this.actividadesService.remove(+id_actividad_pk);
  }
}




