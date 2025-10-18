import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CategoriasService } from '../services/categorias.service';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';

@WebSocketGateway({
  namespace: '/categorias',
  cors: { origin: '*' },
})
export class CategoriasGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly categoriasService: CategoriasService) {}

  //  Crear categoría
  @SubscribeMessage('categorias:create')
  async create(@MessageBody() dto: CreateCategoriaDto) {
    const categoria = await this.categoriasService.create(dto);
    this.server.emit('categorias:created', categoria);
    return categoria;
  }

  //  Obtener todas las categorías
  @SubscribeMessage('categorias:findAll')
  async findAll() {
    return await this.categoriasService.findAll();
  }

  //  Obtener una categoría por ID
  @SubscribeMessage('categorias:findOne')
  async findOne(@MessageBody('id') id: number) {
    return await this.categoriasService.findOne(id);
  }

  //  Actualizar categoría
  @SubscribeMessage('categorias:update')
  async update(@MessageBody() payload: { id: number; data: UpdateCategoriaDto }) {
    const { id, data } = payload;
    const updated = await this.categoriasService.update(id, data);
    this.server.emit('categorias:updated', updated);
    return updated;
  }

  //  Eliminar categoría
  @SubscribeMessage('categorias:remove')
  async remove(@MessageBody('id') id: number) {
    const result = await this.categoriasService.remove(id);
    this.server.emit('categorias:removed', { id });
    return result;
  }

  //  Restaurar categoría
  @SubscribeMessage('categorias:restore')
  async restore(@MessageBody('id') id: number) {
    const restored = await this.categoriasService.restore(id);
    this.server.emit('categorias:restored', restored);
    return restored;
  }

  //  Eventos opcionales de conexión/desconexión
  handleConnection(client: any) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Cliente desconectado: ${client.id}`);
  }
}
