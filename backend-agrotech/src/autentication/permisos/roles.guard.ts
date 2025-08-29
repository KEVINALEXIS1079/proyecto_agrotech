import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesPermitidos = this.reflector.get<string[]>('roles', context.getHandler());
    if (!rolesPermitidos) return true;

    const request = context.switchToHttp().getRequest();
    const usuario = request.user;

    if (!usuario) throw new ForbiddenException('Usuario no autenticado');

    if (!rolesPermitidos.includes(usuario.rol.nombre_rol)) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }

    return true;
  }
}
