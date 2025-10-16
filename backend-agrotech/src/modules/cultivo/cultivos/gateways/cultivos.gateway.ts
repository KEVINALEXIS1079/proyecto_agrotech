import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { CultivosService } from '../services/cultivos.service';
import { CreateCultivoDto } from '../dto/create-cultivo.dto';
import { UpdateCultivoDto } from '../dto/update-cultivo.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'cultivos', // namespace específico para cultivos
})
export class CultivosGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly cultivosService: CultivosService) {}

  // Crear
  @SubscribeMessage('cultivos:create')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:cultivos:create')
  async create(@MessageBody() dto: CreateCultivoDto, @ConnectedSocket() client: Socket) {
    const result = await this.cultivosService.create(dto);
    this.server.emit('cultivos:created', result); // Notifica a todos
    return result;
  }

  // Obtener todos
  @SubscribeMessage('cultivos:findAll')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:cultivos:read')
  async findAll(@ConnectedSocket() client: Socket) {
    const result = await this.cultivosService.findAll();
    client.emit('cultivos:list', result); // Solo al cliente que pidió
    return result;
  }

  // Obtener uno
  @SubscribeMessage('cultivos:findOne')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:cultivos:read')
  async findOne(@MessageBody('id') id: number, @ConnectedSocket() client: Socket) {
    const result = await this.cultivosService.findOne(id);
    client.emit('cultivos:detail', result);
    return result;
  }

  // Actualizar
  @SubscribeMessage('cultivos:update')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:cultivos:update')
  async update(
    @MessageBody() data: { id: number; dto: UpdateCultivoDto },
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.cultivosService.update(data.id, data.dto);
    this.server.emit('cultivos:updated', result); // Notifica a todos
    return result;
  }

  // Eliminar
  @SubscribeMessage('cultivos:remove')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:cultivos:delete')
  async remove(@MessageBody('id') id: number, @ConnectedSocket() client: Socket) {
    const result = await this.cultivosService.remove(id);
    this.server.emit('cultivos:removed', result); // Notifica a todos
    return result;
  }

  // Restaurar
  @SubscribeMessage('cultivos:restore')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:cultivos:update')
  async restore(@MessageBody('id') id: number, @ConnectedSocket() client: Socket) {
    const result = await this.cultivosService.restore(id);
    this.server.emit('cultivos:restored', result); // Notifica a todos
    return result;
  }
}
