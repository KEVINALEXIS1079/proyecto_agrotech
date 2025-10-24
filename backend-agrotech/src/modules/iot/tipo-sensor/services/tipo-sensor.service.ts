import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { TipoSensor } from '../entities/tipo-sensor.entity';
import { CreateTipoSensorDto } from '../dto/create-tipo-sensor.dto';
import { UpdateTipoSensorDto } from '../dto/update-tipo-sensor.dto';
import { join } from 'path';
import { unlink } from 'fs/promises';
import { UnidadesTipoSensor } from '../enums/unidades.enum';
import { DecimalesTipoSensor } from '../enums/decimales.enum';

@Injectable()
export class TipoSensorService {
  constructor(
    @InjectRepository(TipoSensor)
    private readonly tipoSensorRepository: Repository<TipoSensor>,
  ) {}

  // Crear tipo de sensor con validación y manejo opcional de imagen
  async create(
    createTipoSensorDto: CreateTipoSensorDto,
    imagen?: Express.Multer.File,
  ): Promise<string> {
    const existe = await this.tipoSensorRepository.findOne({
      where: {
        nombre_tipo_sensor: createTipoSensorDto.nombre_tipo_sensor,
      },
    });

    if (existe) {
      throw new BadRequestException(
        `El tipo de sensor "${createTipoSensorDto.nombre_tipo_sensor}" ya existe`,
      );
    }

    const nuevoTipoSensor = this.tipoSensorRepository.create({
      nombre_tipo_sensor: createTipoSensorDto.nombre_tipo_sensor,
      unidades_tipo_sensor:
        createTipoSensorDto.unidades_tipo_sensor as UnidadesTipoSensor,
      decimales_tipo_sensor:
      createTipoSensorDto.decimales_tipo_sensor as unknown as DecimalesTipoSensor,
      imagen_tipo_sensor: imagen ? imagen.filename : null,
    });

    await this.tipoSensorRepository.save(nuevoTipoSensor);

    return 'Tipo de sensor registrado correctamente';
  }

  // Obtener todos los tipos de sensor
  async findAll(): Promise<TipoSensor[]> {
    return await this.tipoSensorRepository.find();
  }

  // Buscar por ID
  async findOne(id_tipo_sensor_pk: number): Promise<TipoSensor> {
    const tipoSensor = await this.tipoSensorRepository.findOne({
      where: { id_tipo_sensor_pk },
      withDeleted: true,
    });

    if (!tipoSensor) {
      throw new NotFoundException('El tipo de sensor no fue encontrado');
    }

    return tipoSensor;
  }

  // Obtener todos los eliminados lógicamente
  async findAllDeleted(): Promise<TipoSensor[]> {
    return await this.tipoSensorRepository.find({
      withDeleted: true,
      where: { delete_at: Not(IsNull()) },
    });
  }

  // Actualizar tipo de sensor (con imagen opcional)
  async update(
    id_tipo_sensor_pk: number,
    dto: UpdateTipoSensorDto,
    imagen?: Express.Multer.File,
  ): Promise<string> {
    const tipoSensor = await this.tipoSensorRepository.findOneBy({
      id_tipo_sensor_pk,
    });

    if (!tipoSensor) {
      throw new NotFoundException('Tipo de sensor no encontrado');
    }

    // Verificar duplicado si cambia el nombre
    if (
      dto.nombre_tipo_sensor &&
      dto.nombre_tipo_sensor !== tipoSensor.nombre_tipo_sensor
    ) {
      const existe = await this.tipoSensorRepository.findOne({
        where: { nombre_tipo_sensor: dto.nombre_tipo_sensor },
      });
      if (existe) {
        throw new BadRequestException(
          `El tipo de sensor "${dto.nombre_tipo_sensor}" ya existe`,
        );
      }
    }

    // Si sube nueva imagen, elimina la anterior
    if (imagen && tipoSensor.imagen_tipo_sensor) {
      const rutaAnterior = join(
        __dirname,
        '../../../uploads/tipos-sensor',
        tipoSensor.imagen_tipo_sensor,
      );
      try {
        await unlink(rutaAnterior);
      } catch {
        // si no existe, se ignora
      }
    }

    Object.assign(tipoSensor, dto);
    if (imagen) tipoSensor.imagen_tipo_sensor = imagen.filename;

    await this.tipoSensorRepository.save(tipoSensor);
    return 'Tipo de sensor actualizado correctamente';
  }

  // Eliminación lógica
  async remove(id_tipo_sensor_pk: number): Promise<string> {
    const result = await this.tipoSensorRepository.softDelete(id_tipo_sensor_pk);
    if (result.affected === 0) {
      throw new NotFoundException('Tipo de sensor no encontrado');
    }
    return 'Tipo de sensor eliminado correctamente';
  }

  // Restaurar registro eliminado
  async restore(id_tipo_sensor_pk: number): Promise<string> {
    const result = await this.tipoSensorRepository.restore(id_tipo_sensor_pk);
    if (result.affected === 0) {
      throw new NotFoundException('Tipo de sensor no encontrado');
    }
    return 'Tipo de sensor restaurado correctamente';
  }

  
}
