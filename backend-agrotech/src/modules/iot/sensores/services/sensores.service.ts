// src/modules/iot/sensores/services/sensores.service.ts
import { Injectable, NotFoundException, Logger, OnModuleInit, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from '../entities/sensor.entity';
import { CreateSensorDto } from '../dto/create-sensor.dto';
import { UpdateSensorDto } from '../dto/update-sensor.dto';
import { TipoSensor } from '../../tipo-sensor/entities/tipo-sensor.entity';
import { Lote } from 'src/modules/cultivo/lotes/entities/lote.entity';
import { MqttService } from 'src/common/services/mqtt/services/mqtt.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SensoresService implements OnModuleInit {
  private readonly logger = new Logger(SensoresService.name);

  constructor(
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,

    @InjectRepository(TipoSensor)
    private readonly tipoSensorRepository: Repository<TipoSensor>,

    @InjectRepository(Lote)
    private readonly loteRepository: Repository<Lote>,

    @Inject(forwardRef(() => MqttService))
    private readonly mqttService: MqttService,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  async onModuleInit() {
    const sensores = await this.sensorRepository.find({
      where: { activo: true },
      relations: ['tipo_sensor', 'lote'],
    });

    for (const sensor of sensores) {
      this.logger.log(`Conectando sensor activo al MQTT: ${sensor.nombre_sensor}`);
      await this.mqttService.connectSensor({
        id_sensor_pk: sensor.id_sensor_pk,
        broker: sensor.broker_sensor,
        puerto: sensor.puerto_sensor,
        topico: sensor.topico_sensor,
        onMessage: async (valor: number) => {
          const updatedSensor = await this.saveSensorData({ id_sensor_pk: sensor.id_sensor_pk, valor });
          // Emitir evento para el gateway
          this.eventEmitter.emit('sensor.updated', updatedSensor);
        },
      });
    }
  }

  async create(createSensorDto: CreateSensorDto): Promise<Sensor> {
    const { id_lote_fk, id_tipo_sensor_fk, ...rest } = createSensorDto;

    const lote = await this.loteRepository.findOneBy({ id_lote_pk: id_lote_fk });
    if (!lote) throw new NotFoundException('Lote no encontrado');

    const tipoSensor = await this.tipoSensorRepository.findOneBy({ id_tipo_sensor_pk: id_tipo_sensor_fk });
    if (!tipoSensor) throw new NotFoundException('Tipo de sensor no encontrado');

    const sensor = this.sensorRepository.create({
      ...rest,
      lote,
      tipo_sensor: tipoSensor,
    });

    const savedSensor = await this.sensorRepository.save(sensor);

    if (savedSensor.activo) {
      await this.mqttService.connectSensor({
        id_sensor_pk: savedSensor.id_sensor_pk,
        broker: savedSensor.broker_sensor,
        puerto: savedSensor.puerto_sensor,
        topico: savedSensor.topico_sensor,
        onMessage: async (valor: number) => {
          const updatedSensor = await this.saveSensorData({ id_sensor_pk: savedSensor.id_sensor_pk, valor });
          this.eventEmitter.emit('sensor.updated', updatedSensor);
        },
      });
    }

    return savedSensor;
  }

  async findAll(): Promise<Sensor[]> {
    return this.sensorRepository.find({ relations: ['tipo_sensor', 'lote'] });
  }

  async findOne(id: number): Promise<Sensor> {
    const sensor = await this.sensorRepository.findOne({
      where: { id_sensor_pk: id },
      relations: ['tipo_sensor', 'lote'],
    });
    if (!sensor) throw new NotFoundException('Sensor no encontrado');
    return sensor;
  }

  async update(id: number, updateSensorDto: UpdateSensorDto): Promise<Sensor> {
    const sensor = await this.findOne(id);

    if (updateSensorDto.id_lote_fk) {
      const lote = await this.loteRepository.findOneBy({ id_lote_pk: updateSensorDto.id_lote_fk });
      if (!lote) throw new NotFoundException('Lote no encontrado');
      sensor.lote = lote;
    }

    if (updateSensorDto.id_tipo_sensor_fk) {
      const tipoSensor = await this.tipoSensorRepository.findOneBy({ id_tipo_sensor_pk: updateSensorDto.id_tipo_sensor_fk });
      if (!tipoSensor) throw new NotFoundException('Tipo de sensor no encontrado');
      sensor.tipo_sensor = tipoSensor;
    }

    Object.assign(sensor, updateSensorDto);

    const updatedSensor = await this.sensorRepository.save(sensor);

    if (updatedSensor.activo) {
      await this.mqttService.connectSensor({
        id_sensor_pk: updatedSensor.id_sensor_pk,
        broker: updatedSensor.broker_sensor,
        puerto: updatedSensor.puerto_sensor,
        topico: updatedSensor.topico_sensor,
        onMessage: async (valor: number) => {
          const s = await this.saveSensorData({ id_sensor_pk: updatedSensor.id_sensor_pk, valor });
          this.eventEmitter.emit('sensor.updated', s);
        },
      });
    } else {
      await this.mqttService.disconnectSensor(updatedSensor.id_sensor_pk);
    }

    return updatedSensor;
  }

  async remove(id: number): Promise<void> {
    const sensor = await this.findOne(id);
    await this.mqttService.disconnectSensor(sensor.id_sensor_pk);
    await this.sensorRepository.softRemove(sensor);
  }

  async restore(id: number): Promise<Sensor> {
    const sensor = await this.sensorRepository.findOne({
      where: { id_sensor_pk: id },
      withDeleted: true,
      relations: ['tipo_sensor', 'lote'],
    });
    if (!sensor) throw new NotFoundException('Sensor no encontrado para restaurar');

    await this.sensorRepository.recover(sensor);

    if (sensor.activo) {
      await this.mqttService.connectSensor({
        id_sensor_pk: sensor.id_sensor_pk,
        broker: sensor.broker_sensor,
        puerto: sensor.puerto_sensor,
        topico: sensor.topico_sensor,
        onMessage: async (valor: number) => {
          const s = await this.saveSensorData({ id_sensor_pk: sensor.id_sensor_pk, valor });
          this.eventEmitter.emit('sensor.updated', s);
        },
      });
    }

    return sensor;
  }

  async findAllDeleted(): Promise<Sensor[]> {
    return this.sensorRepository.createQueryBuilder('sensor')
      .withDeleted()
      .leftJoinAndSelect('sensor.tipo_sensor', 'tipo_sensor')
      .leftJoinAndSelect('sensor.lote', 'lote')
      .where('sensor.deletedAt IS NOT NULL')
      .getMany();
  }

  async saveSensorData({ id_sensor_pk, valor }: { id_sensor_pk: number; valor: number }) {
    const sensor = await this.findOne(id_sensor_pk);
    if (!sensor) throw new NotFoundException('Sensor no encontrado');

    sensor.ultimo_valor = valor;
    sensor.ultima_medicion = new Date();

    return this.sensorRepository.save(sensor);
  }
}
