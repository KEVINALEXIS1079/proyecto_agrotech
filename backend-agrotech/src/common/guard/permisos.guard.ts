import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermiso = this.reflector.get<string>('permiso', context.getHandler());
    const type = context.getType<'http' | 'ws' | 'rpc'>();

    // --- Obtener usuario del contexto ---
    let user: any;
    if (type === 'ws') {
      user = context.switchToWs().getClient()?.handshake?.user;
    } else {
      user = context.switchToHttp().getRequest()?.user;
    }

    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado.');
    }

    const rol = user.rol?.nombre_rol || user.rol;

    // --- Rol administrador tiene acceso total ---
    if (rol === 'Administrador') {
      return true;
    }

    // --- Si no se requiere permiso específico, permitir ---
    if (!requiredPermiso) return true;

    // --- Validar permisos ---
    const permisos = user.permisos || [];
    const tienePermiso = permisos.some((permiso: any) => {
      const permisoStr =
        typeof permiso === 'string'
          ? permiso
          : permiso.permisoCompleto || `${permiso.modulo}:${permiso.accion}`;
      return permisoStr === requiredPermiso;
    });

    if (!tienePermiso) {
      throw new ForbiddenException('No tienes permiso para acceder a este recurso.');
    }

    return true;
  }
}
