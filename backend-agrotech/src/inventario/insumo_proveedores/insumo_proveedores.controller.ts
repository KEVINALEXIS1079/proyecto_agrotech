import {Controller,Get,Post,Body,Patch,Param,Delete,ParseIntPipe,} from '@nestjs/common';
import { InsumosProveedoresService } from './insumo_proveedores.service';
import { CreateInsumosProveedoresDto } from './dto/create-insumo_proveedor.dto';
import { UpdateInsumosProveedoresDto } from './dto/update-insumo_proveedor.dto';
import { Roles } from 'src/autentication/permisos/roles.decorator'; 
import { JwtAuthGuard } from 'src/autentication/auth/jwt-auth.guard';
import { RolesGuard } from 'src/autentication/permisos/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('insumos_proveedores')
export class InsumosProveedoresController {
  constructor(private readonly insumosProveedoresService: InsumosProveedoresService) {}

  // Crear un nuevo insumo_proveedor
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Protegido por JWT y RolesGuard para asegurar que el usuario tiene el rol adecuado
  @Roles('Administrador', 'Instructor', 'Pasante')
  create(@Body() createInsumosProveedoresDto: CreateInsumosProveedoresDto) {
    return this.insumosProveedoresService.create(createInsumosProveedoresDto);
  }

  // Listar todos los insumos_proveedores
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Usuario')
  findAll() {
    return this.insumosProveedoresService.findAll();
  }

  // Buscar insumo_proveedor por ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Usuario')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.insumosProveedoresService.findOne(id);
  }

  // Actualizar insumo_proveedor por ID
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInsumosProveedoresDto: UpdateInsumosProveedoresDto,
  ) {
    return this.insumosProveedoresService.update(id, updateInsumosProveedoresDto);
  }

  // Eliminar insumo_proveedor por ID
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.insumosProveedoresService.remove(id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.insumosProveedoresService.restore(id);
  }
}
