import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MovimientoInsumoService } from '../services/movimiento-insumo.service';
import { CreateMovimientoInsumoDto } from '../dto/create-movimiento-insumo.dto';
import { UpdateMovimientoInsumoDto } from '../dto/update-movimiento-insumo.dto';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/movimiento-insumo',
})
export class MovimientoInsumoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly movimientosService: MovimientoInsumoService) {}

  // Verificar conexiones
  handleConnection(client: Socket) {}

  handleDisconnect(client: Socket) {}

  // Crear movimiento de insumo
  @SubscribeMessage('movimiento-insumo:create')
  async create(
    @MessageBody() dto: CreateMovimientoInsumoDto,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.movimientosService.create(dto);
    this.server.emit('movimiento-insumo:created', result);
    return result;
  }

  // Obtener todos los movimientos de insumo
  @SubscribeMessage('movimiento-insumo:findAll')
  async findAll(@ConnectedSocket() client: Socket) {
    const result = await this.movimientosService.findAll();
    client.emit('movimiento-insumo:list', result);
    return result;
  }

  // Obtener un movimiento de insumo
  @SubscribeMessage('movimiento-insumo:findOne')
  async findOne(
    @MessageBody('id_movimiento_insumo_pk') id_movimiento_insumo_pk: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.movimientosService.findOne(id_movimiento_insumo_pk);
    client.emit('movimiento-insumo:detail', result);
    return result;
  }

  // Actualizar movimiento de insumo
  @SubscribeMessage('movimiento-insumo:update')
  async update(@MessageBody() data: { id_movimiento_insumo_pk: number; dto: UpdateMovimientoInsumoDto }) {
    const result = await this.movimientosService.update(data.id_movimiento_insumo_pk, data.dto);
    this.server.emit('movimiento-insumo:updated', result);
    return result;
  }

  // Eliminar movimiento de insumo
  @SubscribeMessage('movimiento-insumo:remove')
  async remove(@MessageBody('id_movimiento_insumo_pk') id_movimiento_insumo_pk: number) {
    const result = await this.movimientosService.remove(id_movimiento_insumo_pk);
    this.server.emit('movimiento-insumo:removed', { id_movimiento_insumo_pk });
    return result;
  }

  // Restaurar movimiento de insumo
  @SubscribeMessage('movimiento-insumo:restore')
  async restore(@MessageBody('id_movimiento_insumo_pk') id_movimiento_insumo_pk: number) {
    const result = await this.movimientosService.restore(id_movimiento_insumo_pk);
    this.server.emit('movimiento-insumo:restored', result);
    return result;
  }
}