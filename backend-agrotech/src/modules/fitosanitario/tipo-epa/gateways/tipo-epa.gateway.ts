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
import { TipoEpaService } from '../services/tipo-epa.service';
import { CreateTipoEpaDto } from '../dto/create-tipo-epa.dto';
import { UpdateTipoEpaDto } from '../dto/update-tipo-epa.dto';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/tipo-epa', // IMPORTANTE: con barra inicial
})
export class TipoEpaGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly tipoEpaService: TipoEpaService) {}

  // Verificar conexiones
  handleConnection(client: Socket) {}

  handleDisconnect(client: Socket) {}

  // Crear tipo de EPA
  @SubscribeMessage('tipo-epa:create')
  async create(
    @MessageBody() dto: CreateTipoEpaDto,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.tipoEpaService.create(dto);
    this.server.emit('tipo-epa:created', result);
    return result;
  }

  // Obtener todos los tipos de EPA
  @SubscribeMessage('tipo-epa:findAll')
  async findAll(@ConnectedSocket() client: Socket) {
    const result = await this.tipoEpaService.findAll();
    client.emit('tipo-epa:list', result);
    return result;
  }

  // Obtener un tipo de EPA
  @SubscribeMessage('tipo-epa:findOne')
  async findOne(
    @MessageBody('id_tipo_epa_pk') id_tipo_epa_pk: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.tipoEpaService.findOne(id_tipo_epa_pk);
    client.emit('tipo-epa:detail', result);
    return result;
  }

  // Actualizar tipo de EPA
  @SubscribeMessage('tipo-epa:update')
  async update(@MessageBody() data: { id_tipo_epa_pk: number; dto: UpdateTipoEpaDto }) {
    const result = await this.tipoEpaService.update(data.id_tipo_epa_pk, data.dto);
    this.server.emit('tipo-epa:updated', result);
    return result;
  }

  // Eliminar tipo de EPA
  @SubscribeMessage('tipo-epa:remove')
  async remove(@MessageBody('id_tipo_epa_pk') id_tipo_epa_pk: number) {
    const result = await this.tipoEpaService.remove(id_tipo_epa_pk);
    this.server.emit('tipo-epa:removed', { id_tipo_epa_pk });
    return result;
  }

  // Restaurar tipo de EPA
  @SubscribeMessage('tipo-epa:restore')
  async restore(@MessageBody('id_tipo_epa_pk') id_tipo_epa_pk: number) {
    const result = await this.tipoEpaService.restore(id_tipo_epa_pk);
    this.server.emit('tipo-epa:restored', result);
    return result;
  }
}