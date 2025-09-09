import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { FindRelationsNotFoundError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Rol } from '../roles/entities/role.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>
  ) {}

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
  const rol = await this.rolRepository.findOneBy({ id_rol_pk: dto.id_rol_fk });
  if (!rol) throw new Error('El rol especificado no existe');

  const nuevoUsuario = this.usuarioRepository.create({
    ...dto,
    rol, // se asigna la entidad completa, no solo el id
  });

  return await this.usuarioRepository.save(nuevoUsuario);
}


  async findAll(): Promise<Usuario[]> {
      return this.usuarioRepository.find({relations: ['rol']});
    }
  
  async findOne(id: number): Promise<Usuario> {
  const usuario = await this.usuarioRepository.findOne({
    where: { id_usuario_pk: id },
    relations: ['rol'], // También carga el rol aquí
  });

  if (!usuario) throw new Error('usuario no encontrado');
  return usuario;
}


  async update(id: number, dto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({id_usuario_pk: id});
    if (!usuario) throw new Error('usuario no encontrado');

    Object.assign(usuario, dto);
    return this.usuarioRepository.save(usuario)
  }

    async remove(id: number): Promise<string> {
    const result = await this.usuarioRepository.softDelete(id);
    if (result.affected === 0) throw new Error('usuario no encontrado');
    return 'usuario eliminado correctamente';
  }


  async restore(id: number): Promise<string> {
    const result = await this.usuarioRepository.restore(id);
    if (result.affected === 0) throw new Error('usuario no encontrado');
    return 'usuario se a restaurado correctamete';
  }

}
