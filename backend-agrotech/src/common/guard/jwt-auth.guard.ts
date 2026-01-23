import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

/**
 * Este guard extiende Passport (estrategia 'jwt') y permite autenticación
 * tanto en HTTP como en WebSocket, usando el token JWT.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const type = context.getType<'http' | 'ws' | 'rpc'>();

    if (type === 'ws') {
      // --- CONTEXTO WEBSOCKET ---
      const client = context.switchToWs().getClient<any>();
      const handshake = client?.handshake || {};

      // Normalizamos headers
      handshake.headers = handshake.headers || {};

      // Token puede venir en handshake.auth.token (socket.io v4)
      const authToken: string | undefined = handshake?.auth?.token;

      if (authToken && !handshake.headers.authorization) {
        handshake.headers.authorization = authToken.startsWith('Bearer ')
          ? authToken
          : `Bearer ${authToken}`;
      }

      // Passport leerá authorization del header
      return handshake;
    }

    // --- CONTEXTO HTTP ---
    return context.switchToHttp().getRequest();
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      let msg = 'No se encontró token. Por favor, inicia sesión.';

      if (info) {
        if (info.name === 'TokenExpiredError')
          msg = 'Token expirado. Por favor, inicia sesión nuevamente.';
        else if (info.name === 'JsonWebTokenError')
          msg = 'Token inválido. Verifica el token proporcionado.';
      }

      throw new UnauthorizedException(msg);
    }

    // --- Adjuntar usuario al contexto para otros guards ---
    const type = context.getType<'http' | 'ws' | 'rpc'>();

    if (type === 'ws') {
      const client = context.switchToWs().getClient<any>();
      if (client?.handshake) client.handshake.user = user;
    } else if (type === 'http') {
      const req = context.switchToHttp().getRequest();
      req.user = user;
    }

    return user;
  }
}
