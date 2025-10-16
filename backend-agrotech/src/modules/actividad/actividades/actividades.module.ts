import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actividad } from './entities/actividad.entity';
import { ActividadesService } from './services/actividades.service';
import { ActividadesController } from './controllers/actividades.controller';
import { ActividadesGateway } from './gateways/actividades.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Actividad])],
  controllers: [ActividadesController],
  providers: [ActividadesService, ActividadesGateway],
  exports: [ActividadesService], 
})
export class ActividadesModule {}
