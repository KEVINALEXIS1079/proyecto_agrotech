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
    private readonly tipoSensorRepo: Repository<TipoSensor>,
  ) {}

  findAll() {
    return this.tipoSensorRepo.find();
  }

  findOne(id: number) {
    return this.tipoSensorRepo.findOneBy({ id });
  }

  create(data: CreateTipoSensorDto) {
    const nuevo = this.tipoSensorRepo.create(data);
    return this.tipoSensorRepo.save(nuevo);
  }

  async update(id: number, data: UpdateTipoSensorDto) {
    await this.tipoSensorRepo.update(id, data);
    return this.findOne(id);
  }

  delete(id: number) {
    return this.tipoSensorRepo.delete(id);
  }
}
