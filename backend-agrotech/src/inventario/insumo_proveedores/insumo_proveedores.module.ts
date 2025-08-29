import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsumosProveedores } from './entities/insumo_proveedores.entity';
import { InsumosProveedoresService } from './insumo_proveedores.service';
import { InsumosProveedoresController } from './insumo_proveedores.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InsumosProveedores])],
  controllers: [InsumosProveedoresController],
  providers: [InsumosProveedoresService],
})
export class InsumosProveedoresModule {}
