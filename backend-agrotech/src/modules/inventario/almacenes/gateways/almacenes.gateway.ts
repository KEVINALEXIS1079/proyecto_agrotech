// src/modules/almacenes/gateways/almacenes.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AlmacenesService } from '../services/almacenes.service';
import { CreateAlmacenDto } from '../dto/create-almacen.dto';
import { UpdateAlmacenDto } from '../dto/update-almacen.dto';

@WebSocketGateway({
  namespace: '/almacenes',
  cors: { origin: '*' },
})
export class AlmacenesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly almacenService: AlmacenesService) {}

  @SubscribeMessage('almacenes:create')
  async create(@MessageBody() dto: CreateAlmacenDto) {
    return this.almacenService.create(dto); // el service emite
  }

  @SubscribeMessage('almacenes:findAll')
  async findAll() {
    return this.almacenService.findAll();
  }

  @SubscribeMessage('almacenes:findOne')
  async findOne(@MessageBody('id') id: number) {
    return this.almacenService.findOne(id);
  }

  @SubscribeMessage('almacenes:update')
  async update(@MessageBody() payload: { id: number; data: UpdateAlmacenDto }) {
    return this.almacenService.update(payload.id, payload.data); // el service emite
  }

  @SubscribeMessage('almacenes:remove')
  async remove(@MessageBody('id') id: number) {
    return this.almacenService.remove(id); // el service emite
  }

  @SubscribeMessage('almacenes:restore')
  async restore(@MessageBody('id') id: number) {
    return this.almacenService.restore(id); // el service emite
  }
}
