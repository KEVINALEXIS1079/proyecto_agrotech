import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UseGuards, UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { ActividadesService } from '../services/actividades.service';
import { CreateActividadDto } from '../dto/create-actividad.dto';
import { UpdateActividadDto } from '../dto/update-actividad.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

type WsOk<T = any> = { ok: true; data?: T; message?: string };
type WsErr = { ok: false; error: string; status?: number };
type WsRes<T = any> = WsOk<T> | WsErr;

@WebSocketGateway({
  namespace: '/actividades',
  cors: { origin: '*', credentials: false },
})
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ActividadesGateway {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ActividadesGateway.name);

  constructor(private readonly actividadesService: ActividadesService) {}

  // POST /actividades -> actividades:create
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:actividades:create')
  @SubscribeMessage('create')
  async create(
    @MessageBody() dto: CreateActividadDto,
  ): Promise<WsRes> {
    this.logger.log(`WS actividades:create body=${JSON.stringify(dto)}`);
    try {
      const data = await this.actividadesService.create(dto);
      return { ok: true, data, message: 'Actividad creada exitosamente' };
    } catch (e: any) {
      this.logger.error('Error creando actividad', e.stack);
      return { ok: false, error: e?.message || 'Error creando actividad', status: e?.status };
    }
  }

  // GET /actividades -> actividades:find_all
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:actividades:read')
  @SubscribeMessage('find_all')
  async findAll(): Promise<WsRes> {
    this.logger.log('WS actividades:find_all');
    try {
      const data = await this.actividadesService.findAll();
      return { ok: true, data };
    } catch (e: any) {
      this.logger.error('Error listando actividades', e.stack);
      return { ok: false, error: e?.message || 'Error listando actividades', status: e?.status };
    }
  }

  // GET /actividades/:id -> actividades:find_one
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:actividades:read')
  @SubscribeMessage('find_one')
  async findOne(
    @MessageBody() payload: { id_actividad_pk: number },
  ): Promise<WsRes> {
    this.logger.log(`WS actividades:find_one id=${payload?.id_actividad_pk}`);
    try {
      const data = await this.actividadesService.findOne(+payload.id_actividad_pk);
      return { ok: true, data };
    } catch (e: any) {
      this.logger.error('Error obteniendo actividad', e.stack);
      return { ok: false, error: e?.message || 'Actividad no encontrada', status: e?.status };
    }
  }

  // PATCH /actividades/:id -> actividades:update
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:actividades:update')
  @SubscribeMessage('update')
  async update(
    @MessageBody() payload: { id_actividad_pk: number; dto: UpdateActividadDto },
  ): Promise<WsRes> {
    this.logger.log(`WS actividades:update id=${payload?.id_actividad_pk} body=${JSON.stringify(payload?.dto)}`);
    try {
      const data = await this.actividadesService.update(+payload.id_actividad_pk, payload.dto);
      return { ok: true, data, message: 'Actividad actualizada exitosamente' };
    } catch (e: any) {
      this.logger.error('Error actualizando actividad', e.stack);
      return { ok: false, error: e?.message || 'Error actualizando actividad', status: e?.status };
    }
  }

  // DELETE /actividades/:id -> actividades:remove
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:actividades:delete')
  @SubscribeMessage('remove')
  async remove(
    @MessageBody() payload: { id_actividad_pk: number },
  ): Promise<WsRes> {
    this.logger.log(`WS actividades:remove id=${payload?.id_actividad_pk}`);
    try {
      const data = await this.actividadesService.remove(+payload.id_actividad_pk);
      return { ok: true, data, message: `Actividad con ID ${payload.id_actividad_pk} eliminada correctamente` };
    } catch (e: any) {
      this.logger.error('Error eliminando actividad', e.stack);
      return { ok: false, error: e?.message || 'Error eliminando actividad', status: e?.status };
    }
  }

  // PATCH /actividades/restore/:id -> actividades:restore
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:actividades:update')
  @SubscribeMessage('restore')
  async restore(
    @MessageBody() payload: { id_actividad_pk: number },
  ): Promise<WsRes> {
    this.logger.log(`WS actividades:restore id=${payload?.id_actividad_pk}`);
    try {
      const data = await this.actividadesService.restore(+payload.id_actividad_pk);
      return { ok: true, data, message: `Actividad con ID ${payload.id_actividad_pk} restaurada correctamente` };
    } catch (e: any) {
      this.logger.error('Error restaurando actividad', e.stack);
      return { ok: false, error: e?.message || 'Error restaurando actividad', status: e?.status };
    }
  }
}
