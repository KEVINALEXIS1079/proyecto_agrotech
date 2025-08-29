import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actividades } from './entities/actividades.entity';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Actividades])],
  controllers: [ActividadesController],
  providers: [ActividadesService],
  exports: [TypeOrmModule], 
})
export class ActividadesModule {}
