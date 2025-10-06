import type { AuthProfile, UpdateUserInput, UserDTO } from "../model/types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const BASE = `${API_URL}/api/v1`;

function pickToken() {
  return (
    localStorage.getItem("access-token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    ""
  );
}

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers || {});
  const token = pickToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");
  const res = await fetch(path, { ...init, headers, credentials: "include" });
  if (res.status === 401) throw new Error("401");
  if (!res.ok) throw new Error(String(res.status));
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}

export async function getAuthProfile(): Promise<AuthProfile> {
  return http<AuthProfile>(`${BASE}/auth/profile`, { method: "GET" });
}

export async function getUserById(id: number): Promise<UserDTO> {
  return http<UserDTO>(`${BASE}/usuarios/${id}`, { method: "GET" });
}

export async function updateUser(id: number, data: UpdateUserInput): Promise<UserDTO> {
  const fd = new FormData();
  if (data.cedula_usuario != null) fd.append("cedula_usuario", data.cedula_usuario);
  if (data.nombre_usuario != null) fd.append("nombre_usuario", data.nombre_usuario);
  if (data.apellido_usuario != null) fd.append("apellido_usuario", data.apellido_usuario);
  if (data.telefono_usuario != null) fd.append("telefono_usuario", data.telefono_usuario);
  if (data.correo_usuario != null) fd.append("correo_usuario", data.correo_usuario);
  if (data.contrasena_usuario != null) fd.append("contrasena_usuario", data.contrasena_usuario);
  if (data.estado_usuario != null) fd.append("estado_usuario", data.estado_usuario);
  if (data.id_rol_fk != null) fd.append("id_rol_fk", String(data.id_rol_fk));
  if (Array.isArray(data.permisos)) data.permisos.forEach(p => fd.append("permisos", String(p)));
  if (data.img_usuario instanceof File) fd.append("img_usuario", data.img_usuario);
  return http<UserDTO>(`${BASE}/usuarios/${id}`, { method: "PATCH", body: fd });
}
