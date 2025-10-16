import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { InsumoProveedorService } from '../services/insumo-proveedor.service';
import { CreateInsumoProveedorDto } from '../dto/create-insumo-proveedor.dto';
import { UpdateInsumoProveedorDto } from '../dto/update-insumo-proveedor.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

@WebSocketGateway({
  namespace: '/insumo-proveedor',
  cors: {
    origin: '*',
  },
})
export class InsumoProveedorGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly insumoProveedorService: InsumoProveedorService) {}

  /**
   * Crea una nueva relación entre un insumo y un proveedor.
   * Evento de entrada: 'insumoProveedor:create'
   * Evento de difusión: 'insumoProveedor:created'
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:insumo-proveedor:create')
  @SubscribeMessage('insumoProveedor:create')
  async create(
    @MessageBody() dto: CreateInsumoProveedorDto,
    @ConnectedSocket() client: Socket,
  ) {
    const relacion = await this.insumoProveedorService.create(dto);
    this.server.emit('insumoProveedor:created', relacion);
    return relacion;
  }

  /**
   * Devuelve la lista completa de relaciones insumo-proveedor.
   * Evento de entrada: 'insumoProveedor:findAll'
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:insumo-proveedor:read')
  @SubscribeMessage('insumoProveedor:findAll')
  async findAll() {
    return await this.insumoProveedorService.findAll();
  }

  /**
   * Obtiene una relación insumo-proveedor por su ID.
   * Evento de entrada: 'insumoProveedor:findOne'
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:insumo-proveedor:read')
  @SubscribeMessage('insumoProveedor:findOne')
  async findOne(@MessageBody('id') id: number) {
    return await this.insumoProveedorService.findOne(id);
  }

  /**
   * Actualiza los datos de una relación insumo-proveedor existente.
   * Evento de entrada: 'insumoProveedor:update'
   * Evento de difusión: 'insumoProveedor:updated'
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:insumo-proveedor:update')
  @SubscribeMessage('insumoProveedor:update')
  async update(@MessageBody() payload: { id: number; data: UpdateInsumoProveedorDto }) {
    const { id, data } = payload;
    const updated = await this.insumoProveedorService.update(id, data);
    this.server.emit('insumoProveedor:updated', updated);
    return updated;
  }

  /**
   * Elimina una relación insumo-proveedor.
   * Evento de entrada: 'insumoProveedor:remove'
   * Evento de difusión: 'insumoProveedor:removed'
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:insumo-proveedor:delete')
  @SubscribeMessage('insumoProveedor:remove')
  async remove(@MessageBody('id') id: number) {
    const result = await this.insumoProveedorService.remove(id);
    this.server.emit('insumoProveedor:removed', { id });
    return result;
  }

  /**
   * Restaura una relación insumo-proveedor previamente eliminada.
   * Evento de entrada: 'insumoProveedor:restore'
   * Evento de difusión: 'insumoProveedor:restored'
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:insumo-proveedor:update')
  @SubscribeMessage('insumoProveedor:restore')
  async restore(@MessageBody('id') id: number) {
    const restored = await this.insumoProveedorService.restore(id);
    this.server.emit('insumoProveedor:restored', restored);
    return restored;
  }

  /**
   * Se ejecuta cuando un cliente establece una conexión WebSocket.
   */
  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  /**
   * Se ejecuta cuando un cliente se desconecta del WebSocket.
   */
  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }
}
