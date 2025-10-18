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
import { ProveedoresService } from '../services/proveedores.service';
import { CreateProveedorDto } from '../dto/create-proveedor.dto';
import { UpdateProveedorDto } from '../dto/update-proveedor.dto';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/proveedores',
})
export class ProveedoresGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly proveedoresService: ProveedoresService) {}

  // Verificar conexiones
  handleConnection(client: Socket) {}

  handleDisconnect(client: Socket) {}

  // Crear proveedor
  @SubscribeMessage('proveedores:create')
  async create(
    @MessageBody() dto: CreateProveedorDto,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.proveedoresService.create(dto);
    this.server.emit('proveedores:created', result);
    return result;
  }

  // Obtener todos los proveedores
  @SubscribeMessage('proveedores:findAll')
  async findAll(@ConnectedSocket() client: Socket) {
    const result = await this.proveedoresService.findAll();
    client.emit('proveedores:list', result);
    return result;
  }

  // Obtener un proveedor
  @SubscribeMessage('proveedores:findOne')
  async findOne(
    @MessageBody('id_proveedor_pk') id_proveedor_pk: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.proveedoresService.findOne(id_proveedor_pk);
    client.emit('proveedores:detail', result);
    return result;
  }

  // Actualizar proveedor
  @SubscribeMessage('proveedores:update')
  async update(@MessageBody() data: { id_proveedor_pk: number; dto: UpdateProveedorDto }) {
    const result = await this.proveedoresService.update(data.id_proveedor_pk, data.dto);
    this.server.emit('proveedores:updated', result);
    return result;
  }

  // Eliminar proveedor
  @SubscribeMessage('proveedores:remove')
  async remove(@MessageBody('id_proveedor_pk') id_proveedor_pk: number) {
    const result = await this.proveedoresService.remove(id_proveedor_pk);
    this.server.emit('proveedores:removed', { id_proveedor_pk });
    return result;
  }

  // Restaurar proveedor
  @SubscribeMessage('proveedores:restore')
  async restore(@MessageBody('id_proveedor_pk') id_proveedor_pk: number) {
    const result = await this.proveedoresService.restore(id_proveedor_pk);
    this.server.emit('proveedores:restored', result);
    return result;
  }
}