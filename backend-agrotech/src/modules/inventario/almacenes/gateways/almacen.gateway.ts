import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AlmacenesService } from '../services/almacenes.service';
import { CreateAlmacenDto } from '../dto/create-almacen.dto';
import { UpdateAlmacenDto } from '../dto/update-almacen.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

@WebSocketGateway({
  namespace: '/almacenes', // canal de comunicación
  cors: {
    origin: '*', // ajusta según tus necesidades de seguridad
  },
})
export class AlmacenesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly almacenService: AlmacenesService) {}

  //  Crear almacén
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:almacenes:create')
  @SubscribeMessage('almacenes:create')
  async create(@MessageBody() dto: CreateAlmacenDto, @ConnectedSocket() client: Socket) {
    const almacen = await this.almacenService.create(dto);
    // Notifica a todos los clientes conectados
    this.server.emit('almacenes:created', almacen);
    return almacen;
  }

  //  Obtener todos los almacenes
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:almacenes:read')
  @SubscribeMessage('almacenes:findAll')
  async findAll() {
    return await this.almacenService.findAll();
  }

  //  Obtener un almacén por ID
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:almacenes:read')
  @SubscribeMessage('almacenes:findOne')
  async findOne(@MessageBody('id') id: number) {
    return await this.almacenService.findOne(id);
  }

  //  Actualizar un almacén
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:almacenes:update')
  @SubscribeMessage('almacenes:update')
  async update(@MessageBody() payload: { id: number; data: UpdateAlmacenDto }) {
    const { id, data } = payload;
    const updated = await this.almacenService.update(id, data);
    this.server.emit('almacenes:updated', updated);
    return updated;
  }

  // 🔹 Eliminar un almacén
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:almacenes:delete')
  @SubscribeMessage('almacenes:remove')
  async remove(@MessageBody('id') id: number) {
    const result = await this.almacenService.remove(id);
    this.server.emit('almacenes:removed', { id });
    return result;
  }

  //  Restaurar un almacén eliminado
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:almacenes:update')
  @SubscribeMessage('almacenes:restore')
  async restore(@MessageBody('id') id: number) {
    const restored = await this.almacenService.restore(id);
    this.server.emit('almacenes:restored', restored);
    return restored;
  }

  //  (Opcional) Evento cuando un cliente se conecta
  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  //  (Opcional) Evento cuando un cliente se desconecta
  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }
}
