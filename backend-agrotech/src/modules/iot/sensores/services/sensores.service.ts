// src/modules/iot/sensores/services/sensores.service.ts
import {
  Injectable,
  NotFoundException,
  Logger,
  OnModuleInit,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Sensor } from '../entities/sensor.entity';
import { CreateSensorDto } from '../dto/create-sensor.dto';
import { UpdateSensorDto } from '../dto/update-sensor.dto';
import { TipoSensor } from '../../tipo-sensor/entities/tipo-sensor.entity';
import { Lote } from 'src/modules/cultivo/lotes/entities/lote.entity';
import { MqttService } from 'src/common/services/protocols/services/mqtt.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SensorLectura } from '../entities/sensorLectura.entity';

@Injectable()
export class SensoresService implements OnModuleInit {
  private readonly logger = new Logger(SensoresService.name);

  constructor(
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,

    @InjectRepository(SensorLectura)
    private readonly lecturaRepository: Repository<SensorLectura>,

    @InjectRepository(TipoSensor)
    private readonly tipoSensorRepository: Repository<TipoSensor>,

    @InjectRepository(Lote)
    private readonly loteRepository: Repository<Lote>,

    @Inject(forwardRef(() => MqttService))
    private readonly mqttService: MqttService,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ===============================
  // Al iniciar el módulo, reconecta sensores activos
  // ===============================
  async onModuleInit() {
    const sensores = await this.sensorRepository.find({
      where: { activo: true },
      relations: ['tipo_sensor', 'lote'],
    });

    for (const sensor of sensores) {
      this.logger.log(`Conectando sensor activo al MQTT: ${sensor.nombre_sensor}`);

      this.mqttService
        .connectSensor({
          id_sensor_pk: sensor.id_sensor_pk,
          broker: sensor.broker_sensor,
          puerto: sensor.puerto_sensor,
          topico: sensor.topico_sensor,
          onMessage: async (valor: number) => {
            const updated = await this.saveSensorData({
              id_sensor_pk: sensor.id_sensor_pk,
              valor,
            });
            this.eventEmitter.emit('sensor.updated', updated);
          },
        })
        .catch((err) =>
          this.logger.error(
            `No se pudo conectar sensor ${sensor.id_sensor_pk}: ${(err as Error).message}`,
          ),
        );
    }
  }

  // ===============================
  // Crear sensor nuevo
  // ===============================
  async create(createSensorDto: CreateSensorDto): Promise<Sensor> {
    const { id_lote_fk, id_tipo_sensor_fk, ...rest } = createSensorDto;

    const lote = await this.loteRepository.findOneBy({ id_lote_pk: id_lote_fk });
    if (!lote) throw new NotFoundException('Lote no encontrado');

    const tipoSensor = await this.tipoSensorRepository.findOneBy({
      id_tipo_sensor_pk: id_tipo_sensor_fk,
    });
    if (!tipoSensor) throw new NotFoundException('Tipo de sensor no encontrado');

    const sensor = this.sensorRepository.create({
      ...rest,
      lote,
      tipo_sensor: tipoSensor,
    });

    const savedSensor = await this.sensorRepository.save(sensor);

    // Conexión MQTT si está activo
    if (savedSensor.activo) {
      await this.mqttService.connectSensor({
        id_sensor_pk: savedSensor.id_sensor_pk,
        broker: savedSensor.broker_sensor,
        puerto: savedSensor.puerto_sensor,
        topico: savedSensor.topico_sensor,
        onMessage: async (valor: number) => {
          const updatedSensor = await this.saveSensorData({
            id_sensor_pk: savedSensor.id_sensor_pk,
            valor,
          });
          this.eventEmitter.emit('sensor.updated', updatedSensor);
        },
      });
    }

    return savedSensor;
  }

  // ===============================
  // Obtener todos los sensores
  // ===============================
  async findAll(): Promise<Sensor[]> {
    return this.sensorRepository.find({ relations: ['tipo_sensor', 'lote'] });
  }

  // ===============================
  // Obtener sensor por ID
  // ===============================
  async findOne(id: number): Promise<Sensor> {
    const sensor = await this.sensorRepository.findOne({
      where: { id_sensor_pk: id },
      relations: ['tipo_sensor', 'lote'],
    });
    if (!sensor) throw new NotFoundException('Sensor no encontrado');
    return sensor;
  }

  // ===============================
  // Actualizar sensor existente
  // ===============================
  async update(id: number, updateSensorDto: UpdateSensorDto): Promise<Sensor> {
    const sensor = await this.findOne(id);

    if (updateSensorDto.id_lote_fk) {
      const lote = await this.loteRepository.findOneBy({
        id_lote_pk: updateSensorDto.id_lote_fk,
      });
      if (!lote) throw new NotFoundException('Lote no encontrado');
      sensor.lote = lote;
    }

    if (updateSensorDto.id_tipo_sensor_fk) {
      const tipoSensor = await this.tipoSensorRepository.findOneBy({
        id_tipo_sensor_pk: updateSensorDto.id_tipo_sensor_fk,
      });
      if (!tipoSensor) throw new NotFoundException('Tipo de sensor no encontrado');
      sensor.tipo_sensor = tipoSensor;
    }

    Object.assign(sensor, updateSensorDto);

    const updatedSensor = await this.sensorRepository.save(sensor);

    // Reconectar si está activo
    if (updatedSensor.activo) {
      await this.mqttService.connectSensor({
        id_sensor_pk: updatedSensor.id_sensor_pk,
        broker: updatedSensor.broker_sensor,
        puerto: updatedSensor.puerto_sensor,
        topico: updatedSensor.topico_sensor,
        onMessage: async (valor: number) => {
          const s = await this.saveSensorData({
            id_sensor_pk: updatedSensor.id_sensor_pk,
            valor,
          });
          this.eventEmitter.emit('sensor.updated', s);
        },
      });
    } else {
      await this.mqttService.disconnectSensor(updatedSensor.id_sensor_pk);
    }

    return updatedSensor;
  }

  // ===============================
  // Eliminar (soft delete)
  // ===============================
  async remove(id: number): Promise<void> {
    const sensor = await this.findOne(id);
    await this.mqttService.disconnectSensor(sensor.id_sensor_pk);
    await this.sensorRepository.softRemove(sensor);
  }

  // ===============================
  // Restaurar sensor eliminado
  // ===============================
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
          const s = await this.saveSensorData({
            id_sensor_pk: sensor.id_sensor_pk,
            valor,
          });
          this.eventEmitter.emit('sensor.updated', s);
        },
      });
    }

    return sensor;
  }

  // ===============================
  // Listar eliminados
  // ===============================
  async findAllDeleted(): Promise<Sensor[]> {
    return this.sensorRepository.find({
      withDeleted: true,
      relations: ['tipo_sensor', 'lote'],
      where: { deletedAt: Not(IsNull()) },
    });
  }

  // ===============================
  // Guardar lectura MQTT
  // ===============================
  async saveSensorData({
    id_sensor_pk,
    valor,
  }: {
    id_sensor_pk: number;
    valor: number;
  }) {
    const sensor = await this.findOne(id_sensor_pk);
    if (!sensor) throw new NotFoundException('Sensor no encontrado');

    // Actualiza último valor
    sensor.ultimo_valor = valor;
    sensor.ultima_medicion = new Date();
    await this.sensorRepository.save(sensor);

    // Guarda lectura histórica
    const lectura = this.lecturaRepository.create({
      id_sensor_fk: sensor,
      valor_sensor_lectura: valor,
    });
    await this.lecturaRepository.save(lectura);

    return sensor;
  }

  // ===============================
  // Obtener historial de lecturas (últimas 100)
  // ===============================
  async findHistorial(id_sensor_pk: number): Promise<SensorLectura[]> {
    return this.lecturaRepository.find({
      where: { id_sensor_fk: { id_sensor_pk } },
      order: { fecha_sensor_lectura: 'DESC' },
      take: 100,
    });
  }

  // ===============================
  // Actualizar estado (conectado/desconectado)
  // ===============================
  async updateStatus(id_sensor_pk: number, estado: 'conectado' | 'desconectado') {
    const sensor = await this.sensorRepository.findOne({ where: { id_sensor_pk } });
    if (!sensor) return;

    sensor.estado_sensor = estado;
    if (estado === 'desconectado') sensor.ultimo_valor = null;

    return this.sensorRepository.save(sensor);
  }

  // ===============================
// Actualizar protocolo a todos los sensores
// ===============================
async updateAllProtocols(protocol: 'HTTP' | 'HTTPS' | 'WebSocket' | 'MQTT') {
  const sensores = await this.sensorRepository.find();
  for (const sensor of sensores) {
    sensor.protocolo_sensor = protocol;
  }
  await this.sensorRepository.save(sensores);
  this.logger.log(`Todos los sensores actualizados al protocolo ${protocol}`);
}

}

