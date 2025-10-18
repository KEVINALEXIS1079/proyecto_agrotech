import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CultivosService } from '../services/cultivos.service';
import { CreateCultivoDto } from '../dto/create-cultivo.dto';
import { UpdateCultivoDto } from '../dto/update-cultivo.dto';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'cultivos',
})
export class CultivosGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly cultivosService: CultivosService) {}

  @SubscribeMessage('cultivos:create')
  async create(@MessageBody() dto: CreateCultivoDto) {
    const result = await this.cultivosService.create(dto);
    this.server.emit('cultivos:created', result);
    return result;
  }

  @SubscribeMessage('cultivos:findAll')
  async findAll() {
    return await this.cultivosService.findAll();
  }

  @SubscribeMessage('cultivos:findOne')
  async findOne(@MessageBody('id') id: number) {
    return await this.cultivosService.findOne(id);
  }

  @SubscribeMessage('cultivos:update')
  async update(@MessageBody() data: { id: number; dto: UpdateCultivoDto }) {
    const result = await this.cultivosService.update(data.id, data.dto);
    this.server.emit('cultivos:updated', result);
    return result;
  }

  @SubscribeMessage('cultivos:remove')
  async remove(@MessageBody('id') id: number) {
    const result = await this.cultivosService.remove(id);
    this.server.emit('cultivos:removed', result);
    return result;
  }

  @SubscribeMessage('cultivos:restore')
  async restore(@MessageBody('id') id: number) {
    const result = await this.cultivosService.restore(id);
    this.server.emit('cultivos:restored', result);
    return result;
  }
}
