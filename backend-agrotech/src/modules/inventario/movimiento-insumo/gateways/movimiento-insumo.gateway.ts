import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { MovimientoInsumoService } from '../services/movimiento-insumo.service';
import { CreateMovimientoInsumoDto } from '../dto/create-movimiento-insumo.dto';
import { UpdateMovimientoInsumoDto } from '../dto/update-movimiento-insumo.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';

/**
 * Gateway para manejar la comunicación en tiempo real
 * del módulo Movimiento de Insumos.
 * Los clientes se conectan al namespace 'movimiento-insumo'
 * y pueden enviar o escuchar eventos de tipo CRUD.
 */
@WebSocketGateway({
  namespace: '/movimiento-insumo',
  cors: {
    origin: '*',
  },
})
export class MovimientoInsumoGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly movimientosService: MovimientoInsumoService) {}

  /**
   * Crear un nuevo movimiento de insumo.
   * Evento: "movimiento:create"
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  @SubscribeMessage('movimiento:create')
  async create(
    @MessageBody() dto: CreateMovimientoInsumoDto,
    @ConnectedSocket() client: Socket,
  ) {
    const nuevo = await this.movimientosService.create(dto);
    // Emitir evento global con el nuevo movimiento
    this.server.emit('movimiento:created', nuevo);
    return { event: 'movimiento:created', data: nuevo };
  }

  /**
   * Obtener todos los movimientos de insumo.
   * Evento: "movimiento:findAll"
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  @SubscribeMessage('movimiento:findAll')
  async findAll() {
    const movimientos = await this.movimientosService.findAll();
    return { event: 'movimiento:list', data: movimientos };
  }

  /**
   * Obtener un movimiento de insumo por ID.
   * Evento: "movimiento:findOne"
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  @SubscribeMessage('movimiento:findOne')
  async findOne(@MessageBody('id') id: number) {
    const movimiento = await this.movimientosService.findOne(id);
    return { event: 'movimiento:detail', data: movimiento };
  }

  /**
   * Actualizar un movimiento de insumo.
   * Evento: "movimiento:update"
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  @SubscribeMessage('movimiento:update')
  async update(
    @MessageBody('id') id: number,
    @MessageBody('data') dto: UpdateMovimientoInsumoDto,
  ) {
    const actualizado = await this.movimientosService.update(id, dto);
    this.server.emit('movimiento:updated', actualizado);
    return { event: 'movimiento:updated', data: actualizado };
  }

  /**
   * Eliminar un movimiento de insumo.
   * Evento: "movimiento:remove"
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  @SubscribeMessage('movimiento:remove')
  async remove(@MessageBody('id') id: number) {
    const eliminado = await this.movimientosService.remove(id);
    this.server.emit('movimiento:removed', { id });
    return { event: 'movimiento:removed', data: eliminado };
  }

  /**
   * Restaurar un movimiento de insumo eliminado.
   * Evento: "movimiento:restore"
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  @SubscribeMessage('movimiento:restore')
  async restore(@MessageBody('id') id: number) {
    const restaurado = await this.movimientosService.restore(id);
    this.server.emit('movimiento:restored', restaurado);
    return { event: 'movimiento:restored', data: restaurado };
  }

  /**
   * Evento opcional para detectar nuevas conexiones.
   */
  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  /**
   * Evento opcional para detectar desconexiones.
   */
  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }
}
