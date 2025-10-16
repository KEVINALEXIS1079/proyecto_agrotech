import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { PermisosModuleService } from '../services/permiso-module.service';
import { CreatePermisoModuleDto } from '../dto/create-permiso-module.dto';
import { UpdatePermisoModuleDto } from '../dto/update-permiso-module.dto';

type WsOk<T = any> = { ok: true; data?: T; message?: string };
type WsErr = { ok: false; error: string; status?: number };
type WsRes<T = any> = WsOk<T> | WsErr;

@WebSocketGateway({
  namespace: '/permisos-module',
  cors: { origin: '*', credentials: false },
})
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class PermisosModuleGateway {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(PermisosModuleGateway.name);

  constructor(private readonly permisosModuleService: PermisosModuleService) {}

  // POST /permisos-module  ->  permisos-module:create
  @SubscribeMessage('create')
  async create(@MessageBody() dto: CreatePermisoModuleDto): Promise<WsRes> {
    this.logger.log(`WS permisos-module:create ${JSON.stringify(dto)}`);
    try {
      const data = await this.permisosModuleService.create(dto);
      return { ok: true, data, message: 'Creado correctamente.' };
    } catch (e: any) {
      this.logger.error('Error creando', e.stack);
      return { ok: false, error: e?.message || 'Error creando', status: e?.status };
    }
  }

  // GET /permisos-module  ->  permisos-module:find_all
  @SubscribeMessage('find_all')
  async findAll(): Promise<WsRes> {
    this.logger.log('WS permisos-module:find_all');
    try {
      const data = await this.permisosModuleService.findAll();
      return { ok: true, data };
    } catch (e: any) {
      this.logger.error('Error listando', e.stack);
      return { ok: false, error: e?.message || 'Error listando', status: e?.status };
    }
  }

  // GET /permisos-module/:id  ->  permisos-module:find_one
  @SubscribeMessage('find_one')
  async findOne(@MessageBody() payload: { id: number }): Promise<WsRes> {
    this.logger.log(`WS permisos-module:find_one id=${payload?.id}`);
    try {
      const data = await this.permisosModuleService.findOne(payload.id);
      return { ok: true, data };
    } catch (e: any) {
      this.logger.error('Error obteniendo', e.stack);
      return { ok: false, error: e?.message || 'No encontrado', status: e?.status };
    }
  }

  // PATCH /permisos-module/:id  ->  permisos-module:update
  @SubscribeMessage('update')
  async update(
    @MessageBody() payload: { id: number; dto: UpdatePermisoModuleDto },
  ): Promise<WsRes> {
    this.logger.log(`WS permisos-module:update id=${payload?.id} body=${JSON.stringify(payload?.dto)}`);
    try {
      const data = await this.permisosModuleService.update(payload.id, payload.dto);
      return { ok: true, data, message: 'Actualizado correctamente.' };
    } catch (e: any) {
      this.logger.error('Error actualizando', e.stack);
      return { ok: false, error: e?.message || 'Error actualizando', status: e?.status };
    }
  }

  // DELETE /permisos-module/:id  ->  permisos-module:remove
  @SubscribeMessage('remove')
  async remove(@MessageBody() payload: { id: number }): Promise<WsRes> {
    this.logger.log(`WS permisos-module:remove id=${payload?.id}`);
    try {
      const data = await this.permisosModuleService.remove(payload.id);
      return { ok: true, data, message: `Eliminado id=${payload.id}` };
    } catch (e: any) {
      this.logger.error('Error eliminando', e.stack);
      return { ok: false, error: e?.message || 'Error eliminando', status: e?.status };
    }
  }
}
