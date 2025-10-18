import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
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
  namespace: 'tipo-sensor',
})
export class TipoSensorGateway {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly tipoSensorService: TipoSensorService) {}

  public notifyChanges(): void {
    this.server.emit('tipo-sensor:changes-detected');
  }

  @SubscribeMessage('tipo-sensor:create')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:create')
  async create(@MessageBody() dto: CreateTipoSensorDto) {
    const result = await this.tipoSensorService.create(dto);
    this.notifyChanges();
    return result;
  }

  @SubscribeMessage('tipo-sensor:update')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:update')
  async update(@MessageBody() data: { id: number; dto: UpdateTipoSensorDto }) {
    const result = await this.tipoSensorService.update(data.id, data.dto);
    this.notifyChanges();
    return result;
  }

  @SubscribeMessage('tipo-sensor:remove')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:delete')
  async remove(@MessageBody('id') id: number) {
    const result = await this.tipoSensorService.remove(id);
    this.notifyChanges();
    return result;
  }

  @SubscribeMessage('tipo-sensor:restore')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:update')
  async restore(@MessageBody('id') id: number) {
    const result = await this.tipoSensorService.restore(id);
    this.notifyChanges();
    return result;
  }
}