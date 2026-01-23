import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { SublotesService } from '../services/sublotes.service';
import { CreateSubloteDto } from '../dto/create-sublote.dto';
import { UpdateSubloteDto } from '../dto/update-sublote.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'sublotes', // organiza eventos por módulo
})
export class SublotesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly sublotesService: SublotesService) {}

  /** Manejo de conexión */
  async handleConnection(client: Socket) {
    // aquí podrías agregar validación de token si quieres
  }

  /** Crear sublote */
  @SubscribeMessage('sublotes:create')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:sublotes:create')
  async create(@MessageBody() dto: CreateSubloteDto) {
    const sublote = await this.sublotesService.create(dto);
    this.server.emit('sublotes:created', sublote); // emitir a todos
    return sublote;
  }

  /** Obtener todos los sublotes */
  @SubscribeMessage('sublotes:findAll')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:sublotes:read')
  async findAll(@ConnectedSocket() client: Socket) {
    const list = await this.sublotesService.findAll();
    client.emit('sublotes:list', list); // solo al cliente
    return list;
  }

  /** Obtener un sublote por ID */
  @SubscribeMessage('sublotes:findOne')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:sublotes:read')
  async findOne(@MessageBody('id_sublote_pk') id: number, @ConnectedSocket() client: Socket) {
    const sublote = await this.sublotesService.findOne(id);
    client.emit('sublotes:detail', sublote);
    return sublote;
  }

  /** Actualizar sublote */
  @SubscribeMessage('sublotes:update')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:sublotes:update')
  async update(
    @MessageBody() data: { id_sublote_pk: number; dto: UpdateSubloteDto },
  ) {
    const sublote = await this.sublotesService.update(data.id_sublote_pk, data.dto);
    this.server.emit('sublotes:updated', sublote);
    return sublote;
  }

  /** Eliminar sublote */
  @SubscribeMessage('sublotes:remove')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:sublotes:delete')
  async remove(@MessageBody('id_sublote_pk') id: number) {
    const res = await this.sublotesService.remove(id);
    this.server.emit('sublotes:removed', res);
    return res;
  }

  /** Restaurar sublote */
  @SubscribeMessage('sublotes:restore')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:sublotes:update')
  async restore(@MessageBody('id_sublote_pk') id: number) {
    const res = await this.sublotesService.restore(id);
    this.server.emit('sublotes:restored', res);
    return res;
  }
}
