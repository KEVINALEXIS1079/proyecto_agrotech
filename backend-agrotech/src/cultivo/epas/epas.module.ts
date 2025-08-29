import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpasService } from './epas.service';
import { EpasController } from './epas.controller';
import { Epa } from './entities/epa.entity';
import { TiposEpasModule } from 'src/cultivo/tipos_epas/tipos_epas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Epa]),
    TiposEpasModule,
  ],
  controllers: [EpasController],
  providers: [EpasService],
})
export class EpasModule {}