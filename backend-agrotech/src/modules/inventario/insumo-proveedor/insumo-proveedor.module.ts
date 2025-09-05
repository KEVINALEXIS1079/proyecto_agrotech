import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsumoProveedor } from './entities/insumo-proveedor.entity';
import { InsumoProveedorService } from './insumo-proveedor.service';
import { InsumoProveedorController } from './insumo-proveedor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InsumoProveedor])],
  controllers: [InsumoProveedorController],
  providers: [InsumoProveedorService],
})
export class InsumoProveedorModule {}
