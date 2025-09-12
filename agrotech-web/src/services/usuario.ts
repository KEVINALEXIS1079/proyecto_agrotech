// src/services/usuario.ts
import api from "./api";

export type Usuario = {
  id_usuario: number;
  cedula_usuario: string;
  nombre_usuario: string;
  apellido_usuario: string;
  telefono_usuario: string;
  correo_usuario: string;
  contrasena_usuario?: string;
  img_usuario?: string | null;
  estado_usuario?: "activo" | "inactivo"; // 👈 permite ambos
  id_rol_fk?: number;
  nombre_rol?: string;
};

const HAS_PREFIX = (api.defaults.baseURL || "").includes("/api/v1");
const ep = (shortPath: string) => (HAS_PREFIX ? shortPath : `/api/v1${shortPath}`);

const num = (v: any, fb = 0) => (Number.isFinite(Number(v)) ? Number(v) : fb);
const str = (v: any, fb = "") => (v ?? fb).toString();

const toUsuario = (raw: any): Usuario => {
  const est = String(raw?.estado_usuario ?? "").toLowerCase();
  const estado = est === "activo" || est === "inactivo" ? (est as "activo" | "inactivo") : undefined;

  return {
    id_usuario: num(raw?.id_usuario ?? raw?.id),
    cedula_usuario: str(raw?.cedula_usuario ?? raw?.cedula),
    nombre_usuario: str(raw?.nombre_usuario ?? raw?.nombre),
    apellido_usuario: str(raw?.apellido_usuario ?? raw?.apellido),
    telefono_usuario: str(raw?.telefono_usuario ?? raw?.telefono),
    correo_usuario: str(raw?.correo_usuario ?? raw?.email ?? raw?.correo),
    img_usuario: raw?.img_usuario ?? raw?.avatar ?? null,
    estado_usuario: estado,                            // 👈 respeta el valor real
    id_rol_fk: num(raw?.id_rol_fk ?? raw?.rol?.id_rol_pk, 0),
    nombre_rol: raw?.rol?.nombre_rol,
  };
};

// Crear (privada, con rol y estado)
export async function createUsuario(fd: FormData) {
  const { data } = await api.post(ep("/usuarios"), fd);   // no fijes Content-Type
  return toUsuario(data);
}

// (resto igual)
export async function createUsuarioPublic(fd: FormData) {
  const { data } = await api.post(ep("/usuarios/public"), fd);
  return toUsuario(data);
}
export async function getUsuarios() {
  const { data } = await api.get(ep("/usuarios"));
  return (Array.isArray(data) ? data : []).map(toUsuario);
}
export async function getUsuarioById(id: number) {
  const { data } = await api.get(ep(`/usuarios/${id}`));
  return toUsuario(data);
}
export async function updateUsuario(id: number, fd: FormData) {
  const { data } = await api.patch(ep(`/usuarios/${id}`), fd);
  return toUsuario(data);
}
export async function deleteUsuario(id: number) {
  const { data } = await api.delete(ep(`/usuarios/${id}`));
  return data;
}
