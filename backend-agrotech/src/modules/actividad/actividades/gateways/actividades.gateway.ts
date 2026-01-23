import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ActividadesService } from '../services/actividades.service';
import { CreateActividadDto } from '../dto/create-actividad.dto';
import { UpdateActividadDto } from '../dto/update-actividad.dto';

@WebSocketGateway({ namespace: '/actividades', cors: { origin: '*' } })
export class ActividadesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly actividadesService: ActividadesService) {}

  @SubscribeMessage('create')
  async create(@MessageBody() dto: CreateActividadDto) {
    const actividad = await this.actividadesService.create(dto);
    this.server.emit('actividades:created', actividad);
    return actividad;
  }

  @SubscribeMessage('find_all')
  async findAll() {
    const actividades = await this.actividadesService.findAll();
    return actividades;
  }

  @SubscribeMessage('find_one')
  async findOne(@MessageBody() payload: { id_actividad_pk: number }) {
    return await this.actividadesService.findOne(payload.id_actividad_pk);
  }

  @SubscribeMessage('update')
  async update(@MessageBody() payload: { id_actividad_pk: number; dto: UpdateActividadDto }) {
    const actividad = await this.actividadesService.update(payload.id_actividad_pk, payload.dto);
    this.server.emit('actividades:updated', actividad);
    return actividad;
  }

  @SubscribeMessage('remove')
  async remove(@MessageBody() payload: { id_actividad_pk: number }) {
    const actividad = await this.actividadesService.remove(payload.id_actividad_pk);
    this.server.emit('actividades:removed', { id: payload.id_actividad_pk });
    return actividad;
  }

  @SubscribeMessage('restore')
  async restore(@MessageBody() payload: { id_actividad_pk: number }) {
    const actividad = await this.actividadesService.restore(payload.id_actividad_pk);
    this.server.emit('actividades:restored', actividad);
    return actividad;
  }
}
