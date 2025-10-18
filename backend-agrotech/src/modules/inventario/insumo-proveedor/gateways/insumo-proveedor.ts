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
import { InsumoProveedorService } from '../services/insumo-proveedor.service';
import { CreateInsumoProveedorDto } from '../dto/create-insumo-proveedor.dto';
import { UpdateInsumoProveedorDto } from '../dto/update-insumo-proveedor.dto';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/insumo-proveedor',
})
export class InsumoProveedorGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly insumoProveedorService: InsumoProveedorService) {}

  // Verificar conexiones
  handleConnection(client: Socket) {}

  handleDisconnect(client: Socket) {}

  // Crear insumo-proveedor
  @SubscribeMessage('insumo-proveedor:create')
  async create(
    @MessageBody() dto: CreateInsumoProveedorDto,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.insumoProveedorService.create(dto);
    this.server.emit('insumo-proveedor:created', result);
    return result;
  }

  // Obtener todos los insumo-proveedor
  @SubscribeMessage('insumo-proveedor:findAll')
  async findAll(@ConnectedSocket() client: Socket) {
    const result = await this.insumoProveedorService.findAll();
    client.emit('insumo-proveedor:list', result);
    return result;
  }

  // Obtener un insumo-proveedor
  @SubscribeMessage('insumo-proveedor:findOne')
  async findOne(
    @MessageBody('id_insumo_proveedor_pk') id_insumo_proveedor_pk: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.insumoProveedorService.findOne(id_insumo_proveedor_pk);
    client.emit('insumo-proveedor:detail', result);
    return result;
  }

  // Actualizar insumo-proveedor
  @SubscribeMessage('insumo-proveedor:update')
  async update(@MessageBody() data: { id_insumo_proveedor_pk: number; dto: UpdateInsumoProveedorDto }) {
    const result = await this.insumoProveedorService.update(data.id_insumo_proveedor_pk, data.dto);
    this.server.emit('insumo-proveedor:updated', result);
    return result;
  }

  // Eliminar insumo-proveedor
  @SubscribeMessage('insumo-proveedor:remove')
  async remove(@MessageBody('id_insumo_proveedor_pk') id_insumo_proveedor_pk: number) {
    const result = await this.insumoProveedorService.remove(id_insumo_proveedor_pk);
    this.server.emit('insumo-proveedor:removed', { id_insumo_proveedor_pk });
    return result;
  }

  // Restaurar insumo-proveedor
  @SubscribeMessage('insumo-proveedor:restore')
  async restore(@MessageBody('id_insumo_proveedor_pk') id_insumo_proveedor_pk: number) {
    const result = await this.insumoProveedorService.restore(id_insumo_proveedor_pk);
    this.server.emit('insumo-proveedor:restored', result);
    return result;
  }
}