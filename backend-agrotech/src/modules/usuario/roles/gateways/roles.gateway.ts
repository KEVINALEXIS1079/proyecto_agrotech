import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { CreateRolDto } from '../dto/create-rol.dto';
import { UpdateRolDto } from '../dto/update-role.dto';
import { Rol } from '../entities/rol.entity';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

type WsOk<T = any> = { ok: true; data?: T; message?: string };
type WsErr = { ok: false; error: string; status?: number };
type WsRes<T = any> = WsOk<T> | WsErr;

@WebSocketGateway({
  namespace: '/roles',
  cors: { origin: '*', credentials: false },
})
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class RolesGateway {
  @WebSocketServer() server: Server;
  constructor(private readonly rolesService: RolesService) {}

  // create -> evento: roles:create
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:roles:create')
  @SubscribeMessage('create')
  async create(
    @MessageBody() dto: CreateRolDto,
  ): Promise<WsRes<string>> {
    try {
      const msg = await this.rolesService.create(dto);
      return { ok: true, data: msg, message: 'Rol creado exitosamente' };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error creando rol', status: e?.status };
    }
  }

  // findAll -> evento: roles:find_all
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:roles:read')
  @SubscribeMessage('find_all')
  async findAll(): Promise<WsRes<Rol[]>> {
    try {
      const data = await this.rolesService.findAll();
      return { ok: true, data };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error listando roles', status: e?.status };
    }
  }

  // findOne -> evento: roles:find_one
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:roles:read')
  @SubscribeMessage('find_one')
  async findOne(
    @MessageBody() payload: { id: number },
  ): Promise<WsRes<Rol>> {
    try {
      const data = await this.rolesService.findOne(payload.id);
      return { ok: true, data };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Rol no encontrado', status: e?.status };
    }
  }

  // update -> evento: roles:update
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:roles:update')
  @SubscribeMessage('update')
  async update(
    @MessageBody() payload: { id: number; dto: UpdateRolDto },
  ): Promise<WsRes<string>> {
    try {
      const msg = await this.rolesService.update(payload.id, payload.dto);
      return { ok: true, data: msg, message: 'Rol actualizado exitosamente' };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error actualizando rol', status: e?.status };
    }
  }

  // remove -> evento: roles:remove
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:roles:delete')
  @SubscribeMessage('remove')
  async remove(
    @MessageBody() payload: { id: number },
  ): Promise<WsRes<string>> {
    try {
      const msg = await this.rolesService.remove(payload.id);
      return { ok: true, data: msg, message: `Rol con ID ${payload.id} eliminado correctamente` };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error eliminando rol', status: e?.status };
    }
  }

  // restore -> evento: roles:restore
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:roles:update')
  @SubscribeMessage('restore')
  async restore(
    @MessageBody() payload: { id: number },
  ): Promise<WsRes<string>> {
    try {
      const msg = await this.rolesService.restore(payload.id);
      return { ok: true, data: msg, message: `Rol con ID ${payload.id} restaurado correctamente` };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error restaurando rol', status: e?.status };
    }
  }
}
