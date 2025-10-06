import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermiso = this.reflector.get<string>('permiso', context.getHandler());

    const controllerName = context.getClass().name;
    const methodName = context.getHandler().name;

    // Log condicional
    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
      console.log('=== PERMISOS GUARD DEBUG ===');
      console.log('Controller:', controllerName);
      console.log('Método:', methodName);
      console.log('Permiso requerido:', requiredPermiso);
    }

    // Si no hay permiso requerido, permite el acceso
    if (!requiredPermiso) {
      if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
        console.log('✅ No hay permiso requerido - ACCESO PERMITIDO');
        console.log('=== FIN DEBUG ===');
      }
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Log condicional
    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
      console.log('👤 Usuario del request:', user ? 'DEFINIDO' : 'UNDEFINED');
    }

    if (!user) {
      // Lanzar excepción personalizada para no autenticado
      throw new UnauthorizedException('Usuario no autenticado. Por favor, inicia sesión.');
    }

    // Admin siempre tiene acceso
    const rol = user.rol?.nombre_rol || user.rol;
    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
      console.log('🎭 Rol del usuario:', rol);
    }

    if (rol === 'Administrador') {
      if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
        console.log('✅ Usuario es Administrador - ACCESO PERMITIDO');
        console.log('=== FIN DEBUG ===');
      }
      return true;
    }

    // Verificar permisos
    if (user.permisos && Array.isArray(user.permisos)) {
      if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
        console.log('📋 Permisos disponibles:', user.permisos.length, 'permisos');
        console.log('🔍 Buscando permiso requerido...');
      }

      const tienePermiso = user.permisos.some((permiso: any) => {
        const permisoStr = typeof permiso === 'string' 
          ? permiso 
          : permiso.permisoCompleto || `${permiso.modulo}:${permiso.accion}`;
        
        const coincide = permisoStr === requiredPermiso;
        if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
          console.log(`   ➡️ "${permisoStr}" === "${requiredPermiso}" -> ${coincide}`);
        }
        return coincide;
      });

      if (tienePermiso) {
        if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
          console.log('✅ Permiso encontrado - ACCESO PERMITIDO');
          console.log('=== FIN DEBUG ===');
        }
        return true;
      } else {
        // Lanzar excepción personalizada para permiso denegado
        throw new ForbiddenException('No tienes permiso para acceder a este recurso.');
      }
    } else {
      throw new ForbiddenException('No tienes permisos disponibles.');
    }
  }
}