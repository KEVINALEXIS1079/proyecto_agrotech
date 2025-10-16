import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UseGuards, UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { CultivoActividadService } from '../services/cultivo-actividad.service';
import { CreateCultivoActividadDto } from '../dto/create-cultivo-actividad.dto';
import { UpdateCultivoActividadDto } from '../dto/update-cultivo-actividad.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

type WsOk<T = any> = { ok: true; data?: T; message?: string };
type WsErr = { ok: false; error: string; status?: number };
type WsRes<T = any> = WsOk<T> | WsErr;

@WebSocketGateway({
  namespace: '/cultivo-actividad',
  cors: { origin: '*', credentials: false },
})
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class CultivoActividadGateway {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(CultivoActividadGateway.name);

  constructor(private readonly cultivoActividadService: CultivoActividadService) {}

  // POST /cultivo-actividad -> cultivo-actividad:create
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:cultivo-actividad:create')
  @SubscribeMessage('create')
  async create(
    @MessageBody() dto: CreateCultivoActividadDto,
  ): Promise<WsRes> {
    this.logger.log(`WS cultivo-actividad:create body=${JSON.stringify(dto)}`);
    try {
      const data = await this.cultivoActividadService.create(dto);
      return { ok: true, data, message: 'Relación cultivo-actividad creada exitosamente' };
    } catch (e: any) {
      this.logger.error('Error creando relación cultivo-actividad', e.stack);
      return { ok: false, error: e?.message || 'Error creando relación', status: e?.status };
    }
  }

  // GET /cultivo-actividad -> cultivo-actividad:find_all
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:cultivo-actividad:read')
  @SubscribeMessage('find_all')
  async findAll(): Promise<WsRes> {
    this.logger.log('WS cultivo-actividad:find_all');
    try {
      const data = await this.cultivoActividadService.findAll();
      return { ok: true, data };
    } catch (e: any) {
      this.logger.error('Error listando relaciones cultivo-actividad', e.stack);
      return { ok: false, error: e?.message || 'Error listando relaciones', status: e?.status };
    }
  }

  // GET /cultivo-actividad/:id -> cultivo-actividad:find_one
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:cultivo-actividad:read')
  @SubscribeMessage('find_one')
  async findOne(
    @MessageBody() payload: { id_cultivo_actividad_pk: number },
  ): Promise<WsRes> {
    this.logger.log(`WS cultivo-actividad:find_one id=${payload?.id_cultivo_actividad_pk}`);
    try {
      const data = await this.cultivoActividadService.findOne(+payload.id_cultivo_actividad_pk);
      return { ok: true, data };
    } catch (e: any) {
      this.logger.error('Error obteniendo relación cultivo-actividad', e.stack);
      return { ok: false, error: e?.message || 'Relación no encontrada', status: e?.status };
    }
  }

  // PATCH /cultivo-actividad/:id -> cultivo-actividad:update
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:cultivo-actividad:update')
  @SubscribeMessage('update')
  async update(
    @MessageBody() payload: { id_cultivo_actividad_pk: number; dto: UpdateCultivoActividadDto },
  ): Promise<WsRes> {
    this.logger.log(`WS cultivo-actividad:update id=${payload?.id_cultivo_actividad_pk} body=${JSON.stringify(payload?.dto)}`);
    try {
      const data = await this.cultivoActividadService.update(+payload.id_cultivo_actividad_pk, payload.dto);
      return { ok: true, data, message: 'Relación cultivo-actividad actualizada exitosamente' };
    } catch (e: any) {
      this.logger.error('Error actualizando relación cultivo-actividad', e.stack);
      return { ok: false, error: e?.message || 'Error actualizando relación', status: e?.status };
    }
  }

  // DELETE /cultivo-actividad/:id -> cultivo-actividad:remove
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:cultivo-actividad:delete')
  @SubscribeMessage('remove')
  async remove(
    @MessageBody() payload: { id_cultivo_actividad_pk: number },
  ): Promise<WsRes> {
    this.logger.log(`WS cultivo-actividad:remove id=${payload?.id_cultivo_actividad_pk}`);
    try {
      const data = await this.cultivoActividadService.remove(+payload.id_cultivo_actividad_pk);
      return { ok: true, data, message: `Relación con ID ${payload.id_cultivo_actividad_pk} eliminada correctamente` };
    } catch (e: any) {
      this.logger.error('Error eliminando relación cultivo-actividad', e.stack);
      return { ok: false, error: e?.message || 'Error eliminando relación', status: e?.status };
    }
  }

  // PATCH /cultivo-actividad/restore/:id -> cultivo-actividad:restore
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:cultivo-actividad:update')
  @SubscribeMessage('restore')
  async restore(
    @MessageBody() payload: { id_cultivo_actividad_pk: number },
  ): Promise<WsRes> {
    this.logger.log(`WS cultivo-actividad:restore id=${payload?.id_cultivo_actividad_pk}`);
    try {
      const data = await this.cultivoActividadService.restore(+payload.id_cultivo_actividad_pk);
      return { ok: true, data, message: `Relación con ID ${payload.id_cultivo_actividad_pk} restaurada correctamente` };
    } catch (e: any) {
      this.logger.error('Error restaurando relación cultivo-actividad', e.stack);
      return { ok: false, error: e?.message || 'Error restaurando relación', status: e?.status };
    }
  }
}
