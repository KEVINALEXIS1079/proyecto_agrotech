import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermisoModule } from '../entities/permiso-module.entity';
import { CreatePermisoModuleDto } from '../dto/create-permiso-module.dto';
import { UpdatePermisoModuleDto } from '../dto/update-permiso-module.dto';

@Injectable()
export class PermisosModuleService {
  constructor(
    @InjectRepository(PermisoModule)
    private readonly permisoModuleRepo: Repository<PermisoModule>,
  ) {}

  async create(dto: CreatePermisoModuleDto) {
    const newModule = this.permisoModuleRepo.create(dto);
    return await this.permisoModuleRepo.save(newModule);
  }

  async findAll() {
    return this.permisoModuleRepo.find({ relations: ['permisos'] });
  }

  async findOne(id: number) {
    const modulo = await this.permisoModuleRepo.findOne({
    where: { id_permiso_module_pk: id },
    relations: ['permisos'],
    });
    if (!modulo) throw new NotFoundException('Módulo no encontrado');
    return modulo;
  }

  async update(id: number, dto: UpdatePermisoModuleDto) {
    await this.findOne(id);
    await this.permisoModuleRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const modulo = await this.findOne(id);
    await this.permisoModuleRepo.remove(modulo);
    return { message: 'Módulo eliminado correctamente' };
  }
}
