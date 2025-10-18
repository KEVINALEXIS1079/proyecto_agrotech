import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { SensoresService } from '../services/sensores.service';
import { CreateSensorDto } from '../dto/create-sensor.dto';
import { UpdateSensorDto } from '../dto/update-sensor.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'sensores',
})
export class SensoresGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly sensoresService: SensoresService) {}

  // =========================
  // Crear sensor
  // =========================
  @SubscribeMessage('sensores:create')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(
    @MessageBody() dto: CreateSensorDto,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.sensoresService.create(dto);
    this.server.emit('sensores:created', result);
    return result;
  }

  // =========================
  // Obtener todos los sensores
  // =========================
  @SubscribeMessage('sensores:findAll')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  async findAll(@ConnectedSocket() client: Socket) {
    const result = await this.sensoresService.findAll();
    client.emit('sensores:list', result);
    return result;
  }

  // =========================
  // Obtener un sensor por ID
  // =========================
  @SubscribeMessage('sensores:findOne')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  async findOne(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    if (!id) throw new BadRequestException('El id del sensor es obligatorio');
    const result = await this.sensoresService.findOne(id);
    client.emit('sensores:detail', result);
    return result;
  }

  // =========================
  // Actualizar sensor
  // =========================
  @SubscribeMessage('sensores:update')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @MessageBody() data: { id: number } & Partial<UpdateSensorDto>,
    @ConnectedSocket() client: Socket,
  ) {
    if (!data || !data.id) {
      throw new BadRequestException('El id del sensor es obligatorio');
    }

    // Extraemos id y dto
    const { id, ...dto } = data;

    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Se requiere al menos un campo para actualizar');
    }

    const result = await this.sensoresService.update(id, dto);
    this.server.emit('sensores:updated', result);
    return result;
  }

  // =========================
  // Eliminar sensor
  // =========================
  @SubscribeMessage('sensores:remove')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  async remove(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    if (!id) throw new BadRequestException('El id del sensor es obligatorio');
    const result = await this.sensoresService.remove(id);
    this.server.emit('sensores:removed', result);
    return result;
  }

  // =========================
  // Restaurar sensor
  // =========================
  @SubscribeMessage('sensores:restore')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  async restore(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    if (!id) throw new BadRequestException('El id del sensor es obligatorio');
    const result = await this.sensoresService.restore(id);
    this.server.emit('sensores:restored', result);
    return result;
  }
}
