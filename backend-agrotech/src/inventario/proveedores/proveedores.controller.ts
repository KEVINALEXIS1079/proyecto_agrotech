import {Controller,Get,Post,Body,Patch,Param,Delete,ParseIntPipe} from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { CreateProveedoresDto } from './dto/create-proveedores.dto';
import { UpdateProveedoresDto } from './dto/update-proveedores.dto';
import { Roles } from 'src/autentication/permisos/roles.decorator';
import { JwtAuthGuard } from 'src/autentication/auth/jwt-auth.guard';
import { RolesGuard } from 'src/autentication/permisos/roles.guard';
import { UseGuards } from '@nestjs/common';


@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  // Crear un nuevo proveedor
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Protegido por JWT y RolesGuard para asegurar que el usuario tiene el rol adecuado 
  @Roles('Administrador', 'Instructor', 'Pasante')
  create(@Body() createProveedoresDto: CreateProveedoresDto) {
    return this.proveedoresService.create(createProveedoresDto);
  }

  // Listar todos los proveedores
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz', 'Usuario')
  findAll() {
    return this.proveedoresService.findAll();
  }

  // Buscar proveedor por ID
  @Get(':id_proveedor_pk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz', 'Usuario')
  findOne(@Param('id_proveedor_pk', ParseIntPipe) id_proveedor_pk: number) {
    return this.proveedoresService.findOne(id_proveedor_pk);
  }

  // Actualizar proveedor por ID
  @Patch(':id_proveedor_pk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  update(@Param('id_proveedor_pk', ParseIntPipe) id_proveedor_pk: number,
    @Body() updateProveedoresDto: UpdateProveedoresDto,
  ) {
    return this.proveedoresService.update(id_proveedor_pk, updateProveedoresDto);
  }

  // Eliminar proveedor por ID
  @Delete(':id_proveedor_pk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  remove(@Param('id_proveedor_pk', ParseIntPipe) id_proveedor_pk: number) {
    return this.proveedoresService.remove(id_proveedor_pk);
  }

  // Restaurar proveedor por ID
  @Patch('restore/:id_proveedor_pk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  restore(@Param('id_proveedor_pk', ParseIntPipe) id_proveedor_pk: number) {
    return this.proveedoresService.restore(id_proveedor_pk);
  }
}
