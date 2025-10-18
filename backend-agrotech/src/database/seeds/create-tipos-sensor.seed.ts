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
    const tipos = ['ph', 'pluviometro', 'humedad'];

    for (const nombre of tipos) {
      const existe = await this.tipoSensorRepo.findOne({
        where: { nombre_tipo_sensor: nombre },
      });

      if (!existe) {
        try {
          const nuevoTipo = this.tipoSensorRepo.create({
            nombre_tipo_sensor: nombre,
          });
          await this.tipoSensorRepo.save(nuevoTipo);
          this.logger.log(`Tipo de sensor creado: ${nombre}`);
        } catch (error) {
          if (error.code === '23505') {
            // Código de error de Postgres por violación de UNIQUE constraint
            this.logger.warn(
              `El tipo de sensor "${nombre}" ya existía (duplicado).`,
            );
          } else {
            throw error;
          }
        }
      }
    }
  }
}
