import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async create(dto: CreateRoleDto): Promise<Rol> {
    const nuevoRol = this.rolRepository.create(dto);
    return this.rolRepository.save(nuevoRol);
  }

  async findAll(): Promise<Rol[]> {
    return this.rolRepository.find();
  }

  async findOne(id: number): Promise<Rol> {
    const rol = await this.rolRepository.findOneBy({ id_rol_pk: id });
    if (!rol) throw new Error('Rol no encontrado');
    return rol;
  }

  async update(id: number, dto: UpdateRoleDto): Promise<Rol> {
    const rol = await this.rolRepository.findOneBy({ id_rol_pk: id });
    if (!rol) throw new Error('Rol no encontrado');

    Object.assign(rol, dto);
    return this.rolRepository.save(rol);
  }

  async remove(id: number): Promise<string> {
    const result = await this.rolRepository.softDelete(id);
    if (result.affected === 0) throw new Error('Rol no encontrado');
    return 'Rol eliminado correctamente';
  }

  async restore(id: number): Promise<string> {
    const result = await this.rolRepository.restore(id);
    if (result.affected === 0) throw new Error('Rol no encontrado');
    return 'Rol se a restaurado correctamete';
  }
}
