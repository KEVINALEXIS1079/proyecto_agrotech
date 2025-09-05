import {Controller,Get,Post,Body,Patch,Param,Delete,ParseIntPipe,} from '@nestjs/common';
import { InsumoProveedorService } from './insumo-proveedor.service';
import { CreateInsumoProveedorDto } from './dto/create-insumo-proveedor.dto';
import { UpdateInsumoProveedorDto } from './dto/update-insumo-proveedor.dto';
import { Roles } from 'src/common/middleware/permisos/roles.decorator'; 
import { JwtAuthGuard } from 'src/modules/authentication/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/middleware/permisos/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('insumo-proveedor')
export class InsumoProveedorController {
  constructor(private readonly insumosProveedoresService: InsumoProveedorService) {}

  // Crear un nuevo insumo_proveedor
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Protegido por JWT y RolesGuard para asegurar que el usuario tiene el rol adecuado
  @Roles('Administrador', 'Instructor', 'Pasante')
  create(@Body() createInsumosProveedoresDto: CreateInsumoProveedorDto) {
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
    @Body() updateInsumosProveedoresDto: UpdateInsumoProveedorDto,
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
