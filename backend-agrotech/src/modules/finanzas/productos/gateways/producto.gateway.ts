import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ProductosService } from '../services/productos.service';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { UpdateProductoDto } from '../dto/update-producto.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

/**
 * Gateway WebSocket para manejar operaciones relacionadas con productos.
 * Los clientes deben conectarse al namespace "/productos".
 */
@WebSocketGateway({
  namespace: '/productos',
  cors: {
    origin: '*',
  },
})
export class ProductosGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly productosService: ProductosService) {}

  /**
   * Crear un nuevo producto.
   * Evento: "productos:create"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:productos:create')
  @SubscribeMessage('productos:create')
  async create(
    @MessageBody() createProductoDto: CreateProductoDto,
    @ConnectedSocket() client: Socket,
  ) {
    const producto = await this.productosService.create(createProductoDto);
    this.server.emit('productos:created', producto);
    return { event: 'productos:created', data: producto };
  }

  /**
   * Obtener todos los productos.
   * Evento: "productos:findAll"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:productos:read')
  @SubscribeMessage('productos:findAll')
  async findAll() {
    const productos = await this.productosService.findAll();
    return { event: 'productos:list', data: productos };
  }

  /**
   * Obtener un producto por ID.
   * Evento: "productos:findOne"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:productos:read')
  @SubscribeMessage('productos:findOne')
  async findOne(@MessageBody('id') id: number) {
    const producto = await this.productosService.findOne(id);
    return { event: 'productos:detail', data: producto };
  }

  /**
   * Actualizar un producto existente.
   * Evento: "productos:update"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:productos:update')
  @SubscribeMessage('productos:update')
  async update(
    @MessageBody('id') id: number,
    @MessageBody('data') updateProductoDto: UpdateProductoDto,
  ) {
    const producto = await this.productosService.update(id, updateProductoDto);
    this.server.emit('productos:updated', producto);
    return { event: 'productos:updated', data: producto };
  }

  /**
   * Eliminar un producto por ID.
   * Evento: "productos:remove"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:productos:delete')
  @SubscribeMessage('productos:remove')
  async remove(@MessageBody('id') id: number) {
    const eliminado = await this.productosService.remove(id);
    this.server.emit('productos:removed', { id });
    return { event: 'productos:removed', data: eliminado };
  }

  /**
   * Restaurar un producto eliminado.
   * Evento: "productos:restore"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('finanzas:productos:update')
  @SubscribeMessage('productos:restore')
  async restore(@MessageBody('id') id: number) {
    const restaurado = await this.productosService.restore(id);
    this.server.emit('productos:restored', restaurado);
    return { event: 'productos:restored', data: restaurado };
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
