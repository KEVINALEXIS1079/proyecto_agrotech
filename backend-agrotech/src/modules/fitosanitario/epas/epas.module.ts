import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpasService } from '../epas/services/epas.service';
import { EpasController } from './controllers/epas.controller';
import { Epa } from './entities/epa.entity';
import { TipoEpa } from 'src/modules/fitosanitario/tipo-epa/entities/tipo-epa.entity';
import { Cultivo } from 'src/modules/cultivo/cultivos/entities/cultivo.entity';
import { EpasGateway } from './gateways/epa.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Epa, TipoEpa, Cultivo]) 
  ],
  controllers: [EpasController],
  providers: [EpasService, EpasGateway],
  exports: [EpasService]
})
export class EpasModule {}
