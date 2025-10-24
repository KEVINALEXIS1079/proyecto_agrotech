// src/modules/iot/sensores/gateways/sensor.gateway.ts
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { SensoresService } from '../services/sensores.service';
import { CreateSensorDto } from '../dto/create-sensor.dto';
import { UpdateSensorDto } from '../dto/update-sensor.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'sensores',
})
export class SensoresGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly sensoresService: SensoresService) {}

  @OnEvent('sensor.updated')
  handleSensorUpdate(sensor: any) {
    this.server.emit('sensores:updated', sensor);
  }

  @SubscribeMessage('sensores:create')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@MessageBody() dto: CreateSensorDto) {
    const result = await this.sensoresService.create(dto);
    this.server.emit('sensores:created', result);
    return result;
  }

  @SubscribeMessage('sensores:findAll')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  async findAll(@ConnectedSocket() client: Socket) {
    const result = await this.sensoresService.findAll();
    client.emit('sensores:list', result);
    return result;
  }

  @SubscribeMessage('sensores:findOne')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  async findOne(@MessageBody('id') id: number) {
    if (!id) throw new BadRequestException('El id del sensor es obligatorio');
    return this.sensoresService.findOne(id);
  }

  @SubscribeMessage('sensores:update')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(@MessageBody() data: { id: number } & Partial<UpdateSensorDto>) {
    if (!data || !data.id) throw new BadRequestException('El id del sensor es obligatorio');
    if (Object.keys(data).length === 1)
      throw new BadRequestException('Se requiere al menos un campo para actualizar');

    const { id, ...dto } = data;
    const result = await this.sensoresService.update(id, dto);
    this.server.emit('sensores:updated', result);
    return result;
  }

  @SubscribeMessage('sensores:remove')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  async remove(@MessageBody('id') id: number) {
    if (!id) throw new BadRequestException('El id del sensor es obligatorio');
    await this.sensoresService.remove(id);
    this.server.emit('sensores:removed', { id });
    return { id };
  }

  @SubscribeMessage('sensores:restore')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  async restore(@MessageBody('id') id: number) {
    if (!id) throw new BadRequestException('El id del sensor es obligatorio');
    const restored = await this.sensoresService.restore(id);
    this.server.emit('sensores:restored', restored);
    return restored;
  }



  @SubscribeMessage('sensores:historial')
@UseGuards(JwtAuthGuard, PermisosGuard)
async findHistorial(
  @MessageBody('id') id: number,
  @ConnectedSocket() client: Socket,
) {
  if (!id) throw new BadRequestException('El id del sensor es obligatorio');

  const historial = await this.sensoresService.findHistorial(id);
  client.emit('sensores:historial', historial);
  return historial;
}

}
