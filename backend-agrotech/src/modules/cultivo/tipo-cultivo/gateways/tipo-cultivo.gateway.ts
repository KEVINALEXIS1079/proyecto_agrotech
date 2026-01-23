import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TipoCultivoService } from '../services/tipo-cultivo.service';
import { CreateTipoCultivoDto } from '../dto/create-tipo-cultivo.dto';
import { UpdateTipoCultivoDto } from '../dto/update-tipo-cultivo.dto';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/tipo-cultivo',
})
export class TipoCultivoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly tipoCultivoService: TipoCultivoService) {}

  handleConnection(client: Socket) {}
  handleDisconnect(client: Socket) {}

  @SubscribeMessage('tipo-cultivo:create')
  async create(@MessageBody() dto: CreateTipoCultivoDto) {
    const result = await this.tipoCultivoService.create(dto);
    this.server.emit('tipo-cultivo:created', result);
    return result;
  }

  @SubscribeMessage('tipo-cultivo:findAll')
  async findAll(@ConnectedSocket() client: Socket) {
    const result = await this.tipoCultivoService.findAll();
    client.emit('tipo-cultivo:list', result);
    return result;
  }

  @SubscribeMessage('tipo-cultivo:findOne')
  async findOne(@MessageBody('id') id: number, @ConnectedSocket() client: Socket) {
    const result = await this.tipoCultivoService.findOne(id);
    client.emit('tipo-cultivo:detail', result);
    return result;
  }

  @SubscribeMessage('tipo-cultivo:update')
  async update(@MessageBody() data: { id: number; dto: UpdateTipoCultivoDto }) {
    const result = await this.tipoCultivoService.update(data.id, data.dto);
    this.server.emit('tipo-cultivo:updated', result);
    return result;
  }

  @SubscribeMessage('tipo-cultivo:remove')
  async remove(@MessageBody('id') id: number) {
    const result = await this.tipoCultivoService.remove(id);
    this.server.emit('tipo-cultivo:removed', { id });
    return result;
  }

  @SubscribeMessage('tipo-cultivo:restore')
  async restore(@MessageBody('id') id: number) {
    const result = await this.tipoCultivoService.restore(id);
    this.server.emit('tipo-cultivo:restored', result);
    return result;
  }
}
