import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { SensoresService } from '../services/sensores.service';
import { CreateSensorDto } from '../dto/create-sensor.dto';
import { UpdateSensorDto } from '../dto/update-sensor.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'sensores', // opcional, pero útil para organización
})
export class SensoresGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly sensoresService: SensoresService) {}

  //  Crear
  @SubscribeMessage('sensores:create')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:create')
  async create(
    @MessageBody() dto: CreateSensorDto,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.sensoresService.create(dto);
    // Emitir a todos los clientes conectados
    this.server.emit('sensores:created', result);
    return result;
  }

  //  Obtener todos
  @SubscribeMessage('sensores:findAll')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:read')
  async findAll(@ConnectedSocket() client: Socket) {
    const result = await this.sensoresService.findAll();
    client.emit('sensores:list', result);
    return result;
  }

  //  Obtener uno
  @SubscribeMessage('sensores:findOne')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:read')
  async findOne(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.sensoresService.findOne(id);
    client.emit('sensores:detail', result);
    return result;
  }

  //  Actualizar
  @SubscribeMessage('sensores:update')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:update')
  async update(
    @MessageBody() data: { id: number; dto: UpdateSensorDto },
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.sensoresService.update(data.id, data.dto);
    this.server.emit('sensores:updated', result);
    return result;
  }

  //  Eliminar
  @SubscribeMessage('sensores:remove')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:delete')
  async remove(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.sensoresService.remove(id);
    this.server.emit('sensores:removed', result);
    return result;
  }

  //  Restaurar
  @SubscribeMessage('sensores:restore')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:update')
  async restore(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.sensoresService.restore(id);
    this.server.emit('sensores:restored', result);
    return result;
  }
}
