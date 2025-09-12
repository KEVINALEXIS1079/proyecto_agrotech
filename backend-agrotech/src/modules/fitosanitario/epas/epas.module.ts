import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpasService } from './epas.service';
import { EpasController } from './epas.controller';
import { Epa } from './entities/epa.entity';
import { TipoEpa } from 'src/modules/fitosanitario/tipo-epa/entities/tipo-epa.entity';
import { Cultivo } from 'src/modules/cultivo/cultivos/entities/cultivo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Epa, TipoEpa, Cultivo]) 
  ],
  controllers: [EpasController],
  providers: [EpasService],
})
export class EpasModule {}
