import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { TipoActividadService } from '../services/tipo-actividad.service';
import { CreateTipoActividadDto } from '../dto/create-tipo-actividad.dto';
import { UpdateTipoActividadDto } from '../dto/update-tipo-actividad.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'tipo-actividad', // organiza eventos por módulo
})
export class TipoActividadGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly tipoActividadService: TipoActividadService) {}

  // Crear tipo de actividad
  @SubscribeMessage('tipo-actividad:create')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-actividad:create')
  async create(
    @MessageBody() dto: CreateTipoActividadDto,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.tipoActividadService.create(dto);
    this.server.emit('tipo-actividad:created', result); // emitir a todos
    return result;
  }

  // Obtener todos los tipos de actividad
  @SubscribeMessage('tipo-actividad:findAll')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-actividad:read')
  async findAll(@ConnectedSocket() client: Socket) {
    const result = await this.tipoActividadService.findAll();
    client.emit('tipo-actividad:list', result); // solo al cliente que lo pidió
    return result;
  }

  // Obtener un tipo de actividad por ID
  @SubscribeMessage('tipo-actividad:findOne')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-actividad:read')
  async findOne(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.tipoActividadService.findOne(id);
    client.emit('tipo-actividad:detail', result);
    return result;
  }

  // Actualizar tipo de actividad
  @SubscribeMessage('tipo-actividad:update')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-actividad:update')
  async update(
    @MessageBody() data: { id: number; dto: UpdateTipoActividadDto },
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.tipoActividadService.update(data.id, data.dto);
    this.server.emit('tipo-actividad:updated', result); // a todos
    return result;
  }

  // Eliminar tipo de actividad
  @SubscribeMessage('tipo-actividad:remove')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-actividad:delete')
  async remove(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.tipoActividadService.remove(id);
    this.server.emit('tipo-actividad:removed', result);
    return result;
  }

  // Restaurar tipo de actividad
  @SubscribeMessage('tipo-actividad:restore')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:tipo-actividad:update')
  async restore(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.tipoActividadService.restore(id);
    this.server.emit('tipo-actividad:restored', result);
    return result;
  }
}
