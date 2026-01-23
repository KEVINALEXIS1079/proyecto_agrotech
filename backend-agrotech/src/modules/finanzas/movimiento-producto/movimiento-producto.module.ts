import { Module } from '@nestjs/common';
import { MovimientoProductoService } from './services/movimiento-producto.service';
import { MovimientoProductoController } from './controllers/movimiento-producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientoProducto } from './entities/movimiento-producto.entity';
import { MovimientoProductoGateway } from './gateways/movimiento-producto.gateway.';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientoProducto])],
  controllers: [MovimientoProductoController],
  providers: [MovimientoProductoService, MovimientoProductoGateway],
  exports: [MovimientoProductoService],
})
export class MovimientoProductoModule {}


