import { Module } from '@nestjs/common';
import { EvidenciasService } from './services/evidencias.service';
import { EvidenciasController } from './controllers/evidencias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evidencia } from './entities/evidencia.entity';
import { EvidenciasGateway } from './gateways/evidencia.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Evidencia,])],
  controllers: [EvidenciasController],
  providers: [EvidenciasService, EvidenciasGateway],
  exports: [EvidenciasService]
})
export class EvidenciasModule {}
