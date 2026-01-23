import { Module } from '@nestjs/common';
import { TipoCultivoService } from './services/tipo-cultivo.service';
import { TipoCultivoController } from './controllers/tipo-cultivo.controller';
import { TipoCultivo } from './entities/tipo-cultivo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCultivoGateway } from './gateways/tipo-cultivo.gateway';

@Module({
  imports:[TypeOrmModule.forFeature([TipoCultivo])],
  controllers: [TipoCultivoController],
  providers: [TipoCultivoService, TipoCultivoGateway],
  exports: [TipoCultivoService]
})
export class TipoCultivoModule {}
