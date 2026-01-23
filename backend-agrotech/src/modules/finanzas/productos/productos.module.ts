import { Module } from '@nestjs/common';
import { ProductosService } from './services/productos.service';
import { ProductosController } from './controllers/productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Cultivo } from 'src/modules/cultivo/cultivos/entities/cultivo.entity';
import { ProductosGateway } from './gateways/producto.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Producto,Cultivo])],
  controllers: [ProductosController],
  providers: [ProductosService, ProductosGateway],
  exports: [ProductosService],
})
export class ProductosModule {}


