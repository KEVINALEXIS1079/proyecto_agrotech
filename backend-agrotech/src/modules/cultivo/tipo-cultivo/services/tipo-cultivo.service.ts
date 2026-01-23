import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTipoCultivoDto } from '../dto/create-tipo-cultivo.dto';
import { UpdateTipoCultivoDto } from '../dto/update-tipo-cultivo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoCultivo } from '../entities/tipo-cultivo.entity';

@Injectable()
export class TipoCultivoService {
  constructor(
    @InjectRepository(TipoCultivo)
    private readonly tipoCultivoRepository: Repository<TipoCultivo>,
  ) {}

  async create(createTipoCultivoDto : CreateTipoCultivoDto): Promise<string> {
    const tipoCultivo = this.tipoCultivoRepository.create(createTipoCultivoDto );

    const existeNombre= await this.tipoCultivoRepository.findOne({
      where: { nombre_tipo_cultivo: createTipoCultivoDto .nombre_tipo_cultivo}
    })
    if (existeNombre) {
      throw new BadRequestException(
        `El Tipo cultivo ya existe`
      )
    }
    try {
      await this.tipoCultivoRepository.save(tipoCultivo);
      return `Tipo Cultivo registrado correctamente`;
    } catch (error: any) {
      throw new BadRequestException(`Error al crear TipoCultivo: ${error.message}`);
    }
  }

  async findAll(): Promise<TipoCultivo[]> {
    const tipos = await this.tipoCultivoRepository.find();
    if (!tipos || tipos.length === 0) throw new NotFoundException('No se encontraron TipoCultivo registrados');
    return tipos;
  }

  async findOne(id_tipo_cultivo_pk: number): Promise<TipoCultivo> {
    const tipo = await this.tipoCultivoRepository.findOneBy({ id_tipo_cultivo_pk });
    if (!tipo) throw new NotFoundException(`TipoCultivo con ID ${id_tipo_cultivo_pk} no encontrado`);
    return tipo;
  }

  async update(id_tipo_cultivo_pk: number, updateTipoCultivoDto: UpdateTipoCultivoDto): Promise<string> {
    const tipo = await this.tipoCultivoRepository.findOneBy({ id_tipo_cultivo_pk });
    if (!tipo) throw new NotFoundException(`TipoCultivo con ID ${id_tipo_cultivo_pk} no encontrado`);

    Object.assign(tipo, updateTipoCultivoDto);

    try {
      await this.tipoCultivoRepository.save(tipo);
      return `TipoCultivo con ID ${id_tipo_cultivo_pk} actualizado correctamente`;
    } catch (error: any) {
      throw new BadRequestException(`Error al actualizar TipoCultivo: ${error.message}`);
    }
  }

  async remove(id_tipo_cultivo_pk: number): Promise<string> {
    const result = await this.tipoCultivoRepository.softDelete({ id_tipo_cultivo_pk });
    if (result.affected === 0) throw new NotFoundException(`TipoCultivo con ID ${id_tipo_cultivo_pk} no encontrado`);
    return `TipoCultivo con ID ${id_tipo_cultivo_pk} eliminado correctamente`;
  }

  async restore(id_tipo_cultivo_pk: number): Promise<string> {
    const result = await this.tipoCultivoRepository.restore({ id_tipo_cultivo_pk });
    if (result.affected === 0) throw new NotFoundException(`TipoCultivo con ID ${id_tipo_cultivo_pk} no encontrado`);
    return `TipoCultivo con ID ${id_tipo_cultivo_pk} restaurado correctamente`;
  }
}
