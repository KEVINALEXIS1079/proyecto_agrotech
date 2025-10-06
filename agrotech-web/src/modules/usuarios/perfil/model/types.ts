export type AuthProfile = {
  id: number;
  correo: string;
  rol: string;
  permisos: string[];
};

export type UserDTO = {
  id_usuario_pk: number;
  cedula_usuario: string | null;
  nombre_usuario: string;
  apellido_usuario: string;
  telefono_usuario: string | null;
  correo_usuario: string;
  contrasena_usuario?: string | null;
  img_usuario: string | null;
  estado_usuario: string;
  rol: {
    id_rol_pk: number;
    nombre_rol: string;
    descripcion_rol?: string | null;
    rolesPermisos?: Array<{
      id_rol_permiso_pk: number;
      permiso: { id_permiso_pk: number; nombre_permiso: string };
    }>;
  };
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string | null;
  email: string;
  role: string;
  avatarUrl?: string | null;
  status: string;
  permissions: string[];
  language?: "es" | "en";
  theme?: "light" | "dark" | "system";
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
    weeklySummary: boolean;
  };
  location?: string | null;
  bio?: string | null;
};

export type UpdateUserInput = {
  cedula_usuario?: string;
  nombre_usuario?: string;
  apellido_usuario?: string;
  telefono_usuario?: string;
  correo_usuario?: string;
  contrasena_usuario?: string;
  img_usuario?: File | null;
  estado_usuario?: string;
  id_rol_fk?: number;
  permisos?: number[] | string[];
};
