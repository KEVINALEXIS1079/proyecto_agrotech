import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultivosService } from './services/cultivos.service';
import { CultivosController } from './controllers/cultivos.controller';
import { Cultivo } from './entities/cultivo.entity';
import { Sublote } from '../sublotes/entities/sublote.entity';
import { TipoCultivo } from '../tipo-cultivo/entities/tipo-cultivo.entity';
import { CultivosGateway } from './gateways/cultivos.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cultivo, Sublote, TipoCultivo]),
  ],
  controllers: [CultivosController],
  providers: [CultivosService, CultivosGateway],
  exports: [CultivosService],
})
export class CultivosModule {}
