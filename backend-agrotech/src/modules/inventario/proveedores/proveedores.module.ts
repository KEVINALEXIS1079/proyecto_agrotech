import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proveedor } from './entities/proveedores.entity';
import { ProveedoresService } from './services/proveedores.service';
import { ProveedoresController } from './controllers/proveedores.controller';
import { ProveedoresGateway } from './gateways/proveedor.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Proveedor])],
  controllers: [ProveedoresController],
  providers: [ProveedoresService, ProveedoresGateway],
  exports: [ProveedoresService],
})
export class ProveedoresModule {}
