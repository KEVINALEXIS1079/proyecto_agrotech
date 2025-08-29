import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioActividad } from './entities/usuario_actividad.entity';
import { CreateUsuarioActividadDto } from './dto/create-usuario_actividad.dto';
import { UpdateUsuarioActividadDto } from './dto/update-usuario_actividad.dto';
import { Usuario } from 'src/usuario/usuarios/entities/usuario.entity';
import { Actividades } from '../actividades/entities/actividades.entity';

@Injectable()
export class UsuarioActividadService {
  constructor(
    @InjectRepository(UsuarioActividad)
    private readonly usuarioActividadRepository: Repository<UsuarioActividad>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Actividades)
    private readonly actividadesRepository: Repository<Actividades>,
  ) {}

  async create(dto: CreateUsuarioActividadDto): Promise<string> {
    const { dni_usuario_fk, id_actividad_fk } = dto;

    // Validar que existan las FK
    const usuario = await this.usuarioRepository.findOne({
      where: { cedula_usuario: dni_usuario_fk },
    });
    if (!usuario) {
      throw new NotFoundException(
        `Usuario con cédula ${dni_usuario_fk} no encontrado`,
      );
    }

    const actividad = await this.actividadesRepository.findOne({
      where: { id_actividad_pk: id_actividad_fk },
    });
    if (!actividad) {
      throw new NotFoundException(
        `Actividad con ID ${id_actividad_fk} no encontrada`,
      );
    }

    const nuevaRelacion = this.usuarioActividadRepository.create({
      usuario,
      actividad,
    });

    await this.usuarioActividadRepository.save(nuevaRelacion);
    return 'Usuario actividad creada correctamente';
  }

  async findAll(): Promise<UsuarioActividad[]> {
    return await this.usuarioActividadRepository.find({
      relations: ['usuario', 'actividad'], // Relaciones declaradas en la entity
    });
  }

  async findOne(id: number): Promise<UsuarioActividad> {
    const relacion = await this.usuarioActividadRepository.findOne({
      where: { id_usuarios_actividades_pk: id },
      relations: ['usuario', 'actividad'],
    });

    if (!relacion) {
      throw new NotFoundException(
        `Usuario actividad con ID ${id} no encontrado`,
      );
    }

    return relacion;
  }

  async update(id: number, dto: UpdateUsuarioActividadDto): Promise<string> {
    const relacion = await this.findOne(id);

    if (dto.dni_usuario_fk) {
      const usuario = await this.usuarioRepository.findOne({
        where: { cedula_usuario: dto.dni_usuario_fk },
      });
      if (!usuario) {
        throw new NotFoundException(
          `Usuario con cédula ${dto.dni_usuario_fk} no encontrado`,
        );
      }
      relacion.usuario = usuario;
    }

    if (dto.id_actividad_fk) {
      const actividad = await this.actividadesRepository.findOne({
        where: { id_actividad_pk: dto.id_actividad_fk },
      });
      if (!actividad) {
        throw new NotFoundException(
          `Actividad con ID ${dto.id_actividad_fk} no encontrada`,
        );
      }
      relacion.actividad = actividad;
    }

    await this.usuarioActividadRepository.save(relacion);
    return 'Usuario actividad actualizada correctamente';
  }

  async remove(id: number): Promise<string> {
    const result = await this.usuarioActividadRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Usuario actividad con ID ${id} no encontrado`,
      );
    }
    return `Usuario actividad con ID ${id} eliminada correctamente`;
  }

  async restore(id: number): Promise<string> {
    const result = await this.usuarioActividadRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Usuario actividad con ID ${id} no encontrada`,
      );
    }
    return `Usuario actividad con ID ${id} restaurada correctamente`;
  }
}
