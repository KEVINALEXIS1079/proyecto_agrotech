import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class TokenRedisService implements OnModuleInit {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  private getTokenKey(token: string): string {
    return `jwt:token:${token}`;
  }

  private getBlacklistKey(token: string): string {
    return `jwt:blacklist:${token}`;
  }

  /**
   * 🔹 Verifica conexión a Redis al iniciar el módulo
   */
  async onModuleInit() {
    try {
      const pong = await this.redis.ping();
      console.log(`Conectado a Redis (${process.env.REDIS_HOST}:${process.env.REDIS_PORT}) → Respuesta: ${pong}`);
    } catch (err) {
      console.error('No se pudo conectar a Redis:', err.message);
    }
  }

  /**
   * 🔹 Guarda el token en Redis con expiración (TTL)
   */
  async storeToken(token: string, expiresInSeconds: number): Promise<void> {
    const key = this.getTokenKey(token);
    console.log(`Guardando token en Redis: ${key}`);
    await this.redis.set(key, 'valid', 'EX', expiresInSeconds);
  }

  /**
   * 🔹 Mueve el token a la blacklist (logout)
   */
  async addToBlacklist(token: string, expiresInSeconds: number): Promise<void> {
    const key = this.getBlacklistKey(token);
    console.log(`Añadiendo token a blacklist: ${key}`);
    await this.redis.set(key, 'blacklisted', 'EX', expiresInSeconds);
  }

  /**
   * 🔹 Verifica si el token está en la blacklist
   */
  async isBlacklisted(token: string): Promise<boolean> {
    const result = await this.redis.get(this.getBlacklistKey(token));
    return result === 'blacklisted';
  }

  /**
   * 🔹 Verifica si el token sigue activo
   */
  async isActive(token: string): Promise<boolean> {
    const result = await this.redis.get(this.getTokenKey(token));
    return result === 'valid';
  }

  /**
   * 🔹 Elimina el token activo (cuando se desloguea)
   */
  async deleteToken(token: string): Promise<void> {
    await this.redis.del(this.getTokenKey(token));
  }
}
