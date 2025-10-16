import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoEpa } from './entities/tipo-epa.entity';
import { TipoEpaService } from './services/tipo-epa.service';
import { TipoEpaController } from './controllers/tipo-epa.controller';
import { TipoEpaGateway } from './gateways/tipo-epa.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([TipoEpa])],
  controllers: [TipoEpaController],
  providers: [TipoEpaService, TipoEpaGateway],
  exports: [TipoEpaService],
})
export class TiposEpasModule {}