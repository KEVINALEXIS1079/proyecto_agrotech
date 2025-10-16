import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { TipoCultivoService } from '../services/tipo-cultivo.service';
import { CreateTipoCultivoDto } from '../dto/create-tipo-cultivo.dto';
import { UpdateTipoCultivoDto } from '../dto/update-tipo-cultivo.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'tipo-cultivo',
})
export class TipoCultivoGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly tipoCultivoService: TipoCultivoService) {}

  @SubscribeMessage('tipo-cultivo:create')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:tipo-cultivo:create')
  async create(
    @MessageBody() dto: CreateTipoCultivoDto,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.tipoCultivoService.create(dto);
    this.server.emit('tipo-cultivo:created', result);
    return result;
  }

  @SubscribeMessage('tipo-cultivo:findAll')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:tipo-cultivo:read')
  async findAll(@ConnectedSocket() client: Socket) {
    const result = await this.tipoCultivoService.findAll();
    client.emit('tipo-cultivo:list', result);
    return result;
  }

  @SubscribeMessage('tipo-cultivo:findOne')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:tipo-cultivo:read')
  async findOne(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.tipoCultivoService.findOne(id);
    client.emit('tipo-cultivo:detail', result);
    return result;
  }

  @SubscribeMessage('tipo-cultivo:update')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:tipo-cultivo:update')
  async update(
    @MessageBody() data: { id: number; dto: UpdateTipoCultivoDto },
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.tipoCultivoService.update(data.id, data.dto);
    this.server.emit('tipo-cultivo:updated', result);
    return result;
  }

  @SubscribeMessage('tipo-cultivo:remove')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:tipo-cultivo:delete')
  async remove(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.tipoCultivoService.remove(id);
    this.server.emit('tipo-cultivo:removed', result);
    return result;
  }

  @SubscribeMessage('tipo-cultivo:restore')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:tipo-cultivo:update')
  async restore(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.tipoCultivoService.restore(id);
    this.server.emit('tipo-cultivo:restored', result);
    return result;
  }
}
