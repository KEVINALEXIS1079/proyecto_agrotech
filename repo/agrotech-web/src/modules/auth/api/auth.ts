import api from "@/shared//api/client";

const HAS_PREFIX = (api.defaults.baseURL || "").includes("/api/v1");
const ep = (shortPath: string) => (HAS_PREFIX ? shortPath : `/api/v1${shortPath}`);


export async function loginService(correo: string, password: string) {
  const body = { correo_usuario: correo, contrasena_usuario: password };
  const { data } = await api.post(ep("/auth/login"), body, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });
  const token = data?.access_token;
  if (!token) throw new Error("No se recibió access_token del servidor.");
  return token;
}

export async function solicitarRecuperacion(correo_usuario: string) {
  const { data, status } = await api.post(
    ep("/usuarios/recuperar-contrasena"),
    { correo_usuario },
    { validateStatus: () => true }
  );
  if (status === 200 || status === 201) return data;
  throw new Error(data?.message || `Error ${status} en solicitar recuperación`);
}

export async function verificarCodigo(correo_usuario: string, codigo_recuperacion: string) {
  const { data, status } = await api.post(
    ep("/usuarios/verificar-codigo"),
    { correo_usuario, codigo_recuperacion },
    { validateStatus: () => true }
  );
  if (status === 200 || status === 201) return data;
  const msg = (typeof data === "string" && data) || data?.message || `Error ${status} al verificar el código`;
  throw new Error(msg);
}



export type CambiarContrasenaDTO = {
  correo_usuario: string;
  codigo_recuperacion: string;
  contrasena_usuario: string;
};

export async function cambiarContrasena(payload: CambiarContrasenaDTO) {
  const { data } = await api.post("/usuarios/cambiar-contrasena", payload, {
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