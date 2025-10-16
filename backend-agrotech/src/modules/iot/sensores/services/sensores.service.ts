import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from '../entities/sensor.entity';
import { CreateSensorDto } from '../dto/create-sensor.dto';
import { UpdateSensorDto } from '../dto/update-sensor.dto';
import { Cultivo } from 'src/modules/cultivo/cultivos/entities/cultivo.entity';
import { TipoSensor } from '../../tipo-sensor/entities/tipo-sensor.entity';

@Injectable()
export class SensoresService {
  constructor(
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,

    @InjectRepository(Cultivo)
    private readonly cultivoRepository: Repository<Cultivo>,

    @InjectRepository(TipoSensor)
    private readonly tipoSensorRepository: Repository<TipoSensor>,
  ) {}

  async create(createSensorDto: CreateSensorDto): Promise<string> {
    const cultivo = await this.cultivoRepository.findOneBy({ id_cultivo_pk: createSensorDto.id_cultivo_fk });
    if (!cultivo) throw new NotFoundException('Cultivo no encontrado');

    const tipo_sensor = await this.tipoSensorRepository.findOneBy({ id_tipo_sensor_pk: createSensorDto.id_tipo_sensor_fk });
    if (!tipo_sensor) throw new NotFoundException('Tipo de sensor no encontrado');

    const existeNombre = await this.sensorRepository.findOne({
      where: { nombre_sensor: createSensorDto.nombre_sensor }
    });
    if (existeNombre) {
      throw new BadRequestException(`El nombre del sensor ya existe`);
    }

    const nuevoSensor = this.sensorRepository.create({
      ...createSensorDto,
      cultivo,
      tipo_sensor,
    });

    await this.sensorRepository.save(nuevoSensor);
    return `Sensor '${createSensorDto.nombre_sensor}' registrado correctamente`;
  }

  async findAll(): Promise<Sensor[]> {
    const sensores = await this.sensorRepository.find({
      relations: ['cultivo', 'tipo_sensor'],
      withDeleted: true,
    });
    if (!sensores || sensores.length === 0) throw new NotFoundException('No se encontraron sensores registrados');
    return sensores;
  }

  async findOne(id_sensor_pk: number): Promise<Sensor> {
    const sensor = await this.sensorRepository.findOne({
      where: { id_sensor_pk },
      relations: ['cultivo', 'tipo_sensor'],
      withDeleted: true,
    });
    if (!sensor) throw new NotFoundException(`Sensor con ID ${id_sensor_pk} no encontrado`);
    return sensor;
  }

  async update(id_sensor_pk: number, dto: UpdateSensorDto): Promise<string> {
    const sensor = await this.sensorRepository.findOneBy({ id_sensor_pk });
    if (!sensor) throw new NotFoundException(`Sensor con ID ${id_sensor_pk} no encontrado`);

    if (dto.id_cultivo_fk) {
      const cultivo = await this.cultivoRepository.findOneBy({ id_cultivo_pk: dto.id_cultivo_fk });
      if (!cultivo) throw new NotFoundException('Cultivo no encontrado');
      sensor.cultivo = cultivo;
    }

    if (dto.id_tipo_sensor_fk) {
      const tipo_sensor = await this.tipoSensorRepository.findOneBy({ id_tipo_sensor_pk: dto.id_tipo_sensor_fk });
      if (!tipo_sensor) throw new NotFoundException('Tipo de sensor no encontrado');
      sensor.tipo_sensor = tipo_sensor;
    }

    // Validar nombre único si viene en el DTO
    if (dto.nombre_sensor && dto.nombre_sensor !== sensor.nombre_sensor) {
      const existeNombre = await this.sensorRepository.findOne({
        where: { nombre_sensor: dto.nombre_sensor }
      });
      if (existeNombre) {
        throw new BadRequestException(`El nombre del sensor '${dto.nombre_sensor}' ya existe`);
      }
    }

    Object.assign(sensor, dto);
    await this.sensorRepository.save(sensor);
    return `Sensor con ID ${id_sensor_pk} actualizado correctamente`;
  }

  async remove(id_sensor_pk: number): Promise<string> {
    const result = await this.sensorRepository.softDelete(id_sensor_pk);
    if (result.affected === 0) throw new NotFoundException(`Sensor con ID ${id_sensor_pk} no encontrado`);
    return `Sensor con ID ${id_sensor_pk} eliminado correctamente`;
  }

  async restore(id_sensor_pk: number): Promise<string> {
    const result = await this.sensorRepository.restore(id_sensor_pk);
    if (result.affected === 0) throw new NotFoundException(`Sensor con ID ${id_sensor_pk} no encontrado`);
    return `Sensor con ID ${id_sensor_pk} restaurado correctamente`;
  }
}
