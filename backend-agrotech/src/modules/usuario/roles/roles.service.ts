import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const rol = this.rolRepository.create(dto);
    await this.rolRepository.save(rol);
    return 'Rol creado correctamente';
  }

  async findAll(): Promise<Rol[]> {
    return await this.rolRepository.find();
  }

  async findOne(id: number): Promise<Rol> {
    const rol = await this.rolRepository.findOneBy({ id_rol_pk: id });
    if (!rol) throw new Error('Rol no encontrado');
    return rol;
  }

  async update(id: number, dto: UpdateRolDto): Promise<string> {
    const rol = await this.findOne(id);
    this.rolRepository.merge(rol, dto);
    await this.rolRepository.save(rol);
    return 'Rol actualizado correctamente';
  }

  async remove(id: number): Promise<string> {
    const result = await this.rolRepository.softDelete(id);
    if (result.affected === 0) throw new Error('Rol no encontrado');
    return `Rol con ID ${id} eliminado correctamente`;
  }

  async restore(id: number): Promise<string> {
    const result = await this.rolRepository.restore(id);
    if (result.affected === 0) throw new Error('Rol no encontrado');
    return `Rol con ID ${id} restaurado correctamente`;
  }
}
