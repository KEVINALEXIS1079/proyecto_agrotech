import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UseGuards, UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { UsuarioActividadService } from '../services/usuario-actividad.service';
import { CreateUsuarioActividadDto } from '../dto/create-usuario-actividad.dto';
import { UpdateUsuarioActividadDto } from '../dto/update-usuario-actividad.dto';
import { UsuarioActividad } from '../entities/usuario-actividad.entity';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

type WsOk<T = any> = { ok: true; data?: T; message?: string };
type WsErr = { ok: false; error: string; status?: number };
type WsRes<T = any> = WsOk<T> | WsErr;

@WebSocketGateway({
  namespace: '/usuario-actividad',
  cors: { origin: '*', credentials: false },
})
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class UsuarioActividadGateway {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(UsuarioActividadGateway.name);

  constructor(private readonly usuarioActividadService: UsuarioActividadService) {}

  // POST /usuario-actividad -> usuario-actividad:create
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:usuario-actividad:create')
  @SubscribeMessage('create')
  async create(
    @MessageBody() dto: CreateUsuarioActividadDto,
  ): Promise<WsRes<string>> {
    this.logger.log(`WS usuario-actividad:create body=${JSON.stringify(dto)}`);
    try {
      const msg = await this.usuarioActividadService.create(dto);
      return { ok: true, data: msg, message: 'Relación usuario-actividad creada exitosamente' };
    } catch (e: any) {
      this.logger.error('Error creando relación usuario-actividad', e.stack);
      return { ok: false, error: e?.message || 'Error creando relación', status: e?.status };
    }
  }

  // GET /usuario-actividad -> usuario-actividad:find_all
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:usuario-actividad:read')
  @SubscribeMessage('find_all')
  async findAll(): Promise<WsRes<UsuarioActividad[]>> {
    this.logger.log('WS usuario-actividad:find_all');
    try {
      const data = await this.usuarioActividadService.findAll();
      return { ok: true, data };
    } catch (e: any) {
      this.logger.error('Error listando relaciones usuario-actividad', e.stack);
      return { ok: false, error: e?.message || 'Error listando relaciones', status: e?.status };
    }
  }

  // GET /usuario-actividad/:id -> usuario-actividad:find_one
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:usuario-actividad:read')
  @SubscribeMessage('find_one')
  async findOne(
    @MessageBody() payload: { id: number },
  ): Promise<WsRes<UsuarioActividad>> {
    this.logger.log(`WS usuario-actividad:find_one id=${payload?.id}`);
    try {
      const data = await this.usuarioActividadService.findOne(payload.id);
      return { ok: true, data };
    } catch (e: any) {
      this.logger.error('Error obteniendo relación usuario-actividad', e.stack);
      return { ok: false, error: e?.message || 'Relación no encontrada', status: e?.status };
    }
  }

  // PATCH /usuario-actividad/:id -> usuario-actividad:update
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:usuario-actividad:update')
  @SubscribeMessage('update')
  async update(
    @MessageBody() payload: { id: number; dto: UpdateUsuarioActividadDto },
  ): Promise<WsRes<string>> {
    this.logger.log(`WS usuario-actividad:update id=${payload?.id} body=${JSON.stringify(payload?.dto)}`);
    try {
      const msg = await this.usuarioActividadService.update(payload.id, payload.dto);
      return { ok: true, data: msg, message: 'Relación usuario-actividad actualizada exitosamente' };
    } catch (e: any) {
      this.logger.error('Error actualizando relación usuario-actividad', e.stack);
      return { ok: false, error: e?.message || 'Error actualizando relación', status: e?.status };
    }
  }

  // DELETE /usuario-actividad/:id -> usuario-actividad:remove
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:usuario-actividad:delete')
  @SubscribeMessage('remove')
  async remove(@MessageBody() payload: { id: number }): Promise<WsRes<string>> {
    this.logger.log(`WS usuario-actividad:remove id=${payload?.id}`);
    try {
      const msg = await this.usuarioActividadService.remove(payload.id);
      return { ok: true, data: msg, message: `Relación con ID ${payload.id} eliminada correctamente` };
    } catch (e: any) {
      this.logger.error('Error eliminando relación usuario-actividad', e.stack);
      return { ok: false, error: e?.message || 'Error eliminando relación', status: e?.status };
    }
  }

  // PATCH /usuario-actividad/restore/:id -> usuario-actividad:restore
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:usuario-actividad:update')
  @SubscribeMessage('restore')
  async restore(@MessageBody() payload: { id: number }): Promise<WsRes<string>> {
    this.logger.log(`WS usuario-actividad:restore id=${payload?.id}`);
    try {
      const msg = await this.usuarioActividadService.restore(payload.id);
      return { ok: true, data: msg, message: `Relación con ID ${payload.id} restaurada correctamente` };
    } catch (e: any) {
      this.logger.error('Error restaurando relación usuario-actividad', e.stack);
      return { ok: false, error: e?.message || 'Error restaurando relación', status: e?.status };
    }
  }
}
