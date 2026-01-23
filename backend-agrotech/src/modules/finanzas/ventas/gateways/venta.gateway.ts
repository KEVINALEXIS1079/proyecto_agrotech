import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { VentasService } from '../services/ventas.service';
import { CreateVentaDto } from '../dto/create-venta.dto';
import { UpdateVentaDto } from '../dto/update-venta.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

/**
 * Gateway WebSocket para manejar las operaciones relacionadas con las ventas.
 * Los clientes deben conectarse al namespace "/ventas".
 */
@WebSocketGateway({
  namespace: '/ventas',
  cors: {
    origin: '*',
  },
})
export class VentasGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly ventasService: VentasService) {}

  /**
   * Crear una nueva venta.
   * Evento: "ventas:create"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:ventas:create')
  @SubscribeMessage('ventas:create')
  async create(
    @MessageBody() createVentaDto: CreateVentaDto,
    @ConnectedSocket() client: Socket,
  ) {
    const venta = await this.ventasService.create(createVentaDto);
    this.server.emit('ventas:created', venta);
    return { event: 'ventas:created', data: venta };
  }

  /**
   * Obtener todas las ventas.
   * Evento: "ventas:findAll"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:ventas:read')
  @SubscribeMessage('ventas:findAll')
  async findAll() {
    const ventas = await this.ventasService.findAll();
    return { event: 'ventas:list', data: ventas };
  }

  /**
   * Obtener una venta por ID.
   * Evento: "ventas:findOne"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:ventas:read')
  @SubscribeMessage('ventas:findOne')
  async findOne(@MessageBody('id') id: number) {
    const venta = await this.ventasService.findOne(id);
    return { event: 'ventas:detail', data: venta };
  }

  /**
   * Actualizar una venta existente.
   * Evento: "ventas:update"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:ventas:update')
  @SubscribeMessage('ventas:update')
  async update(
    @MessageBody('id') id: number,
    @MessageBody('data') updateVentaDto: UpdateVentaDto,
  ) {
    const venta = await this.ventasService.update(id, updateVentaDto);
    this.server.emit('ventas:updated', venta);
    return { event: 'ventas:updated', data: venta };
  }

  /**
   * Eliminar una venta por ID.
   * Evento: "ventas:remove"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:ventas:delete')
  @SubscribeMessage('ventas:remove')
  async remove(@MessageBody('id') id: number) {
    const eliminado = await this.ventasService.remove(id);
    this.server.emit('ventas:removed', { id });
    return { event: 'ventas:removed', data: eliminado };
  }

  /**
   * Restaurar una venta eliminada.
   * Evento: "ventas:restore"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:ventas:update')
  @SubscribeMessage('ventas:restore')
  async restore(@MessageBody('id') id: number) {
    const restaurado = await this.ventasService.restore(id);
    this.server.emit('ventas:restored', restaurado);
    return { event: 'ventas:restored', data: restaurado };
  }

  /**
   * Maneja la conexión de un nuevo cliente.
   */
  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  /**
   * Maneja la desconexión de un cliente.
   */
  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }
}
