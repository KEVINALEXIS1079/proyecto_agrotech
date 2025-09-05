import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SublotesService } from './sublotes.service';
import { CreateSubloteDto } from './dto/create-sublote.dto';
import { UpdateSubloteDto } from './dto/update-sublote.dto';
import { Roles } from 'src/common/middleware/permisos/roles.decorator';
import { JwtAuthGuard } from 'src/modules/authentication/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/middleware/permisos/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('sublotes')
export class SublotesController {
  constructor(private readonly sublotesService: SublotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('Administrador', 'Instructor', 'Pasante')
  create(@Body() createSubloteDto: CreateSubloteDto) {
    return this.sublotesService.create(createSubloteDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz', 'Usuario')
  findAll() {
    return this.sublotesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz', 'Usuario')
  findOne(@Param('id') id: string) {
    return this.sublotesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  update(@Param('id') id: string, @Body() updateSubloteDto: UpdateSubloteDto) {
    return this.sublotesService.update(+id, updateSubloteDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  remove(@Param('id') id: string) {
    return this.sublotesService.remove(+id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  restore(@Param('id') id: string) {
    return this.sublotesService.restore(+id);
  }
}
