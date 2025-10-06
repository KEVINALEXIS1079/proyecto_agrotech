import { Module } from '@nestjs/common';
import { ProductosService } from '../service/productos.service';
import { ProductosController } from '../controller/productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from '../entities/producto.entity';
import { Cultivo } from 'src/modules/cultivo/cultivos/entities/cultivo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto,Cultivo])],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [TypeOrmModule],
})
export class ProductosModule {}


