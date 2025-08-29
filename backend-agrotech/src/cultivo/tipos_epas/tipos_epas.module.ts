import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoEpa } from './entities/tipos_epa.entity';
import { TiposEpasService } from './tipos_epas.service';
import { TiposEpasController } from './tipos_epas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoEpa])],
  controllers: [TiposEpasController],
  providers: [TiposEpasService],
  exports: [TypeOrmModule],
})
export class TiposEpasModule {}