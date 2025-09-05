import {Controller,Get,Post,Body,Patch,Param,Delete,UseGuards,} from '@nestjs/common';
import { LotesService } from './lotes.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { Roles } from 'src/common/middleware/permisos/roles.decorator'; 
import { JwtAuthGuard } from 'src/modules/authentication/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/middleware/permisos/roles.guard';

@Controller('lotes')
export class LotesController {
  constructor(private readonly lotesService: LotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Protegido por JWT y RolesGuard para asegurar que el usuario tiene el rol adecuado 
  @Roles('Administrador', 'Instructor', 'Pasante') 
  create(@Body() createLoteDto: CreateLoteDto) {
    return this.lotesService.create(createLoteDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Usuario')
  findAll() {
    return this.lotesService.findAll();
  }

  @Get(':id_lote_pk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Usuario')
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
