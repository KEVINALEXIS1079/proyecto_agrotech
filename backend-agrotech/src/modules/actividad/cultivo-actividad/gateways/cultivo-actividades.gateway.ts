import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { CultivoActividadService } from '../services/cultivo-actividad.service';
import { CreateCultivoActividadDto } from '../dto/create-cultivo-actividad.dto';
import { UpdateCultivoActividadDto } from '../dto/update-cultivo-actividad.dto';

type WsOk<T = any> = { ok: true; data?: T; message?: string };
type WsErr = { ok: false; error: string; status?: number };
type WsRes<T = any> = WsOk<T> | WsErr;

@WebSocketGateway({ namespace: '/cultivo-actividad', cors: { origin: '*', credentials: false } })
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class CultivoActividadGateway {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(CultivoActividadGateway.name);

  constructor(private readonly cultivoActividadService: CultivoActividadService) {}

  @SubscribeMessage('create')
  async create(@MessageBody() dto: CreateCultivoActividadDto): Promise<WsRes> {
    try {
      const data = await this.cultivoActividadService.create(dto);
      return { ok: true, data, message: 'Relación cultivo-actividad creada exitosamente' };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error creando relación', status: e?.status };
    }
  }

  @SubscribeMessage('find_all')
  async findAll(): Promise<WsRes> {
    try {
      const data = await this.cultivoActividadService.findAll();
      return { ok: true, data };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error listando relaciones', status: e?.status };
    }
  }

  @SubscribeMessage('find_one')
  async findOne(@MessageBody() payload: { id_cultivo_actividad_pk: number }): Promise<WsRes> {
    try {
      const data = await this.cultivoActividadService.findOne(+payload.id_cultivo_actividad_pk);
      return { ok: true, data };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Relación no encontrada', status: e?.status };
    }
  }

  @SubscribeMessage('update')
  async update(
    @MessageBody() payload: { id_cultivo_actividad_pk: number; dto: UpdateCultivoActividadDto },
  ): Promise<WsRes> {
    try {
      const data = await this.cultivoActividadService.update(+payload.id_cultivo_actividad_pk, payload.dto);
      return { ok: true, data, message: 'Relación cultivo-actividad actualizada exitosamente' };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error actualizando relación', status: e?.status };
    }
  }

  @SubscribeMessage('remove')
  async remove(@MessageBody() payload: { id_cultivo_actividad_pk: number }): Promise<WsRes> {
    try {
      const data = await this.cultivoActividadService.remove(+payload.id_cultivo_actividad_pk);
      return { ok: true, data, message: `Relación con ID ${payload.id_cultivo_actividad_pk} eliminada correctamente` };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error eliminando relación', status: e?.status };
    }
  }

  @SubscribeMessage('restore')
  async restore(@MessageBody() payload: { id_cultivo_actividad_pk: number }): Promise<WsRes> {
    try {
      const data = await this.cultivoActividadService.restore(+payload.id_cultivo_actividad_pk);
      return { ok: true, data, message: `Relación con ID ${payload.id_cultivo_actividad_pk} restaurada correctamente` };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error restaurando relación', status: e?.status };
    }
  }
}
