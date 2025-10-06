import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull, In } from 'typeorm';
import { Usuario } from '../../modules/usuario/usuarios/entities/usuario.entity';
import { EstadoUsuario } from 'src/modules/usuario/usuarios/enums/estado-usuario.enum';
import { Rol } from '../../modules/usuario/roles/entities/rol.entity';
import { PermisoModule } from 'src/modules/permiso-module/entities/permiso-module.entity';
import { Permiso } from 'src/modules/permisos/entities/permiso.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateAdminSeed implements OnApplicationBootstrap {
  private readonly logger = new Logger(CreateAdminSeed.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
    @InjectRepository(PermisoModule)
    private readonly permisoModuleRepo: Repository<PermisoModule>,
    @InjectRepository(Permiso)
    private readonly permisoRepo: Repository<Permiso>,
  ) {}

  async onApplicationBootstrap() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const existingAdmin = await this.usuarioRepo.findOne({
      where: { correo_usuario: adminEmail },
    });

    if (!existingAdmin) {
      await this.cleanSinModuloAndNullPermissions();
      await this.cleanDuplicatePermissions();
      await this.createModulesAndPermissions();
      await this.createAdminUser();
    } else {
      this.logger.log('Seed no ejecutado: el usuario admin ya existe');
    }
  }

  private async cleanSinModuloAndNullPermissions() {
    await this.permisoRepo.delete({
      modulo: In(['SinModulo', null]),
    });
    this.logger.log('Permisos con modulo SinModulo o null eliminados');

    const sinModulo = await this.permisoModuleRepo.findOne({
      where: { nombre: 'SinModulo' },
    });
    if (sinModulo) {
      await this.permisoModuleRepo.remove(sinModulo);
      this.logger.log('Módulo SinModulo eliminado');
    }
  }

  private async cleanDuplicatePermissions() {
    const permisosDuplicados = await this.permisoRepo
      .createQueryBuilder('permiso')
      .select('permiso.permisoCompleto', 'permisoCompleto')
      .groupBy('permiso.permisoCompleto')
      .having('COUNT(*) > 1')
      .getRawMany();

    for (const { permisoCompleto } of permisosDuplicados) {
      const duplicados = await this.permisoRepo
        .createQueryBuilder('permiso')
        .where('permiso.permisoCompleto = :permisoCompleto', { permisoCompleto })
        .orderBy('permiso.id_permiso_pk', 'ASC')
        .getMany();

      for (let i = 1; i < duplicados.length; i++) {
        await this.permisoRepo.remove(duplicados[i]);
        this.logger.log(`Permiso duplicado eliminado: ${permisoCompleto}`);
      }
    }
  }

  private async createModulesAndPermissions() {
    const modulesData = [
      { nombre: 'actividad', submodulos: ['actividades', 'cultivo-actividad', 'evidencias', 'tipo-actividad', 'usuario-actividad'] },
      { nombre: 'cultivo', submodulos: ['cultivos', 'lotes', 'sublotes', 'tipo-cultivo'] },
      { nombre: 'finanzas', submodulos: ['movimiento-producto', 'productos', 'ventas'] },
      { nombre: 'fitosanitario', submodulos: ['epas', 'tipo-epas'] },
      { nombre: 'inventario', submodulos: ['almacenes', 'categorias', 'insumo-proveedor', 'insumos', 'movimientos'] },
      { nombre: 'iot', submodulos: ['sensores', 'tipo-sensores'] },
      { nombre: 'usuario', submodulos: ['roles', 'usuarios'] },
    ];

    for (const moduleData of modulesData) {
      let modulo = await this.permisoModuleRepo.findOne({
        where: { nombre: moduleData.nombre },
      });

      if (!modulo) {
        modulo = this.permisoModuleRepo.create({ nombre: moduleData.nombre });
        modulo = await this.permisoModuleRepo.save(modulo);
        this.logger.log(`Módulo creado: ${moduleData.nombre}`);
      }

      // No llamar a createCrudPermissions para el módulo principal
      // Solo crear permisos para los submódulos
      for (const submodulo of moduleData.submodulos) {
        const submoduloName = `${moduleData.nombre}:${submodulo}`;
        let submoduloEntity = await this.permisoModuleRepo.findOne({
          where: { nombre: submoduloName },
        });

        if (!submoduloEntity) {
          submoduloEntity = this.permisoModuleRepo.create({ nombre: submoduloName });
          submoduloEntity = await this.permisoModuleRepo.save(submoduloEntity);
          this.logger.log(`Submódulo creado: ${submoduloName}`);
        }

        await this.createCrudPermissions(submoduloName, submoduloEntity);
      }
    }
  }

  private async createCrudPermissions(moduleName: string, moduleEntity: PermisoModule) {
    const acciones = ['create', 'read', 'update', 'delete'];

    for (const accion of acciones) {
      const permisoCompleto = `${moduleName}:${accion}`;
      const existe = await this.permisoRepo.findOne({
        where: { permisoCompleto },
      });

      if (!existe) {
        const permiso = this.permisoRepo.create({
          accion,
          modulo: moduleName,
          permisoCompleto,
          module: moduleEntity,
          activo: true,
        });

        await this.permisoRepo.save(permiso);
        this.logger.log(`Permiso creado: ${permisoCompleto}`);
      } else {
        if (existe.activo !== true) {
          existe.activo = true;
          await this.permisoRepo.save(existe);
          this.logger.log(`Permiso actualizado a activo: ${permisoCompleto}`);
        } else {
          this.logger.log(`Permiso ya existe y está activo: ${permisoCompleto}`);
        }
      }
    }
  }

  private async createAdminUser() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      this.logger.error('No se encontraron ADMIN_EMAIL o ADMIN_PASSWORD en el .env. Semilla no creada.');
      return;
    }

    let adminRol = await this.rolRepo.findOne({
      where: { nombre_rol: 'Administrador' },
      relations: ['permisos'],
    });

    if (!adminRol) {
      adminRol = this.rolRepo.create({ nombre_rol: 'Administrador' });
      adminRol = await this.rolRepo.save(adminRol);
    }

    // Asignar todos los permisos existentes que siguen el formato modulo:submodulo:accion
    const allPermissions = await this.permisoRepo.find({
      where: { module: Not(IsNull()) },
      relations: ['module'],
    });

    const filteredPermissions = allPermissions.filter(permiso => {
      if (!permiso.permisoCompleto || !permiso.permisoCompleto.includes(':')) return false;
      const parts = permiso.permisoCompleto.split(':');
      return parts.length === 3; // Asegura que sea modulo:submodulo:accion
    });

    adminRol.permisos = filteredPermissions;
    await this.rolRepo.save(adminRol);
    this.logger.log('Permisos con formato modulo:submodulo:accion asignados al rol Administrador');

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const newAdmin = this.usuarioRepo.create({
      cedula_usuario: '0000000000',
      nombre_usuario: 'Admin',
      apellido_usuario: 'Principal',
      telefono_usuario: '0000000000',
      correo_usuario: adminEmail,
      contrasena_usuario: hashedPassword,
      estado_usuario: EstadoUsuario.ACTIVO,
      rol: adminRol,
      codigo_recuperacion: null,
      codigo_expiracion: null,
    });

    await this.usuarioRepo.save(newAdmin);
    this.logger.log(`Usuario admin creado con correo: ${adminEmail}`);
  }
}