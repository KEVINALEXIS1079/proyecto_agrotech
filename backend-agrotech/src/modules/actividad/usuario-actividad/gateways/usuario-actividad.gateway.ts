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
import { UsuarioActividadService } from '../services/usuario-actividad.service';
import { CreateUsuarioActividadDto } from '../dto/create-usuario-actividad.dto';
import { UpdateUsuarioActividadDto } from '../dto/update-usuario-actividad.dto';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/usuario-actividad',
})
export class UsuarioActividadGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly usuarioActividadService: UsuarioActividadService) {}

  // Verificar conexiones
  handleConnection(client: Socket) {}

  handleDisconnect(client: Socket) {}

  // Crear usuario-actividad
  @SubscribeMessage('usuario-actividad:create')
  async create(
    @MessageBody() dto: CreateUsuarioActividadDto,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.usuarioActividadService.create(dto);
    this.server.emit('usuario-actividad:created', result);
    return result;
  }

  // Obtener todos los usuario-actividad
  @SubscribeMessage('usuario-actividad:findAll')
  async findAll(@ConnectedSocket() client: Socket) {
    const result = await this.usuarioActividadService.findAll();
    client.emit('usuario-actividad:list', result);
    return result;
  }

  // Obtener un usuario-actividad
  @SubscribeMessage('usuario-actividad:findOne')
  async findOne(
    @MessageBody('id_usuario_actividad_pk') id_usuario_actividad_pk: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.usuarioActividadService.findOne(id_usuario_actividad_pk);
    client.emit('usuario-actividad:detail', result);
    return result;
  }

  // Actualizar usuario-actividad
  @SubscribeMessage('usuario-actividad:update')
  async update(@MessageBody() data: { id_usuario_actividad_pk: number; dto: UpdateUsuarioActividadDto }) {
    const result = await this.usuarioActividadService.update(data.id_usuario_actividad_pk, data.dto);
    this.server.emit('usuario-actividad:updated', result);
    return result;
  }

  // Eliminar usuario-actividad
  @SubscribeMessage('usuario-actividad:remove')
  async remove(@MessageBody('id_usuario_actividad_pk') id_usuario_actividad_pk: number) {
    const result = await this.usuarioActividadService.remove(id_usuario_actividad_pk);
    this.server.emit('usuario-actividad:removed', { id_usuario_actividad_pk });
    return result;
  }

  // Restaurar usuario-actividad
  @SubscribeMessage('usuario-actividad:restore')
  async restore(@MessageBody('id_usuario_actividad_pk') id_usuario_actividad_pk: number) {
    const result = await this.usuarioActividadService.restore(id_usuario_actividad_pk);
    this.server.emit('usuario-actividad:restored', result);
    return result;
  }
}