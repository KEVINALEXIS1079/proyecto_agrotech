import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { TipoEpaService } from '../services/tipo-epa.service';
import { CreateTipoEpaDto } from '../dto/create-tipo-epa.dto';
import { UpdateTipoEpaDto } from '../dto/update-tipo-epa.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

@WebSocketGateway({
  namespace: '/tipo-epa',
  cors: { origin: '*' },
})
export class TipoEpaGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly tipoEpaService: TipoEpaService) {}

  // Crear tipo de EPA
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-epa:create')
  @SubscribeMessage('tipo-epa:create')
  async create(
    @MessageBody() dto: CreateTipoEpaDto,
    @ConnectedSocket() client: Socket,
  ) {
    const created = await this.tipoEpaService.create(dto);
    this.server.emit('tipo-epa:created', created);
    return created;
  }

  // Obtener todos los tipos de EPA
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:tipo-epa:read')
  @SubscribeMessage('tipo-epa:findAll')
  async findAll() {
    return this.tipoEpaService.findAll();
  }

  // Obtener tipo de EPA por ID
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:tipo-epa:read')
  @SubscribeMessage('tipo-epa:findOne')
  async findOne(@MessageBody() id: number) {
    return this.tipoEpaService.findOne(id);
  }

  // Actualizar tipo de EPA
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-epa:update')
  @SubscribeMessage('tipo-epa:update')
  async update(
    @MessageBody() data: { id: number; dto: UpdateTipoEpaDto },
    @ConnectedSocket() client: Socket,
  ) {
    const updated = await this.tipoEpaService.update(data.id, data.dto);
    this.server.emit('tipo-epa:updated', updated);
    return updated;
  }

  // Eliminar tipo de EPA
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-epa:delete')
  @SubscribeMessage('tipo-epa:remove')
  async remove(@MessageBody() id: number, @ConnectedSocket() client: Socket) {
    const result = await this.tipoEpaService.remove(id);
    this.server.emit('tipo-epa:removed', { id });
    return result;
  }

  // Restaurar tipo de EPA
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-epa:update')
  @SubscribeMessage('tipo-epa:restore')
  async restore(@MessageBody() id: number, @ConnectedSocket() client: Socket) {
    const restored = await this.tipoEpaService.restore(id);
    this.server.emit('tipo-epa:restored', restored);
    return restored;
  }
}
