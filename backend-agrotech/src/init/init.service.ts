import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, estado_usuario } from '../usuario/usuarios/entities/usuario.entity';
import { Rol } from '../usuario/roles/entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InitService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
  ) {}
    // Crear usuario admin si no existe
  async onApplicationBootstrap() {
    const existingAdmin = await this.usuarioRepo.findOne({
      where: { correo_usuario: 'admin@admin.com' },
    });

    if (!existingAdmin) {
      let adminRol = await this.rolRepo.findOne({
        where: { nombre_rol: 'administrador' },
      });

      if (!adminRol) {
        adminRol = this.rolRepo.create({
          nombre_rol: 'Administrador',
        });
        await this.rolRepo.save(adminRol);
      }
      const hashedPassword = await bcrypt.hash('admin123', 10);

      const newAdmin = this.usuarioRepo.create({
        cedula_usuario: '0000000000',
        nombre_usuario: 'Admin',
        apellido_usuario: 'Principal',
        telefono_usuario: '0000000000',
        correo_usuario: 'admin@admin.com',
        contrasena_usuario: hashedPassword,
        estado_usuario: estado_usuario.ACTIVO,
        rol: adminRol,
        codigo_recuperacion: null,
        codigo_expiracion: null,
      });

      await this.usuarioRepo.save(newAdmin);
      console.log('Usuario admin creado');
    } else {
      console.log('Usuario admin ya existe');
    }
  }
}
