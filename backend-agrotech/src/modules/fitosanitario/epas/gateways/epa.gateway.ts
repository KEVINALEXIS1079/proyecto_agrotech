import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { EpasService } from '../services/epas.service';
import { CreateEpaDto } from '../dto/create-epa.dto';
import { UpdateEpaDto } from '../dto/update-epa.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

@WebSocketGateway({
  namespace: '/epas',
  cors: { origin: '*' },
})
export class EpasGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly epasService: EpasService) {}

  // Crear EPA
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:epas:create')
  @SubscribeMessage('epas:create')
  async create(
    @MessageBody() dto: CreateEpaDto,
    @ConnectedSocket() client: Socket,
  ) {
    const epa = await this.epasService.create(dto);
    this.server.emit('epas:created', epa);
    return epa;
  }

  // Obtener todos los EPAs
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:epas:read')
  @SubscribeMessage('epas:findAll')
  async findAll() {
    return this.epasService.findAll();
  }

  // Obtener un EPA por ID
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:epas:read')
  @SubscribeMessage('epas:findOne')
  async findOne(@MessageBody() id: number) {
    return this.epasService.findOne(id);
  }

  // Actualizar un EPA
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:epas:update')
  @SubscribeMessage('epas:update')
  async update(
    @MessageBody() data: { id: number; dto: UpdateEpaDto },
    @ConnectedSocket() client: Socket,
  ) {
    const updated = await this.epasService.update(data.id, data.dto);
    this.server.emit('epas:updated', updated);
    return updated;
  }

  // Eliminar un EPA
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:epas:delete')
  @SubscribeMessage('epas:remove')
  async remove(@MessageBody() id: number, @ConnectedSocket() client: Socket) {
    const result = await this.epasService.remove(id);
    this.server.emit('epas:removed', { id });
    return result;
  }

  // Restaurar un EPA
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('fitosanitario:epas:update')
  @SubscribeMessage('epas:restore')
  async restore(@MessageBody() id: number, @ConnectedSocket() client: Socket) {
    const restored = await this.epasService.restore(id);
    this.server.emit('epas:restored', restored);
    return restored;
  }
}
