import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TipoSensor,
} from '../../modules/iot/tipo-sensor/entities/tipo-sensor.entity';
import { UnidadesTipoSensor } from 'src/modules/iot/tipo-sensor/enums/unidades.enum';
import { DecimalesTipoSensor } from 'src/modules/iot/tipo-sensor/enums/decimales.enum';
@Injectable()
export class CreateTiposSensorSeed implements OnApplicationBootstrap {
  private readonly logger = new Logger(CreateTiposSensorSeed.name);

  constructor(
    @InjectRepository(TipoSensor)
    private readonly tipoSensorRepo: Repository<TipoSensor>,
  ) {}

  async onApplicationBootstrap() {
    const tiposBase: Omit<TipoSensor, 'id_tipo_sensor_pk' | 'sensores'>[] = [
      {
        nombre_tipo_sensor: 'Temperatura',
        unidades_tipo_sensor: UnidadesTipoSensor.CELSIUS,
        decimales_tipo_sensor: DecimalesTipoSensor.DOS,
        imagen_tipo_sensor:
          'https://cdn-icons-png.flaticon.com/512/1684/1684375.png',
        delete_at: null,
      },
      {
        nombre_tipo_sensor: 'Humedad',
        unidades_tipo_sensor: UnidadesTipoSensor.PORCENTAJE,
        decimales_tipo_sensor: DecimalesTipoSensor.UNO,
        imagen_tipo_sensor:
          'https://cdn-icons-png.flaticon.com/512/728/728093.png',
        delete_at: null,
      },
      {
        nombre_tipo_sensor: 'pH',
        unidades_tipo_sensor: UnidadesTipoSensor.PH,
        decimales_tipo_sensor: DecimalesTipoSensor.DOS,
        imagen_tipo_sensor:
          'https://cdn-icons-png.flaticon.com/512/4837/4837832.png',
        delete_at: null,
      },
      {
        nombre_tipo_sensor: 'Pluviómetro',
        unidades_tipo_sensor: UnidadesTipoSensor.MM,
        decimales_tipo_sensor: DecimalesTipoSensor.UNO,
        imagen_tipo_sensor:
          'https://cdn-icons-png.flaticon.com/512/1113/1113769.png',
        delete_at: null,
      },
      {
        nombre_tipo_sensor: 'Luminosidad',
        unidades_tipo_sensor: UnidadesTipoSensor.LUX,
        decimales_tipo_sensor: DecimalesTipoSensor.ENTERO,
        imagen_tipo_sensor:
          'https://cdn-icons-png.flaticon.com/512/869/869869.png',
        delete_at: null,
      },
    ];

    for (const tipo of tiposBase) {
      const existe = await this.tipoSensorRepo.findOne({
        where: { nombre_tipo_sensor: tipo.nombre_tipo_sensor },
      });

      if (!existe) {
        try {
          const nuevoTipo = this.tipoSensorRepo.create(tipo);
          await this.tipoSensorRepo.save(nuevoTipo);
          this.logger.log(`Tipo de sensor creado: ${tipo.nombre_tipo_sensor}`);
        } catch (error) {
          if (error.code === '23505') {
            this.logger.warn(
              `El tipo de sensor "${tipo.nombre_tipo_sensor}" ya existía.`,
            );
          } else {
            this.logger.error(
              `Error al crear el tipo de sensor "${tipo.nombre_tipo_sensor}": ${error.message}`,
            );
          }
        }
      } else {
        this.logger.verbose(
          `Tipo de sensor "${tipo.nombre_tipo_sensor}" ya existe, omitido.`,
        );
      }
    }
  }
}
