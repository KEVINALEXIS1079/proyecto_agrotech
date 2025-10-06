// src/modules/permisos/api/index.ts
import { api } from "@/shared/api/client";
import type { Permiso, PermisoCreateDTO, TogglePermisoUserDTO, AssignPermisosDTO, RemovePermisosUserDTO } from "../model/types";

// Util: asegura array
function mapPermiso(apiP: any): Permiso {
  return {
    id_permiso: apiP.id,
    nombre_permiso: apiP.permisoCompleto ?? `${apiP.modulo}:${apiP.accion}`,
    accion: apiP.accion,
    moduleId: apiP.module?.id ?? null,
    activo: Boolean(apiP.activo),
  };
}

export async function listPermisosAll() {
  const r = await api.get("/permisos");
  const arr = Array.isArray(r.data?.permisos) ? r.data.permisos : [];
  return arr.map(mapPermiso); // ← ahora SIEMPRE devolvemos Permiso[]
}
export async function createPermiso(payload: PermisoCreateDTO) {
  const r = await api.post("/permisos", payload);
  return r.data as Permiso;
}

export async function togglePermisoForUser(payload: TogglePermisoUserDTO) {
  const r = await api.patch("/permisos/toggle", payload);
  return r.data as { ok: boolean };
}

export async function assignPermisosToRole(payload: AssignPermisosDTO) {
  const r = await api.patch("/permisos/roles/assign", payload);
  return r.data as { ok: boolean };
}

export async function assignPermisosToUser(payload: AssignPermisosDTO) {
  const r = await api.patch("/permisos/usuarios/assign", payload);
  return r.data as { ok: boolean };
}

export async function removePermisosFromUser({ userId, permisosIds }: RemovePermisosUserDTO) {
  const r = await api.patch(`/usuarios/${userId}/permisos/quitar`, { permisosIds });
  return r.data;
}


/*
problemas con lo de qui9tar permisos por el momento no esta funcionando el front seguire el otro dia para arreglar los conponentes 
diseno etc por el momento esta funcionando a su manera lo demas falta n detalles como flitar por modules de forma dinamica y demas
pero asi tosco esta funcioando, tambien falta arregla la gestion  de asignar permisos para que liste los usuarios de mejor manera y los permisis  de mejor manera
que la tabla este mejor y que todo funcione con web sockets y demas 
*/