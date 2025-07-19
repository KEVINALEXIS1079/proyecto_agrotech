import { Module } from '@nestjs/common';
import { ProductoService } from './productos.service';
import { ProductoController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto])],
  controllers: [ProductoController],
  providers: [ProductoService],
})
export class ProductoModule {}