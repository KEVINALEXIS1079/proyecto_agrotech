import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
      console.log('🔐 JwtAuthGuard ejecutándose...');
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'];
      console.log('🔍 Cabecera Authorization:', authHeader ? authHeader : 'Ausente');
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
      console.log('🔐 JwtAuthGuard - handleRequest');
      console.log('Usuario autenticado:', !!user);
      console.log('Error:', err?.message || 'No auth token');
      console.log('Info:', info ? info.message : 'Sin información adicional');
    }

    if (err || !user) {
      let errorMessage = 'No auth token. Por favor, inicia sesión.';
      if (info) {
        if (info.name === 'TokenExpiredError') {
          errorMessage = 'Token expirado. Por favor, inicia sesión nuevamente.';
        } else if (info.name === 'JsonWebTokenError') {
          errorMessage = 'Token inválido. Verifica el token proporcionado.';
        }
      }
      throw new UnauthorizedException(errorMessage);
    }

    const request = context.switchToHttp().getRequest();
    request.user = user;
    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
      console.log('✅ Usuario adjuntado al request:', request.user);
    }

    return user;
  }
}