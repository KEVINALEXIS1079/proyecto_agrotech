import {
  WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UseGuards, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { PermisosService } from '../services/permisos.service';
import { CreatePermisoDto } from '../dto/create-permiso.dto';
import { TogglePermisoDto } from '../dto/toggle-permiso.dto';
import { AssignPermisosDto } from '../dto/assign-permisos.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { GetPermisosByUserDto } from '../dto/get-permisos-by-user.dto';
import { GetPermisosByRolDto } from '../dto/get-permisos-by-rol.dto';
import { ToggleUserPermDto } from '../dto/toggle-user-perm.dto';
import { ToggleRolePermDto } from '../dto/toggle-role-perm.dto';

type WsOk<T = any> = { ok: true; data?: T; message?: string };
type WsErr = { ok: false; error: string; status?: number };
type WsRes<T = any> = WsOk<T> | WsErr;

@WebSocketGateway({
  namespace: '/permisos',
  cors: { origin: '*', credentials: false },
})
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class PermisosGateway {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(PermisosGateway.name);

  constructor(private readonly permisosService: PermisosService) {}

  // === Catálogo ===
  @SubscribeMessage('find_all')
  async findAll(@MessageBody() payload?: { moduleId?: number }): Promise<WsRes> {
    this.logger.log(` WS permisos:find_all - moduleId: ${payload?.moduleId ?? 'none'}`);
    try {
      const result = await this.permisosService.findAll(payload?.moduleId);
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error(' Error listando permisos', error.stack);
      return { ok: false, error: error.message, status: error.status };
    }
  }

  // === Crear (catálogo) ===
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:create')
  @SubscribeMessage('create')
  async create(@MessageBody() createDto: CreatePermisoDto): Promise<WsRes> {
    this.logger.log(` WS permisos:create - Body: ${JSON.stringify(createDto)}`);
    try {
      const result = await this.permisosService.create(createDto);
      return { ok: true, data: result, message: 'Permiso creado exitosamente.' };
    } catch (error: any) {
      this.logger.error(' Error creando permiso', error.stack);
      return { ok: false, error: error.message, status: error.status };
    }
  }

  // === GET simples ===
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:read')
  @SubscribeMessage('get_by_user') // efectivos (rol ± directos)
  async getByUser(@MessageBody() dto: GetPermisosByUserDto): Promise<WsRes> {
    this.logger.log(`📩 WS permisos:get_by_user - Body: ${JSON.stringify(dto)}`);
    try {
      const result = await this.permisosService.getPermisosByUsuario(dto.id_usuario_pk);
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error('❌ Error get_by_user', error.stack);
      return { ok: false, error: error.message, status: error.status };
    }
  }

  // === Listas marcables para UI ===
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:read')
  @SubscribeMessage('find_by_user') // checklist por usuario
  async findByUser(@MessageBody() dto: GetPermisosByUserDto): Promise<WsRes> {
    this.logger.log(`📩 WS permisos:find_by_user - Body: ${JSON.stringify(dto)}`);
    try {
      const result = await this.permisosService.getPermisosForUserSelection(dto.id_usuario_pk, dto.moduleId);
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error('❌ Error listando permisos por usuario', error.stack);
      return { ok: false, error: error.message, status: error.status };
    }
  }

  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:read')
  @SubscribeMessage('find_by_role') // checklist por rol
  async findByRole(@MessageBody() dto: GetPermisosByRolDto): Promise<WsRes> {
    this.logger.log(`📩 WS permisos:find_by_role - Body: ${JSON.stringify(dto)}`);
    try {
      const result = await this.permisosService.getPermisosForRoleSelection(dto.id_rol_pk, dto.moduleId);
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error('❌ Error listando permisos por rol', error.stack);
      return { ok: false, error: error.message, status: error.status };
    }
  }

  // === Toggles de RELACIÓN ===
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:update')
  @SubscribeMessage('toggle_user_perm')
  async toggleUserPerm(@MessageBody() dto: ToggleUserPermDto): Promise<WsRes> {
    this.logger.log(`📩 WS permisos:toggle_user_perm - Body: ${JSON.stringify(dto)}`);
    try {
      const result = await this.permisosService.togglePermisoOnUser(dto.userId, dto.permisoId, dto.enable);
      return { ok: true, data: result, message: 'Relación usuario-permiso actualizada.' };
    } catch (error: any) {
      this.logger.error('❌ Error toggling user-perm', error.stack);
      return { ok: false, error: error.message, status: error.status };
    }
  }

  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:update')
  @SubscribeMessage('toggle_role_perm')
  async toggleRolePerm(@MessageBody() dto: ToggleRolePermDto): Promise<WsRes> {
    this.logger.log(`📩 WS permisos:toggle_role_perm - Body: ${JSON.stringify(dto)}`);
    try {
      const result = await this.permisosService.togglePermisoOnRole(dto.roleId, dto.permisoId, dto.enable);
      return { ok: true, data: result, message: 'Relación rol-permiso actualizada.' };
    } catch (error: any) {
      this.logger.error('❌ Error toggling role-perm', error.stack);
      return { ok: false, error: error.message, status: error.status };
    }
  }

  // === Asignación en bloque (opcional) ===
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:update')
  @SubscribeMessage('assign_to_role')
  async assignToRole(@MessageBody() dto: AssignPermisosDto): Promise<WsRes> {
    this.logger.log(`📩 WS permisos:assign_to_role - Body: ${JSON.stringify(dto)}`);
    try {
      const result = await this.permisosService.assignPermisosToRole(dto);
      return { ok: true, data: result, message: 'Permisos asignados al rol exitosamente.' };
    } catch (error: any) {
      this.logger.error('❌ Error asignando permisos a rol', error.stack);
      return { ok: false, error: error.message, status: error.status };
    }
  }

  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:update')
  @SubscribeMessage('assign_to_user')
  async assignToUser(@MessageBody() dto: AssignPermisosDto): Promise<WsRes> {
    this.logger.log(`📩 WS permisos:assign_to_user - Body: ${JSON.stringify(dto)}`);
    try {
      const result = await this.permisosService.assignPermisosToUser(dto);
      return { ok: true, data: result, message: 'Permisos asignados al usuario exitosamente.' };
    } catch (error: any) {
      this.logger.error('❌ Error asignando permisos a usuario', error.stack);
      return { ok: false, error: error.message, status: error.status };
    }
  }
}
