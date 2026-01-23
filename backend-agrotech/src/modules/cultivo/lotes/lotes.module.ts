import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lote } from './entities/lote.entity';
import { LotesService } from './services/lotes.service';
import { LotesGateway } from './gateways/lotes.gateway';
import { LotesController } from './controllers/lotes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Lote])],
  controllers: [LotesController], 
  providers: [LotesService, LotesGateway],
  exports: [LotesService],
})
export class LotesModule {}
