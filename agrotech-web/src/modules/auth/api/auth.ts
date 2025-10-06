import api from "@/shared/api/client";

const HAS_PREFIX = (api.defaults.baseURL || "").includes("/api/v1");
const ep = (shortPath: string) => (HAS_PREFIX ? shortPath : `/api/v1${shortPath}`);

// ======== Servicios ========
export async function loginService(correo: string, password: string) {
  const body = { correo_usuario: correo, contrasena_usuario: password };
  const { data } = await api.post(ep("/auth/login"), body, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });
  const token = data?.access_token;
  if (!token) throw new Error("No se recibió access_token del servidor.");
  return token as string;
}

export type CambiarContrasenaDTO = {
  correo_usuario: string;
  contrasena_usuario: string;
  codigo?: string;
};

export async function cambiarContrasena(payload: CambiarContrasenaDTO) {
  const { data } = await api.post(ep("/usuarios/cambiar-contrasena"), payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

export async function createUsuarioPublic(fd: FormData) {
  const { data, status } = await api.post(ep("/usuarios/public"), fd, { validateStatus: () => true });
  if (status === 200 || status === 201) return data;
  const msg = (typeof data === "string" && data) || data?.message || `Error ${status} al registrar usuario (público)`;
  throw new Error(msg);
}

// ======== Recuperación ========
// Ajusta estos endpoints si tu backend usa otros nombres
export async function recoverRequest(email: string) {
  const { data } = await api.post(ep("/usuarios/recuperar-contrasena"), { email });
  return data;
}

export async function recoverVerify(email: string, codigo: string) {
  const { data } = await api.post(ep("/usuarios/verificar-codigo"), { email, codigo });
  return data;
}

export async function recoverChange(email: string, nuevaContrasena: string, codigo: string) {
  const { data } = await api.post(ep("/usuarios/cambiar-contrasena"), { email, nuevaContrasena, codigo });
  return data;
}
