import type { Usuario } from "./types";

const num = (v: any, fb = 0) => (Number.isFinite(Number(v)) ? Number(v) : fb);
const str = (v: any, fb = "") => (v ?? fb).toString();

export const toUsuario = (raw: any): Usuario => {
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
    estado_usuario: estado,
    id_rol_fk: num(raw?.id_rol_fk ?? raw?.rol?.id_rol_pk, 0),
    nombre_rol: raw?.rol?.nombre_rol,
  };
};