import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from './entities/sensor.entity';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';

@Injectable() 
export class SensoresService {
  constructor(
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
  ) {}

  async create(dto: CreateSensorDto): Promise<string> {
    const nuevoSensor = this.sensorRepository.create(dto);
    await this.sensorRepository.save(nuevoSensor);
    return 'Sensor registrado correctamente';
  }

  async findAll(): Promise<Sensor[]> {
    return await this.sensorRepository.find();
  }

  async findOne(id_sensor_pk: number): Promise<Sensor> {
    const sensor = await this.sensorRepository.findOne({
      where: { id_sensor_pk },
      withDeleted: true,
    });
    if (!sensor) throw new Error('Sensor no encontrado');
    return sensor;
  }

  async update(id_sensor_pk: number, dto: UpdateSensorDto): Promise<string> {
    const sensor = await this.sensorRepository.findOneBy({ id_sensor_pk });
    if (!sensor) throw new Error('Sensor no encontrado');

    Object.assign(sensor, dto);
    await this.sensorRepository.save(sensor);
    return 'Sensor actualizado correctamente';
  }

  async remove(id_sensor_pk: number): Promise<string> {
    const result = await this.sensorRepository.softDelete(id_sensor_pk);
    if (result.affected === 0) throw new Error('Sensor no encontrado');
    return 'Sensor eliminado correctamente';
  }

  async restore(id_sensor_pk: number): Promise<string> {
    const result = await this.sensorRepository.restore(id_sensor_pk);
    if (result.affected === 0) throw new Error('Sensor no encontrado');
    return 'Sensor restaurado correctamente';
  }
}