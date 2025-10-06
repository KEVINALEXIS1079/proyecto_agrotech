import { Module } from '@nestjs/common';
import { MovimientoProductoService } from '../service/movimiento-producto.service';
import { MovimientoProductoController } from '../controller/movimiento-producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientoProducto } from '../entities/movimiento-producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientoProducto])],
  controllers: [MovimientoProductoController],
  providers: [MovimientoProductoService],
  exports: [TypeOrmModule],
})
export class MovimientoProductoModule {}


