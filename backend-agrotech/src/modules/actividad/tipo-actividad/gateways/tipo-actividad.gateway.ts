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
import { TipoActividadService } from '../services/tipo-actividad.service';
import { CreateTipoActividadDto } from '../dto/create-tipo-actividad.dto';
import { UpdateTipoActividadDto } from '../dto/update-tipo-actividad.dto';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/tipo-actividad',
})
export class TipoActividadGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly tipoActividadService: TipoActividadService) {}

  // Verificar conexiones
  handleConnection(client: Socket) {}

  handleDisconnect(client: Socket) {}

  // Crear tipo de actividad
  @SubscribeMessage('tipo-actividad:create')
  async create(
    @MessageBody() dto: CreateTipoActividadDto,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.tipoActividadService.create(dto);
    this.server.emit('tipo-actividad:created', result);
    return result;
  }

  // Obtener todos los tipos de actividad
  @SubscribeMessage('tipo-actividad:findAll')
  async findAll(@ConnectedSocket() client: Socket) {
    const result = await this.tipoActividadService.findAll();
    client.emit('tipo-actividad:list', result);
    return result;
  }

  // Obtener un tipo de actividad
  @SubscribeMessage('tipo-actividad:findOne')
  async findOne(
    @MessageBody('id_tipo_actividad_pk') id_tipo_actividad_pk: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.tipoActividadService.findOne(id_tipo_actividad_pk);
    client.emit('tipo-actividad:detail', result);
    return result;
  }

  // Actualizar tipo de actividad
  @SubscribeMessage('tipo-actividad:update')
  async update(@MessageBody() data: { id_tipo_actividad_pk: number; dto: UpdateTipoActividadDto }) {
    const result = await this.tipoActividadService.update(data.id_tipo_actividad_pk, data.dto);
    this.server.emit('tipo-actividad:updated', result);
    return result;
  }

  // Eliminar tipo de actividad
  @SubscribeMessage('tipo-actividad:remove')
  async remove(@MessageBody('id_tipo_actividad_pk') id_tipo_actividad_pk: number) {
    const result = await this.tipoActividadService.remove(id_tipo_actividad_pk);
    this.server.emit('tipo-actividad:removed', { id_tipo_actividad_pk });
    return result;
  }

  // Restaurar tipo de actividad
  @SubscribeMessage('tipo-actividad:restore')
  async restore(@MessageBody('id_tipo_actividad_pk') id_tipo_actividad_pk: number) {
    const result = await this.tipoActividadService.restore(id_tipo_actividad_pk);
    this.server.emit('tipo-actividad:restored', result);
    return result;
  }
}