import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AlmacenesService } from '../services/almacenes.service';
import { CreateAlmacenDto } from '../dto/create-almacen.dto';
import { UpdateAlmacenDto } from '../dto/update-almacen.dto';

@WebSocketGateway({
  namespace: '/almacenes',
  cors: { origin: '*' },
})
export class AlmacenesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly almacenService: AlmacenesService) {}

  //  Crear almacén (sin permisos)
  @SubscribeMessage('almacenes:create')
  async create(@MessageBody() dto: CreateAlmacenDto) {
    const almacen = await this.almacenService.create(dto);
    this.server.emit('almacenes:created', almacen);
    return almacen;
  }

  //  Obtener todos los almacenes
  @SubscribeMessage('almacenes:findAll')
  async findAll() {
    return await this.almacenService.findAll();
  }

  //  Obtener un almacén por ID
  @SubscribeMessage('almacenes:findOne')
  async findOne(@MessageBody('id') id: number) {
    return await this.almacenService.findOne(id);
  }

  //  Actualizar un almacén
  @SubscribeMessage('almacenes:update')
  async update(@MessageBody() payload: { id: number; data: UpdateAlmacenDto }) {
    const { id, data } = payload;
    const updated = await this.almacenService.update(id, data);
    this.server.emit('almacenes:updated', updated);
    return updated;
  }

  //  Eliminar un almacén
  @SubscribeMessage('almacenes:remove')
  async remove(@MessageBody('id') id: number) {
    const result = await this.almacenService.remove(id);
    this.server.emit('almacenes:removed', { id });
    return result;
  }

  //  Restaurar un almacén
  @SubscribeMessage('almacenes:restore')
  async restore(@MessageBody('id') id: number) {
    const restored = await this.almacenService.restore(id);
    this.server.emit('almacenes:restored', restored);
    return restored;
  }

  //  Eventos opcionales de conexión
  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }
}
