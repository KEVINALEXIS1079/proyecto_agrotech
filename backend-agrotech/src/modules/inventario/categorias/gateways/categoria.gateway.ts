import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { CategoriasService } from '../services/categorias.service';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

@WebSocketGateway({
  namespace: '/categorias',
  cors: {
    origin: '*',
  },
})
export class CategoriasGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly categoriasService: CategoriasService) {}

  /**
   * Crea una nueva categoría en el sistema.
   * Evento de entrada: 'categorias:create'
   * Evento de difusión: 'categorias:created'
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:categorias:create')
  @SubscribeMessage('categorias:create')
  async create(@MessageBody() dto: CreateCategoriaDto, @ConnectedSocket() client: Socket) {
    const categoria = await this.categoriasService.create(dto);
    this.server.emit('categorias:created', categoria);
    return categoria;
  }

  /**
   * Devuelve la lista completa de categorías.
   * Evento de entrada: 'categorias:findAll'
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:categorias:read')
  @SubscribeMessage('categorias:findAll')
  async findAll() {
    return await this.categoriasService.findAll();
  }

  /**
   * Obtiene una categoría por su ID.
   * Evento de entrada: 'categorias:findOne'
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:categorias:read')
  @SubscribeMessage('categorias:findOne')
  async findOne(@MessageBody('id') id: number) {
    return await this.categoriasService.findOne(id);
  }

  /**
   * Actualiza los datos de una categoría existente.
   * Evento de entrada: 'categorias:update'
   * Evento de difusión: 'categorias:updated'
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:categorias:update')
  @SubscribeMessage('categorias:update')
  async update(@MessageBody() payload: { id: number; data: UpdateCategoriaDto }) {
    const { id, data } = payload;
    const updated = await this.categoriasService.update(id, data);
    this.server.emit('categorias:updated', updated);
    return updated;
  }

  /**
   * Elimina una categoría del sistema.
   * Evento de entrada: 'categorias:remove'
   * Evento de difusión: 'categorias:removed'
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:categorias:delete')
  @SubscribeMessage('categorias:remove')
  async remove(@MessageBody('id') id: number) {
    const result = await this.categoriasService.remove(id);
    this.server.emit('categorias:removed', { id });
    return result;
  }

  /**
   * Restaura una categoría previamente eliminada.
   * Evento de entrada: 'categorias:restore'
   * Evento de difusión: 'categorias:restored'
   */
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:categorias:update')
  @SubscribeMessage('categorias:restore')
  async restore(@MessageBody('id') id: number) {
    const restored = await this.categoriasService.restore(id);
    this.server.emit('categorias:restored', restored);
    return restored;
  }

  /**
   * Evento ejecutado al establecer una nueva conexión WebSocket.
   */
  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  /**
   * Evento ejecutado al desconectarse un cliente WebSocket.
   */
  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }
}
