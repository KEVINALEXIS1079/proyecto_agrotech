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
import { InsumosService } from '../services/insumos.service';
import { CreateInsumoDto } from '../dto/create-insumo.dto';
import { UpdateInsumoDto } from '../dto/update-insumo.dto';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/insumos', // IMPORTANTE: con barra inicial
})
export class InsumosGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly insumosService: InsumosService) {}

  // Verificar conexiones
  handleConnection(client: Socket) {}

  handleDisconnect(client: Socket) {}

  // Crear insumo
  @SubscribeMessage('insumos:create')
  async create(
    @MessageBody() dto: CreateInsumoDto,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.insumosService.create(dto);
    this.server.emit('insumos:created', result);
    return result;
  }

  // Obtener todos los insumos
  @SubscribeMessage('insumos:findAll')
  async findAll(@ConnectedSocket() client: Socket) {
    const result = await this.insumosService.findAll();
    client.emit('insumos:list', result);
    return result;
  }

  // Obtener un insumo
  @SubscribeMessage('insumos:findOne')
  async findOne(
    @MessageBody('id_insumo_pk') id_insumo_pk: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.insumosService.findOne(id_insumo_pk);
    client.emit('insumos:detail', result);
    return result;
  }

  // Actualizar insumo
  @SubscribeMessage('insumos:update')
  async update(@MessageBody() data: { id_insumo_pk: number; dto: UpdateInsumoDto }) {
    const result = await this.insumosService.update(data.id_insumo_pk, data.dto);
    this.server.emit('insumos:updated', result);
    return result;
  }

  // Eliminar insumo
  @SubscribeMessage('insumos:remove')
  async remove(@MessageBody('id_insumo_pk') id_insumo_pk: number) {
    const result = await this.insumosService.remove(id_insumo_pk);
    this.server.emit('insumos:removed', { id_insumo_pk });
    return result;
  }

  // Restaurar insumo
  @SubscribeMessage('insumos:restore')
  async restore(@MessageBody('id_insumo_pk') id_insumo_pk: number) {
    const result = await this.insumosService.restore(id_insumo_pk);
    this.server.emit('insumos:restored', result);
    return result;
  }
}