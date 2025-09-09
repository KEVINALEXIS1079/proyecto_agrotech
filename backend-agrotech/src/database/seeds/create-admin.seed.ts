import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, estado_usuario } from '../../modules/usuario/usuarios/entities/usuario.entity';
import { Rol } from '../../modules/usuario/roles/entities/rol.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateAdminSeed implements OnApplicationBootstrap {
  private readonly logger = new Logger(CreateAdminSeed.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
  ) {}

  async onApplicationBootstrap() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      this.logger.error(
        'No se encontraron ADMIN_EMAIL o ADMIN_PASSWORD en el .env. Semilla no creada.',
      );
      return;
    }

    const existingAdmin = await this.usuarioRepo.findOne({
      where: { correo_usuario: adminEmail },
    });

    if (!existingAdmin) {
      let adminRol = await this.rolRepo.findOne({
        where: { nombre_rol: 'Administrador' },
      });

      if (!adminRol) {
        adminRol = this.rolRepo.create({
          nombre_rol: 'Administrador',
        });
        await this.rolRepo.save(adminRol);
      }

      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const newAdmin = this.usuarioRepo.create({
        cedula_usuario: '0000000000',
        nombre_usuario: 'Admin',
        apellido_usuario: 'Principal',
        telefono_usuario: '0000000000',
        correo_usuario: adminEmail,
        contrasena_usuario: hashedPassword,
        estado_usuario: estado_usuario.ACTIVO,
        rol: adminRol,
        codigo_recuperacion: null,
        codigo_expiracion: null,
      });

      await this.usuarioRepo.save(newAdmin);
      this.logger.log(`Usuario admin creado con correo: ${adminEmail}`);
    } else {
      this.logger.log('!Usuario admin ya existe');
    }
  }
}
