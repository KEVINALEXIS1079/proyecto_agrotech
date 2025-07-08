import { Injectable } from '@nestjs/common';
import { CreateTipoCultivoDto } from './dto/create-tipo-cultivo.dto';
import { UpdateTipoCultivoDto } from './dto/update-tipo-cultivo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { TipoCultivo } from './entities/tipo-cultivo.entity';

@Injectable()
export class TipoCultivoService {
  constructor(
    @InjectRepository(TipoCultivo)
    private readonly tipoCultivoRepository: Repository<TipoCultivo>,
  ) {}

  async create(dto: CreateTipoCultivoDto) {
    const tipoCultivo = this.tipoCultivoRepository.create(dto);
    return await this.tipoCultivoRepository.save(tipoCultivo);
  }

  async findAll() {
    return await this.tipoCultivoRepository.find();
  }

  async findOne(id_tipo_cultivo_pk: number) {
    return await this.tipoCultivoRepository.findOneBy({ id_tipo_cultivo_pk });
  }

  async update(id_tipo_cultivo_pk: number, dto: UpdateTipoCultivoDto) {
    return await this.tipoCultivoRepository.update(id_tipo_cultivo_pk, dto);
  }

  async remove(id_tipo_cultivo_pk: number) {
    return await this.tipoCultivoRepository.softDelete({ id_tipo_cultivo_pk }); //se le pasa el id
    // return await this.tipoCultivoRepository.softRemove({id_tipo_cultivo_pk})  // se le pasa la instancia
  }

  //resturar los datos eliminados
    async restore(id_tipo_cultivo_pk: number): Promise<UpdateResult> {
      return this.tipoCultivoRepository.restore({ id_tipo_cultivo_pk });
    }
}
