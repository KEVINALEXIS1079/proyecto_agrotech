export type PermisoAccion = "create" | "read" | "update" | "delete";

export type PermisoCreateDTO = {
  nombre_permiso: string;
  accion: PermisoAccion;
  moduleId: number;
  activo: boolean;
};

export type Permiso = {
  id_permiso: number;
  nombre_permiso: string;     // viene de permisoCompleto o modulo:accion
  accion: PermisoAccion | string;
  moduleId: number | null;    // en el GET viene como module.id
  activo: boolean;
};

export type PermisoListParams = {
  moduleId: number;
};

export type TogglePermisoUserDTO = {
  activo: boolean;
  userId: number;
  permisoId: number;
};

export type AssignPermisosDTO = {
  permisoIds: number[];
  userId: number;
  roleId: number;
};

export type RemovePermisosUserDTO = {
  userId: number;         // path param
  permisosIds: number[];  // body
};