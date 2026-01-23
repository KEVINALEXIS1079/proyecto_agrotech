// src/modules/auth/api.ts
import api from "@/shared/api/client";

const HAS_PREFIX = (api.defaults.baseURL || "").includes("/api/v1");
const ep = (shortPath: string) => (HAS_PREFIX ? shortPath : `/api/v1${shortPath}`);

// =====================
// Tipos
// =====================
export type LoginResponse = {
  access_token: string;
};

export type CambiarContrasenaDTO = {
  /** Correo del usuario (mismo nombre que usa el backend) */
  email: string;
  /** Nueva contraseña */
  nuevaContrasena: string;
  /**
   * Código de verificación (opcional).
   * Si se envía => flujo de recuperación; si no => cambio normal autenticado.
   */
  codigo?: string;
};

// =====================
// Servicios
// =====================

/** Login. Devuelve el token y lo guarda en localStorage ("token"). */
export async function loginService(correo: string, password: string): Promise<string> {
  const body = { correo_usuario: correo, contrasena_usuario: password };
  const { data } = await api.post<LoginResponse>(ep("/auth/login"), body);
  const token = data?.access_token;
  if (!token) throw new Error("No se recibió access_token del servidor.");
  localStorage.setItem("token", token);
  return token;
}

/**
 * Cambiar contraseña (sirve para flujo normal y recuperación).
 * - Normal: { correo_usuario, contrasena_usuario }
 * - Recuperación: { correo_usuario, contrasena_usuario, codigo }
 */
export async function cambiarContrasena(payload: CambiarContrasenaDTO) {
  const { data } = await api.post(ep("/usuarios/cambiar-contrasena"), payload);
  return data;
}

/** Registro público con FormData (no seteamos Content-Type manualmente). */
export async function createUsuarioPublic(fd: FormData) {
  const { data, status } = await api.post(ep("/usuarios/public"), fd, {
    validateStatus: () => true,
  });
  if (status === 200 || status === 201) return data;
  const msg =
    (typeof data === "string" && data) ||
    (data as any)?.message ||
    `Error ${status} al registrar usuario (público)`;
  throw new Error(msg);
}

// =====================
// Recuperación de contraseña
// (usa los mismos nombres que el backend)
// =====================

/** Paso 1: solicitar código de recuperación. */
export async function recoverRequest(email: string) {
  const { data } = await api.post(ep("/usuarios/recuperar-contrasena"), { email });
  return data;
}

/** Paso 2: verificar código recibido por correo. */
export async function recoverVerify(email: string, codigo: string) {
  const { data } = await api.post(ep("/usuarios/verificar-codigo"), { email , codigo });
  return data;
}

/**
 * Paso 3: cambiar contraseña usando el código (envoltura de cambiarContrasena).
 * Equivalente a llamar cambiarContrasena({ correo_usuario, contrasena_usuario, codigo })
 */
export async function recoverChange(
  email: string,
  nuevaContrasena: string,
  codigo: string
) {
  return cambiarContrasena({
    email,
    nuevaContrasena,
    codigo,
  });
}
