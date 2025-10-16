import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ProveedoresService } from '../services/proveedores.service';
import { CreateProveedorDto } from '../dto/create-proveedor.dto';
import { UpdateProveedorDto } from '../dto/update-proveedor.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

/**
 * Gateway encargado de manejar eventos WebSocket
 * relacionados con el módulo de Proveedores.
 * Los clientes deben conectarse al namespace 'proveedores'
 * para enviar o recibir eventos de este recurso.
 */
@WebSocketGateway({
  namespace: '/proveedores',
  cors: {
    origin: '*',
  },
})
export class ProveedoresGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly proveedoresService: ProveedoresService) {}

  /**
   * Crear un nuevo proveedor.
   * Evento: "proveedor:create"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:proveedores:create')
  @SubscribeMessage('proveedor:create')
  async create(
    @MessageBody() createProveedorDto: CreateProveedorDto,
    @ConnectedSocket() client: Socket,
  ) {
    const proveedor = await this.proveedoresService.create(createProveedorDto);
    this.server.emit('proveedor:created', proveedor);
    return { event: 'proveedor:created', data: proveedor };
  }

  /**
   * Obtener todos los proveedores.
   * Evento: "proveedor:findAll"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:proveedores:read')
  @SubscribeMessage('proveedor:findAll')
  async findAll() {
    const proveedores = await this.proveedoresService.findAll();
    return { event: 'proveedor:list', data: proveedores };
  }

  /**
   * Obtener un proveedor específico por ID.
   * Evento: "proveedor:findOne"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:proveedores:read')
  @SubscribeMessage('proveedor:findOne')
  async findOne(@MessageBody('id') id_proveedor_pk: number) {
    const proveedor = await this.proveedoresService.findOne(id_proveedor_pk);
    return { event: 'proveedor:detail', data: proveedor };
  }

  /**
   * Actualizar un proveedor existente.
   * Evento: "proveedor:update"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:proveedores:update')
  @SubscribeMessage('proveedor:update')
  async update(
    @MessageBody('id') id_proveedor_pk: number,
    @MessageBody('data') updateProveedorDto: UpdateProveedorDto,
  ) {
    const proveedor = await this.proveedoresService.update(
      id_proveedor_pk,
      updateProveedorDto,
    );
    this.server.emit('proveedor:updated', proveedor);
    return { event: 'proveedor:updated', data: proveedor };
  }

  /**
   * Eliminar un proveedor.
   * Evento: "proveedor:remove"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:proveedores:delete')
  @SubscribeMessage('proveedor:remove')
  async remove(@MessageBody('id') id_proveedor_pk: number) {
    const eliminado = await this.proveedoresService.remove(id_proveedor_pk);
    this.server.emit('proveedor:removed', { id: id_proveedor_pk });
    return { event: 'proveedor:removed', data: eliminado };
  }

  /**
   * Restaurar un proveedor eliminado.
   * Evento: "proveedor:restore"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:proveedores:update')
  @SubscribeMessage('proveedor:restore')
  async restore(@MessageBody('id') id_proveedor_pk: number) {
    const restaurado = await this.proveedoresService.restore(id_proveedor_pk);
    this.server.emit('proveedor:restored', restaurado);
    return { event: 'proveedor:restored', data: restaurado };
  }

  /**
   * Detectar nuevas conexiones al gateway.
   */
  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  /**
   * Detectar desconexiones del gateway.
   */
  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }
}
