import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../../modules/usuario/roles/entities/rol.entity';

@Injectable()
export class CreateRolesSeed implements OnApplicationBootstrap {
  private readonly logger = new Logger(CreateRolesSeed.name);

  constructor(
    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
  ) {}

  async onApplicationBootstrap() {
    const roles = ['Instructor', 'Pasante', 'Aprendiz', 'Invitado'];

    for (const nombre_rol of roles) {
      const existeRol = await this.rolRepo.findOne({
        where: { nombre_rol },
        });
      if (!existeRol) {
        const nuevoRol = this.rolRepo.create({ nombre_rol });
        await this.rolRepo.save(nuevoRol);
        this.logger.log(`Rol creado: ${nombre_rol}`);
      } else {
        this.logger.log(`El rol "${nombre_rol}" ya existe`);
      }
    }
  }
}