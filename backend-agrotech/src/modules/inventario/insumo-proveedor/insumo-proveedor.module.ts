import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsumoProveedor } from './entities/insumo-proveedor.entity';
import { InsumoProveedorService } from './services/insumo-proveedor.service';
import { InsumoProveedorController } from './controllers/insumo-proveedor.controller';
import { Insumo } from 'src/modules/inventario/insumos/entities/insumo.entity';
import { Proveedor } from '../proveedores/entities/proveedores.entity';
import { InsumoProveedorGateway } from './gateways/insumo-proveedor';

@Module({
  imports: [
    TypeOrmModule.forFeature([InsumoProveedor, Insumo, Proveedor]),
  ],
  controllers: [InsumoProveedorController],
  providers: [InsumoProveedorService, InsumoProveedorGateway],
  exports: [InsumoProveedorService], 
})
export class InsumoProveedorModule {}
