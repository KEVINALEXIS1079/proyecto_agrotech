import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EpasService } from '../services/epas.service';
import { CreateEpaDto } from '../dto/create-epa.dto';
import { UpdateEpaDto } from '../dto/update-epa.dto';

@WebSocketGateway({
  namespace: '/epas',
  cors: { origin: '*' },
})
export class EpasGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly epasService: EpasService) {}

  @SubscribeMessage('epas:create')
  async create(@MessageBody() dto: CreateEpaDto) {
    const epa = await this.epasService.create(dto);
    this.server.emit('epas:created', epa);
    return epa;
  }

  @SubscribeMessage('epas:findAll')
  async findAll() {
    return this.epasService.findAll();
  }

  @SubscribeMessage('epas:findOne')
  async findOne(@MessageBody() id: number) {
    return this.epasService.findOne(id);
  }

  @SubscribeMessage('epas:update')
  async update(@MessageBody() data: { id: number; dto: UpdateEpaDto }) {
    const epa = await this.epasService.update(data.id, data.dto);
    this.server.emit('epas:updated', epa);
    return epa;
  }

  @SubscribeMessage('epas:remove')
  async remove(@MessageBody() id: number) {
    const epa = await this.epasService.remove(id);
    this.server.emit('epas:removed', { id });
    return id;
  }

  @SubscribeMessage('epas:restore')
  async restore(@MessageBody() id: number) {
    const epa = await this.epasService.restore(id);
    this.server.emit('epas:restored', epa);
    return epa;
  }
}
