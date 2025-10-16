import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { InsumosService } from '../services/insumos.service';
import { CreateInsumoDto } from '../dto/create-insumo.dto';
import { UpdateInsumoDto } from '../dto/update-insumo.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

/**
 * Gateway para manejar la comunicación en tiempo real
 * del módulo de Insumos.
 * Los clientes se conectan al namespace 'insumos' y
 * pueden escuchar/empezar eventos CRUD.
 */
@WebSocketGateway({
  namespace: '/insumos',
  cors: {
    origin: '*',
  },
})
export class InsumosGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly insumosService: InsumosService) {}

  /**
   * Crear un nuevo insumo.
   * Evento: "insumo:create"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumos:create')
  @SubscribeMessage('insumo:create')
  async create(@MessageBody() dto: CreateInsumoDto, @ConnectedSocket() client: Socket) {
    const nuevo = await this.insumosService.create(dto);
    // Emitir actualización global a todos los clientes
    this.server.emit('insumo:created', nuevo);
    return { event: 'insumo:created', data: nuevo };
  }

  /**
   * Obtener todos los insumos.
   * Evento: "insumo:findAll"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumos:read')
  @SubscribeMessage('insumo:findAll')
  async findAll() {
    const insumos = await this.insumosService.findAll();
    return { event: 'insumo:list', data: insumos };
  }

  /**
   * Obtener un insumo por ID.
   * Evento: "insumo:findOne"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumos:read')
  @SubscribeMessage('insumo:findOne')
  async findOne(@MessageBody('id') id: number) {
    const insumo = await this.insumosService.findOne(id);
    return { event: 'insumo:detail', data: insumo };
  }

  /**
   * Actualizar un insumo existente.
   * Evento: "insumo:update"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumos:update')
  @SubscribeMessage('insumo:update')
  async update(
    @MessageBody('id') id: number,
    @MessageBody('data') dto: UpdateInsumoDto,
  ) {
    const actualizado = await this.insumosService.update(id, dto);
    // Emitir evento global indicando la actualización
    this.server.emit('insumo:updated', actualizado);
    return { event: 'insumo:updated', data: actualizado };
  }

  /**
   * Eliminar un insumo por ID.
   * Evento: "insumo:remove"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumos:delete')
  @SubscribeMessage('insumo:remove')
  async remove(@MessageBody('id') id: number) {
    const eliminado = await this.insumosService.remove(id);
    this.server.emit('insumo:removed', { id });
    return { event: 'insumo:removed', data: eliminado };
  }

  /**
   * Restaurar un insumo eliminado.
   * Evento: "insumo:restore"
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:insumos:update')
  @SubscribeMessage('insumo:restore')
  async restore(@MessageBody('id') id: number) {
    const restaurado = await this.insumosService.restore(id);
    this.server.emit('insumo:restored', restaurado);
    return { event: 'insumo:restored', data: restaurado };
  }

  /**
   * Evento opcional para detectar nuevas conexiones de clientes.
   */
  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  /**
   * Evento opcional para detectar desconexiones de clientes.
   */
  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }
}
