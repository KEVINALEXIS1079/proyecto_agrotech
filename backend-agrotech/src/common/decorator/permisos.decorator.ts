// permisos.decorator.ts
import { SetMetadata } from '@nestjs/common';

/**
 * Decorador para marcar un handler (endpoint) con un permiso requerido.
 * 
 * Ejemplo de uso:
 *   @PermisoRequerido('iot:sensores:read')
 *   @PermisoRequerido('usuario:usuarios:create')
 */
export const PERMISO_KEY = 'permiso';
export const PermisoRequerido = (permiso: string) =>
  SetMetadata(PERMISO_KEY, permiso);
