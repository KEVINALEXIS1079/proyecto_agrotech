import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsumoProveedor } from './entities/insumo-proveedor.entity';
import { InsumoProveedorService } from './insumo-proveedor.service';
import { InsumoProveedorController } from './insumo-proveedor.controller';
import { Insumo } from 'src/modules/inventario/insumos/entities/insumo.entity';
import { Proveedor } from '../proveedores/entities/proveedores.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InsumoProveedor, Insumo, Proveedor]),
  ],
  controllers: [InsumoProveedorController],
  providers: [InsumoProveedorService],
  exports: [InsumoProveedorService], 
})
export class InsumoProveedorModule {}
