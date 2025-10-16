import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsuariosService } from '../services/usuarios.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { RegistrarUsuarioPublicDTO } from '../dto/crear-usuario-public.dto';
import { CambiarContrasenaDto } from '../dto/cambiar-contrasena.dto';
import { RecuperarContrasenaDto } from '../dto/recuperar-contrasena.dto';
import { VerificarCodigoDto } from '../dto/verificar-codigo.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import * as fs from 'fs';
import * as path from 'path';

type WsOk<T = any> = { ok: true; data?: T; message?: string };
type WsErr = { ok: false; error: string; status?: number };
type WsRes<T = any> = WsOk<T> | WsErr;

function saveBase64Image(
  base64?: string,
  folder = 'usuarios',
  fileNamePrefix = 'img',
): string | undefined {
  if (!base64) return undefined;
  const match = base64.match(/^data:(.+);base64,(.+)$/);
  const buffer = Buffer.from(match ? match[2] : base64, 'base64');
  const uploadsDir = path.resolve(process.cwd(), 'uploads', folder);
  fs.mkdirSync(uploadsDir, { recursive: true });
  const fileName = `${fileNamePrefix}-${Date.now()}.png`;
  const filePath = path.join(uploadsDir, fileName);
  fs.writeFileSync(filePath, buffer);
  return path.relative(process.cwd(), filePath).replace(/\\/g, '/');
}

@WebSocketGateway({
  namespace: '/usuarios',
  cors: { origin: '*', credentials: false },
})
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class UsuariosGateway {
  @WebSocketServer() server: Server;
  constructor(private readonly usuariosService: UsuariosService) {}

  public notifyUsersListChanged() {
    this.server.emit('usuarios:lista_actualizada');
  }

  public notifyProfileChanged(userId: number) {
    this.server.to(`user_${userId}`).emit('usuarios:perfil_actualizado');
  }

  // === Público ===
  @SubscribeMessage('create_public')
  async createPublic(
    @MessageBody() payload: { dto: RegistrarUsuarioPublicDTO; imgBase64?: string },
  ): Promise<WsRes> {
    try {
      const imgPath = saveBase64Image(payload?.imgBase64, 'usuarios', payload?.dto?.correo_usuario || 'img');
      const res = await this.usuariosService.createPublic(payload.dto, imgPath);
      return { ok: true, data: res, message: 'Usuario creado correctamente con rol: Invitado' };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error creando usuario público', status: e?.status };
    }
  }

  // === Protegidos (JWT + permisos) ===
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:create')
  @SubscribeMessage('create')
  async create(
    @MessageBody() payload: { dto: CreateUsuarioDto; imgBase64?: string },
    @ConnectedSocket() _client: Socket,
  ): Promise<WsRes> {
    try {
      const imgPath = saveBase64Image(payload?.imgBase64, 'usuarios', payload?.dto?.correo_usuario || 'img');
      const res = await this.usuariosService.create(payload.dto, imgPath);
      this.notifyUsersListChanged();
      return { ok: true, data: res, message: 'Usuario creado correctamente' };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error creando usuario', status: e?.status };
    }
  }

  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:read')
  @SubscribeMessage('find_all')
  async findAll(): Promise<WsRes> {
    try {
      const list = await this.usuariosService.findAll();
      return { ok: true, data: list };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error listando usuarios', status: e?.status };
    }
  }

  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:read')
  @SubscribeMessage('find_one')
  async findOne(@MessageBody() payload: { id: number }): Promise<WsRes> {
    try {
      const user = await this.usuariosService.findOne(payload.id, [
        'permisos', 'permisos.module', 'rol', 'rol.permisos', 'rol.permisos.module',
      ]);
      return { ok: true, data: user };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Usuario no encontrado', status: e?.status };
    }
  }

  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:update')
  @SubscribeMessage('update')
  async update(
    @MessageBody() payload: { id: number; dto: UpdateUsuarioDto; imgBase64?: string },
  ): Promise<WsRes> {
    try {
      const imgPath = saveBase64Image(payload?.imgBase64, 'usuarios', payload?.dto?.correo_usuario || 'img');
      const updated = await this.usuariosService.update(payload.id, payload.dto, imgPath);
      this.notifyUsersListChanged();
      this.notifyProfileChanged(payload.id);
      return { ok: true, data: updated };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error actualizando usuario', status: e?.status };
    }
  }

  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:delete')
  @SubscribeMessage('remove')
  async remove(@MessageBody() payload: { id: number }): Promise<WsRes> {
    try {
      const res = await this.usuariosService.remove(payload.id);
      this.notifyUsersListChanged();
      return { ok: true, data: res, message: `Usuario con ID ${payload.id} eliminado correctamente` };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error eliminando usuario', status: e?.status };
    }
  }

  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:update')
  @SubscribeMessage('restore')
  async restore(@MessageBody() payload: { id: number }): Promise<WsRes> {
    try {
      const res = await this.usuariosService.restore(payload.id);
      this.notifyUsersListChanged();
      return { ok: true, data: res, message: `Usuario con ID ${payload.id} restaurado correctamente` };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error restaurando usuario', status: e?.status };
    }
  }

  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:update')
  @SubscribeMessage('asignar_permisos')
  async asignarPermisos(
    @MessageBody() payload: { id: number; permisosIds: number[] },
  ): Promise<WsRes> {
    try {
      const res = await this.usuariosService.asignarPermisos(payload.id, payload.permisosIds);
      this.notifyProfileChanged(payload.id);
      return { ok: true, data: res, message: 'Permisos asignados' };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error asignando permisos', status: e?.status };
    }
  }

  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:update')
  @SubscribeMessage('quitar_permisos')
  async quitarPermisos(
    @MessageBody() payload: { id: number; permisosIds: number[] },
  ): Promise<WsRes> {
    try {
      const res = await this.usuariosService.quitarPermisos(payload.id, payload.permisosIds);
      this.notifyProfileChanged(payload.id);
      return { ok: true, data: res, message: 'Permisos quitados' };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error quitando permisos', status: e?.status };
    }
  }

  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:update')
  @SubscribeMessage('asignar_rol')
  async asignarRol(@MessageBody() payload: { id: number; rolId: number }): Promise<WsRes> {
    try {
      const res = await this.usuariosService.asignarRol(payload.id, payload.rolId);
      this.notifyProfileChanged(payload.id);
      return { ok: true, data: res, message: 'Rol asignado' };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error asignando rol', status: e?.status };
    }
  }

  // === Flujo recuperación ===
  @SubscribeMessage('recuperar_contrasena')
  async recuperarContrasena(@MessageBody() dto: RecuperarContrasenaDto): Promise<WsRes> {
    try {
      const res = await this.usuariosService.recuperarContrasena(dto);
      return { ok: true, data: res, message: 'Código de verificación enviado' };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error en recuperación', status: e?.status };
    }
  }

  @SubscribeMessage('verificar_codigo')
  async verificarCodigo(@MessageBody() dto: VerificarCodigoDto): Promise<WsRes> {
    try {
      const res = await this.usuariosService.verificarCodigo(dto);
      return { ok: true, data: res, message: 'Código verificado' };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Código inválido', status: e?.status };
    }
  }

  @SubscribeMessage('cambiar_contrasena')
  async cambiarContrasena(@MessageBody() dto: CambiarContrasenaDto): Promise<WsRes> {
    try {
      const res = await this.usuariosService.cambiarContrasena(dto);
      return { ok: true, data: res, message: 'Contraseña cambiada correctamente' };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error cambiando contraseña', status: e?.status };
    }
  }
}