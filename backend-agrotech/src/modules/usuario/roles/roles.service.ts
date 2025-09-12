import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async create(dto: CreateRolDto): Promise<string> {
    // Validar rol duplicado por nombre
    const existerol = await this.rolRepository.findOne({
      where: { nombre_rol: dto.nombre_rol },
    });
    if (existerol) {
      throw new BadRequestException(
        `El rol ya está registrado`,
      );
    }

    const rol = this.rolRepository.create(dto);
    await this.rolRepository.save(rol);
    return 'Rol creado correctamente';
  }

  async findAll(): Promise<Rol[]> {
    return this.rolRepository.find();
  }

  async findOne(id: number): Promise<Rol> {
    const rol = await this.rolRepository.findOne({
      where: { id_rol_pk: id },
      withDeleted: true,
    });

    if (!rol) throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    return rol;
  }

  async update(id: number, dto: UpdateRolDto): Promise<string> {
    const rol = await this.findOne(id);

    // Validar que no se repita el nombre al actualizar
    if (dto.nombre_rol && dto.nombre_rol !== rol.nombre_rol) {
      const existe = await this.rolRepository.findOne({
        where: { nombre_rol: dto.nombre_rol },
      });
      if (existe) {
        throw new BadRequestException(
          `El rol "${dto.nombre_rol}" ya está registrado`,
        );
      }
    }

    Object.assign(rol, dto);
    await this.rolRepository.save(rol);
    return 'Rol actualizado correctamente';
  }

  async remove(id: number): Promise<string> {
    const result = await this.rolRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
    return `Rol con ID ${id} eliminado correctamente`;
  }

  async restore(id: number): Promise<string> {
    const result = await this.rolRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
    return `Rol con ID ${id} restaurado correctamente`;
  }
}
