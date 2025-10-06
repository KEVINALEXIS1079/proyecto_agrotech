import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoEpa } from '../entities/tipo-epa.entity';
import { TipoEpaService } from '../service/tipo-epa.service';
import { TipoEpaController } from '../controller/tipo-epa.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoEpa])],
  controllers: [TipoEpaController],
  providers: [TipoEpaService],
  exports: [TypeOrmModule],
})
export class TiposEpasModule {}