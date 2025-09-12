import { Module } from '@nestjs/common';
import { MovimientoProductoService } from './movimiento-producto.service';
import { MovimientoProductoController } from './movimiento-producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientoProducto } from './entities/movimiento-producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientoProducto])],
  controllers: [MovimientoProductoController],
  providers: [MovimientoProductoService],
  exports: [TypeOrmModule],
})
export class MovimientoProductoModule {}


