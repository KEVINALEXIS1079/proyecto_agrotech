import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TipoSensorService } from '../services/tipo-sensor.service';
import { CreateTipoSensorDto } from '../dto/create-tipo-sensor.dto';
import { UpdateTipoSensorDto } from '../dto/update-tipo-sensor.dto';

/**
 * Gateway para comunicación en tiempo real de TipoSensor.
 * Emite eventos a los clientes cuando ocurren cambios en los tipos de sensor.
 */
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'tipo-sensor',
})
export class TipoSensorGateway {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly tipoSensorService: TipoSensorService) {}

  /**
   * Notifica a todos los clientes conectados que hubo un cambio en los tipos de sensor.
   * @param action - tipo de acción ('create' | 'update' | 'delete' | 'restore')
   * @param payload - datos opcionales del cambio
   */
  public notifyChanges(action: string, payload?: any): void {
    this.server.emit('tipo-sensor:changes-detected', {
      action,
      data: payload || null,
      timestamp: new Date(),
    });
  }

  /** Crear tipo de sensor (evento socket) */
  @SubscribeMessage('tipo-sensor:create')
  async create(@MessageBody() dto: CreateTipoSensorDto) {
    const result = await this.tipoSensorService.create(dto);
    this.notifyChanges('create', result);
    return result;
  }

  /** Actualizar tipo de sensor (evento socket) */
  @SubscribeMessage('tipo-sensor:update')
  async update(@MessageBody() data: { id: number; dto: UpdateTipoSensorDto }) {
    const result = await this.tipoSensorService.update(data.id, data.dto);
    this.notifyChanges('update', result);
    return result;
  }

  /** Eliminar tipo de sensor (evento socket) */
  @SubscribeMessage('tipo-sensor:remove')
  async remove(@MessageBody('id') id: number) {
    const result = await this.tipoSensorService.remove(id);
    this.notifyChanges('delete', { id });
    return result;
  }

  /** Restaurar tipo de sensor (evento socket) */
  @SubscribeMessage('tipo-sensor:restore')
  async restore(@MessageBody('id') id: number) {
    const result = await this.tipoSensorService.restore(id);
    this.notifyChanges('restore', { id });
    return result;
  }
}
