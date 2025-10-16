import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { TipoSensorService } from '../services/tipo-sensor.service';
import { CreateTipoSensorDto } from '../dto/create-tipo-sensor.dto';
import { UpdateTipoSensorDto } from '../dto/update-tipo-sensor.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'tipo-sensor', // opcional, puedes omitirlo
})
export class TipoSensorGateway {
  constructor(private readonly tipoSensorService: TipoSensorService) {}

  //  Crear
  @SubscribeMessage('tipo-sensor:create')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:create')
  async create(
    @MessageBody() dto: CreateTipoSensorDto,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.tipoSensorService.create(dto);
    client.emit('tipo-sensor:created', result);
    return result;
  }

  //  Obtener todos
  @SubscribeMessage('tipo-sensor:findAll')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:read')
  async findAll(@ConnectedSocket() client: Socket) {
    const result = await this.tipoSensorService.findAll();
    client.emit('tipo-sensor:list', result);
    return result;
  }

  //  Obtener uno
  @SubscribeMessage('tipo-sensor:findOne')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:read')
  async findOne(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.tipoSensorService.findOne(id);
    client.emit('tipo-sensor:detail', result);
    return result;
  }

  //  Actualizar
  @SubscribeMessage('tipo-sensor:update')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:update')
  async update(
    @MessageBody() data: { id: number; dto: UpdateTipoSensorDto },
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.tipoSensorService.update(data.id, data.dto);
    client.emit('tipo-sensor:updated', result);
    return result;
  }

  //  Eliminar
  @SubscribeMessage('tipo-sensor:remove')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:delete')
  async remove(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.tipoSensorService.remove(id);
    client.emit('tipo-sensor:removed', result);
    return result;
  }

  //  Restaurar
  @SubscribeMessage('tipo-sensor:restore')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:update')
  async restore(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.tipoSensorService.restore(id);
    client.emit('tipo-sensor:restored', result);
    return result;
  }
}
