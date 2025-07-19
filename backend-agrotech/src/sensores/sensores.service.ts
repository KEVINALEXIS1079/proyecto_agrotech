import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from './entities/sensores.entity';
import { CreateSensorDto } from './dto/create-sensores.dto';
import { UpdateSensorDto } from './dto/update-sensores.dto';

@Injectable()
export class SensoresService {
  constructor(
    @InjectRepository(Sensor)
    private readonly sensoresRepo: Repository<Sensor>,
  ) {}

  findAll() {
    return this.sensoresRepo.find({ relations: ['tipoSensor'] });
  }

  findOne(id: number) {
    return this.sensoresRepo.findOne({ where: { id }, relations: ['tipoSensor'] });
  }

  create(dto: CreateSensorDto) {
    const nuevo = this.sensoresRepo.create(dto);
    return this.sensoresRepo.save(nuevo);
  }

  async update(id: number, dto: UpdateSensorDto) {
    await this.sensoresRepo.update(id, dto);
    return this.findOne(id);
  }

  delete(id: number) {
    return this.sensoresRepo.delete(id);
  }
}
