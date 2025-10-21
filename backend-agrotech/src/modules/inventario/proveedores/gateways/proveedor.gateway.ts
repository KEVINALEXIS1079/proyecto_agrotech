// src/modules/inventario/proveedores/gateways/proveedor.gateway.ts
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

  handleConnection(_client: Socket) {}
  handleDisconnect(_client: Socket) {}

  @SubscribeMessage('proveedores:create')
  async create(@MessageBody() dto: CreateProveedorDto) {
    const result = await this.proveedoresService.create(dto);
    this.server.emit('proveedores:created', result.data);
    return result;
  }

  @SubscribeMessage('proveedores:findAll')
  async findAll(@ConnectedSocket() client: Socket) {
    const result = await this.proveedoresService.findAll();
    client.emit('proveedores:list', result);
    return result;
  }

  @SubscribeMessage('proveedores:findOne')
  async findOne(@MessageBody('id_proveedor_pk') id: number, @ConnectedSocket() client: Socket) {
    const result = await this.proveedoresService.findOne(id);
    client.emit('proveedores:detail', result);
    return result;
  }

  @SubscribeMessage('proveedores:update')
  async update(@MessageBody() data: { id_proveedor_pk: number; dto: UpdateProveedorDto }) {
    const result = await this.proveedoresService.update(data.id_proveedor_pk, data.dto);
    this.server.emit('proveedores:updated', result.data);
    return result;
  }

  @SubscribeMessage('proveedores:remove')
  async remove(@MessageBody('id_proveedor_pk') id: number) {
    const result = await this.proveedoresService.remove(id);
    this.server.emit('proveedores:removed', { id_proveedor_pk: id });
    return result;
  }

  @SubscribeMessage('proveedores:restore')
  async restore(@MessageBody('id_proveedor_pk') id: number) {
    const result = await this.proveedoresService.restore(id);
    this.server.emit('proveedores:restored', result.data);
    return result;
  }
}
