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
import { LotesService } from '../services/lotes.service';
import { CreateLoteDto } from '../dto/create-lote.dto';
import { UpdateLoteDto } from '../dto/update-lote.dto';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/lotes', // IMPORTANTE: con barra inicial
})
export class LotesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly lotesService: LotesService) {}

  // Verificar conexiones
  handleConnection(client: Socket) {}

  handleDisconnect(client: Socket) {}

  // Crear lote
  @SubscribeMessage('lotes:create')
  async create(
    @MessageBody() dto: CreateLoteDto,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.lotesService.create(dto);
    this.server.emit('lotes:created', result);
    return result;
  }

  // Obtener todos los lotes
  @SubscribeMessage('lotes:findAll')
  async findAll(@ConnectedSocket() client: Socket) {
    const result = await this.lotesService.findAll();
    client.emit('lotes:list', result);
    return result;
  }

  // Obtener un lote
  @SubscribeMessage('lotes:findOne')
  async findOne(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.lotesService.findOne(id);
    client.emit('lotes:detail', result);
    return result;
  }

  // Actualizar lote
  @SubscribeMessage('lotes:update')
  async update(@MessageBody() data: { id: number; dto: UpdateLoteDto }) {
    const result = await this.lotesService.update(data.id, data.dto);
    this.server.emit('lotes:updated', result);
    return result;
  }

  // Eliminar lote
  @SubscribeMessage('lotes:remove')
  async remove(@MessageBody('id') id: number) {
    const result = await this.lotesService.remove(id);
    this.server.emit('lotes:removed', { id });
    return result;
  }

  // Restaurar lote
  @SubscribeMessage('lotes:restore')
  async restore(@MessageBody('id') id: number) {
    const result = await this.lotesService.restore(id);
    this.server.emit('lotes:restored', result);
    return result;
  }
}