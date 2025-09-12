import {Controller,Get,Post,Body,Patch,Param,Delete,UseGuards,} from '@nestjs/common';
import { LotesService } from './lotes.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { Roles } from 'src/common/decorator/roles.decorator'; 
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';

@Controller('lotes')
export class LotesController {
  constructor(private readonly lotesService: LotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Protegido por JWT y RolesGuard para asegurar que el Invitado tiene el rol adecuado 
  @Roles('Administrador', 'Instructor', 'Pasante') 
  create(@Body() createLoteDto: CreateLoteDto) {
    return this.lotesService.create(createLoteDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Invitado')
  findAll() {
    return this.lotesService.findAll();
  }

  @Get(':id_lote_pk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Invitado')
  findOne(@Param('id_lote_pk') id_lote_pk: number) {
    return this.lotesService.findOne(+id_lote_pk);
  }

  @Patch(':id_lote_pk')
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('Administrador', 'Instructor', 'Pasante') 
  update(
    @Param('id_lote_pk') id_lote_pk: number,
    @Body() updateLoteDto: UpdateLoteDto,
  ) {
    return this.lotesService.update(+id_lote_pk, updateLoteDto);
  }

  @Delete(':id_lote_pk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante') 
  remove(@Param('id_lote_pk') id_lote_pk: number) {
    return this.lotesService.remove(+id_lote_pk);
  }
}
