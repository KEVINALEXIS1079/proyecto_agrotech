import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesPermitidos = this.reflector.get<string[]>('roles', context.getHandler());
    if (!rolesPermitidos) return true;

    const type = context.getType<'http' | 'ws' | 'rpc'>();

    const usuario =
      type === 'ws'
        ? context.switchToWs().getClient()?.handshake?.user
        : context.switchToHttp().getRequest()?.user;

    if (!usuario) throw new ForbiddenException('Usuario no autenticado');

    const rol = usuario.rol?.nombre_rol || usuario.rol;

    if (!rolesPermitidos.includes(rol)) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }

    return true;
  }
}
