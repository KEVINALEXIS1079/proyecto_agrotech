import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoSensor } from './entities/tipo_sensor.entity';
import { CreateTipoSensorDto } from './dto/create-tipo_sensor.dto';
import { UpdateTipoSensorDto } from './dto/update-tipo_sensor.dto';

@Injectable()
export class TipoSensorService {
  constructor(
    @InjectRepository(TipoSensor)
    private readonly tipoSensorRepository: Repository<TipoSensor>,
  ){}

  async create(dto: CreateTipoSensorDto): Promise<string> {
    const nuevoTipoSensor = this.tipoSensorRepository.create(dto);
    await this.tipoSensorRepository.save(nuevoTipoSensor);
    return 'Tipo de sensor registrado correctamente';
  }

  async findAll(): Promise<TipoSensor[]> {
    return await this.tipoSensorRepository.find();
  }

  async findOne(id_tipo_sensor_pk: number): Promise<TipoSensor> {
    const tipoSensor = await this.tipoSensorRepository.findOne({
      where: { id_tipo_sensor_pk },
      withDeleted: true,
    });
    if (!tipoSensor) throw new Error('Tipo de sensor no encontrado');
    return tipoSensor;
  }

  async update(id_tipo_sensor_pk: number, dto: UpdateTipoSensorDto): Promise<string> {
    const tipoSensor = await this.tipoSensorRepository.findOneBy({ id_tipo_sensor_pk });
    if (!tipoSensor) throw new Error('Tipo de sensor no encontrado');

    Object.assign(tipoSensor, dto);
    await this.tipoSensorRepository.save(tipoSensor);
    return 'Tipo de sensor actualizado correctamente';
  }

  async remove(id_tipo_sensor_pk: number): Promise<string> {
    const result = await this.tipoSensorRepository.softDelete(id_tipo_sensor_pk);
    if (result.affected === 0) throw new Error('Tipo de sensor no encontrado');
    return 'Tipo de sensor eliminado correctamente';
  }

  async restore(id_tipo_sensor_pk: number): Promise<string> {
    const result = await this.tipoSensorRepository.restore(id_tipo_sensor_pk);
    if (result.affected === 0) throw new Error('Tipo de sensor no encontrado');
    return 'Tipo de sensor restaurado correctamente';
  }
}