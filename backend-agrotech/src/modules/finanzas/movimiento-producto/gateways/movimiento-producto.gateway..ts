import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { MovimientoProductoService } from '../services/movimiento-producto.service';
import { CreateMovimientoProductoDto } from '../dto/create-movimiento-producto.dto';
import { UpdateMovimientoProductoDto } from '../dto/update-movimiento-producto.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

/**
 * Gateway WebSocket para manejar eventos relacionados con los movimientos de productos.
 * Los clientes se conectan al namespace '/movimiento-producto' para interactuar con estos eventos.
 */
@WebSocketGateway({
  namespace: '/movimiento-producto',
  cors: {
    origin: '*',
  },
})
export class MovimientoProductoGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly movimientoProductoService: MovimientoProductoService) {}

  /**
   * Crear un nuevo movimiento de producto.
   * Evento: "movimiento-producto:create"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:movimiento-producto:create')
  @SubscribeMessage('movimiento-producto:create')
  async create(
    @MessageBody() createMovimientoProductoDto: CreateMovimientoProductoDto,
    @ConnectedSocket() client: Socket,
  ) {
    const movimiento = await this.movimientoProductoService.create(createMovimientoProductoDto);
    this.server.emit('movimiento-producto:created', movimiento);
    return { event: 'movimiento-producto:created', data: movimiento };
  }

  /**
   * Obtener todos los movimientos de producto.
   * Evento: "movimiento-producto:findAll"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:movimiento-producto:read')
  @SubscribeMessage('movimiento-producto:findAll')
  async findAll() {
    const movimientos = await this.movimientoProductoService.findAll();
    return { event: 'movimiento-producto:list', data: movimientos };
  }

  /**
   * Obtener un movimiento de producto por ID.
   * Evento: "movimiento-producto:findOne"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:movimiento-producto:read')
  @SubscribeMessage('movimiento-producto:findOne')
  async findOne(@MessageBody('id') id: number) {
    const movimiento = await this.movimientoProductoService.findOne(id);
    return { event: 'movimiento-producto:detail', data: movimiento };
  }

  /**
   * Actualizar un movimiento de producto existente.
   * Evento: "movimiento-producto:update"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:movimiento-producto:update')
  @SubscribeMessage('movimiento-producto:update')
  async update(
    @MessageBody('id') id: number,
    @MessageBody('data') updateMovimientoProductoDto: UpdateMovimientoProductoDto,
  ) {
    const movimiento = await this.movimientoProductoService.update(id, updateMovimientoProductoDto);
    this.server.emit('movimiento-producto:updated', movimiento);
    return { event: 'movimiento-producto:updated', data: movimiento };
  }

  /**
   * Eliminar un movimiento de producto.
   * Evento: "movimiento-producto:remove"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:movimiento-producto:delete')
  @SubscribeMessage('movimiento-producto:remove')
  async remove(@MessageBody('id') id: number) {
    const eliminado = await this.movimientoProductoService.remove(id);
    this.server.emit('movimiento-producto:removed', { id });
    return { event: 'movimiento-producto:removed', data: eliminado };
  }

  /**
   * Restaurar un movimiento de producto eliminado.
   * Evento: "movimiento-producto:restore"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:movimiento-producto:update')
  @SubscribeMessage('movimiento-producto:restore')
  async restore(@MessageBody('id') id: number) {
    const restaurado = await this.movimientoProductoService.restore(id);
    this.server.emit('movimiento-producto:restored', restaurado);
    return { event: 'movimiento-producto:restored', data: restaurado };
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
