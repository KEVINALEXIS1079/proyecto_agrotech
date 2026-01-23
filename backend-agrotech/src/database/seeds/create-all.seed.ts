import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lote } from '../../modules/cultivo/lotes/entities/lote.entity';
import { Sublote } from '../../modules/cultivo/sublotes/entities/sublote.entity';
import { Sensor } from '../../modules/iot/sensores/entities/sensor.entity';
import { TipoSensor } from '../../modules/iot/tipo-sensor/entities/tipo-sensor.entity';

@Injectable()
export class CreateAllSeeds implements OnApplicationBootstrap {
  private readonly logger = new Logger(CreateAllSeeds.name);
  private static alreadySeeded = false; // evita doble ejecución

  constructor(
    @InjectRepository(Lote)
    private readonly loteRepo: Repository<Lote>,

    @InjectRepository(Sublote)
    private readonly subloteRepo: Repository<Sublote>,

    @InjectRepository(Sensor)
    private readonly sensorRepo: Repository<Sensor>,

    @InjectRepository(TipoSensor)
    private readonly tipoSensorRepo: Repository<TipoSensor>,
  ) {}

  async onApplicationBootstrap() {
    // Evita ejecutar dos veces en la misma inicialización
    if (CreateAllSeeds.alreadySeeded) {
      this.logger.verbose('Seeds ya ejecutadas, omitiendo...');
      return;
    }
    CreateAllSeeds.alreadySeeded = true;

    this.logger.log('Iniciando creación de datos base...');

    // ------------------------------
    // Crear Lote
    // ------------------------------
    let lote = await this.loteRepo.findOne({ where: { nombre_lote: 'Bloque A' } });
    if (!lote) {
      lote = this.loteRepo.create({
        nombre_lote: 'Bloque A',
        area_lote: 12352,
        coordenadas_lote: [
          { latitud_lote: 1.8935107128198805, longitud_lote: -76.09147528005832 },
          { latitud_lote: 1.8927221006995512, longitud_lote: -76.09100846771791 },
          { latitud_lote: 1.8931244538670065, longitud_lote: -76.09012849962795 },
          { latitud_lote: 1.8936863204215764, longitud_lote: -76.09068096180475 },
        ],
      });
      lote = await this.loteRepo.save(lote);
      this.logger.log('Lote "Bloque A" creado.');
    } else {
      this.logger.verbose('ℹLote "Bloque A" ya existe, omitido.');
    }

    // ------------------------------
    // Crear Sublote
    // ------------------------------
    let sublote = await this.subloteRepo.findOne({ where: { nombre_sublote: 'Bloque A1' } });
    if (!sublote) {
      sublote = this.subloteRepo.create({
        nombre_sublote: 'Bloque A1',
        area_sublote: 200,
        coordenadas_sublote: [
          { latitud_sublote: 1.893584444094879, longitud_sublote: -76.09128177538302 },
          { latitud_sublote: 1.8932118366854256, longitud_sublote: -76.09109133978404 },
          { latitud_sublote: 1.8933217600955468, longitud_sublote: -76.09081507908131 },
          { latitud_sublote: 1.8936541981554318, longitud_sublote: -76.09100288397507 },
        ],
        lote,
      });
      sublote = await this.subloteRepo.save(sublote);
      this.logger.log('Sublote "Bloque A1" creado.');
    } else {
      this.logger.verbose('ℹSublote "Bloque A1" ya existe, omitido.');
    }

    // ------------------------------
    // Crear Tipo de Sensor
    // ------------------------------
    let tipoSensor = await this.tipoSensorRepo.findOne({ where: { nombre_tipo_sensor: 'Humedad' } });
    if (!tipoSensor) {
      tipoSensor = this.tipoSensorRepo.create({ nombre_tipo_sensor: 'Humedad' });
      tipoSensor = await this.tipoSensorRepo.save(tipoSensor);
      this.logger.log('Tipo de sensor "Humedad" creado.');
    } else {
      this.logger.verbose('ℹTipo de sensor "Humedad" ya existe, omitido.');
    }

    // ------------------------------
    // Crear o actualizar Sensor
    // ------------------------------
    const existingSensor = await this.sensorRepo.findOne({
      where: { nombre_sensor: 'Sensor Humedad A1' },
      withDeleted: true, // también revisa los soft delete
    });

    if (!existingSensor) {
      const sensor = this.sensorRepo.create({
        nombre_sensor: 'Sensor Humedad A1',
        broker_sensor: 'test.mosquitto.org',
        puerto_sensor: 1883,
        topico_sensor: 'sensor/humedadSuelo',
        valor_minimo_sensor: 0,
        valor_maximo_sensor: 100,
        ultimo_valor: 0,
        ultima_medicion: new Date(),
        activo: true,
        lote,
        tipo_sensor: tipoSensor,
      });
      await this.sensorRepo.save(sensor);
      this.logger.log('Sensor "Sensor Humedad A1" creado.');
    } else {
      // actualiza si ya existe
      existingSensor.broker_sensor = 'test.mosquitto.org';
      existingSensor.puerto_sensor = 1883;
      existingSensor.topico_sensor = 'sensor/humedadSuelo';
      existingSensor.valor_minimo_sensor = 0;
      existingSensor.valor_maximo_sensor = 100;
      existingSensor.ultimo_valor = 0;
      existingSensor.ultima_medicion = new Date();
      existingSensor.activo = true;
      existingSensor.lote = lote;
      existingSensor.tipo_sensor = tipoSensor;

      await this.sensorRepo.save(existingSensor);
      this.logger.log('Sensor "Sensor Humedad A1" actualizado correctamente.');
    }

    this.logger.log('Seeds ejecutadas correctamente.');
  }
}
