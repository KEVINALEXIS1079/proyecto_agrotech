import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoSensor } from '../../modules/iot/tipo-sensor/entities/tipo-sensor.entity';

@Injectable()
export class CreateTiposSensorSeed implements OnApplicationBootstrap {
  private readonly logger = new Logger(CreateTiposSensorSeed.name);

  constructor(
    @InjectRepository(TipoSensor)
    private readonly tipoSensorRepo: Repository<TipoSensor>,
  ) {}

  async onApplicationBootstrap() {
    const tiposBase: Partial<TipoSensor>[] = [
      {
        nombre_tipo_sensor: 'Temperatura',
        unidades_tipo_sensor: '°C',
        decimales_tipo_sensor: 2,
        imagen_tipo_sensor:
          'https://cdn-icons-png.flaticon.com/512/1684/1684375.png',
      },
      {
        nombre_tipo_sensor: 'Humedad',
        unidades_tipo_sensor: '%',
        decimales_tipo_sensor: 1,
        imagen_tipo_sensor:
          'https://cdn-icons-png.flaticon.com/512/728/728093.png',
      },
      {
        nombre_tipo_sensor: 'pH',
        unidades_tipo_sensor: 'pH',
        decimales_tipo_sensor: 2,
        imagen_tipo_sensor:
          'https://cdn-icons-png.flaticon.com/512/4837/4837832.png',
      },
      {
        nombre_tipo_sensor: 'Pluviómetro',
        unidades_tipo_sensor: 'mm',
        decimales_tipo_sensor: 1,
        imagen_tipo_sensor:
          'https://cdn-icons-png.flaticon.com/512/1113/1113769.png',
      },
      {
        nombre_tipo_sensor: 'Luminosidad',
        unidades_tipo_sensor: 'lx',
        decimales_tipo_sensor: 0,
        imagen_tipo_sensor:
          'https://cdn-icons-png.flaticon.com/512/869/869869.png',
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
          this.logger.log(`✅ Tipo de sensor creado: ${tipo.nombre_tipo_sensor}`);
        } catch (error) {
          if (error.code === '23505') {
            this.logger.warn(
              `  El tipo de sensor "${tipo.nombre_tipo_sensor}" ya existía.`,
            );
          } else {
            this.logger.error(
              ` Error al crear el tipo de sensor "${tipo.nombre_tipo_sensor}":`,
              error.message,
            );
          }
        }
      } else {
        this.logger.verbose(
          `  Tipo de sensor "${tipo.nombre_tipo_sensor}" ya existe, omitido.`,
        );
      }
    }
  }
}
