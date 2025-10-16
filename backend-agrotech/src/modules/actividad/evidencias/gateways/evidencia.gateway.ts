import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { EvidenciasService } from '../services/evidencias.service';
import { CreateEvidenciaDto } from '../dto/create-evidencia.dto';
import { UpdateEvidenciaDto } from '../dto/update-evidencia.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'evidencias',
})
export class EvidenciasGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly evidenciasService: EvidenciasService) {}

  // Crear evidencia
  @SubscribeMessage('evidencias:create')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:evidencias:create')
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
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:evidencias:read')
  async findAll(@ConnectedSocket() client: Socket) {
    const result = await this.evidenciasService.findAll();
    client.emit('evidencias:list', result);
    return result;
  }

  // Obtener evidencia por ID
  @SubscribeMessage('evidencias:findOne')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:evidencias:read')
  async findOne(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.evidenciasService.findOne(id);
    client.emit('evidencias:detail', result);
    return result;
  }

  // Actualizar evidencia
  @SubscribeMessage('evidencias:update')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:evidencias:update')
  async update(
    @MessageBody() data: { id: number; dto: UpdateEvidenciaDto },
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.evidenciasService.update(data.id, data.dto);
    this.server.emit('evidencias:updated', result);
    return result;
  }

  // Eliminar evidencia
  @SubscribeMessage('evidencias:remove')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:evidencias:delete')
  async remove(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.evidenciasService.remove(id);
    this.server.emit('evidencias:removed', result);
    return result;
  }

  // Restaurar evidencia
  @SubscribeMessage('evidencias:restore')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:evidencias:update')
  async restore(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.evidenciasService.restore(id);
    this.server.emit('evidencias:restored', result);
    return result;
  }
}
