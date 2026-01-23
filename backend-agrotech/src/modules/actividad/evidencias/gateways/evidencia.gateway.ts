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
import { EvidenciasService } from '../services/evidencias.service';
import { CreateEvidenciaDto } from '../dto/create-evidencia.dto';
import { UpdateEvidenciaDto } from '../dto/update-evidencia.dto';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/evidencias',
})
export class EvidenciasGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly evidenciasService: EvidenciasService) {}

  // Verificar conexiones
  handleConnection(client: Socket) {}

  handleDisconnect(client: Socket) {}

  // Crear evidencia
  @SubscribeMessage('evidencias:create')
  async create(
    @MessageBody() dto: CreateEvidenciaDto,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.evidenciasService.create(dto);
    this.server.emit('evidencias:created', result);
    return result;
  }

  // Obtener todas las evidencias
  @SubscribeMessage('evidencias:findAll')
  async findAll(@ConnectedSocket() client: Socket) {
    const result = await this.evidenciasService.findAll();
    client.emit('evidencias:list', result);
    return result;
  }

  // Obtener una evidencia
  @SubscribeMessage('evidencias:findOne')
  async findOne(
    @MessageBody('id_evidencia_pk') id_evidencia_pk: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.evidenciasService.findOne(id_evidencia_pk);
    client.emit('evidencias:detail', result);
    return result;
  }

  // Actualizar evidencia
  @SubscribeMessage('evidencias:update')
  async update(@MessageBody() data: { id_evidencia_pk: number; dto: UpdateEvidenciaDto }) {
    const result = await this.evidenciasService.update(data.id_evidencia_pk, data.dto);
    this.server.emit('evidencias:updated', result);
    return result;
  }

  // Eliminar evidencia
  @SubscribeMessage('evidencias:remove')
  async remove(@MessageBody('id_evidencia_pk') id_evidencia_pk: number) {
    const result = await this.evidenciasService.remove(id_evidencia_pk);
    this.server.emit('evidencias:removed', { id_evidencia_pk });
    return result;
  }

  // Restaurar evidencia
  @SubscribeMessage('evidencias:restore')
  async restore(@MessageBody('id_evidencia_pk') id_evidencia_pk: number) {
    const result = await this.evidenciasService.restore(id_evidencia_pk);
    this.server.emit('evidencias:restored', result);
    return result;
  }
}