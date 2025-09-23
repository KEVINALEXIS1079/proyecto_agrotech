// src/features/usuarios/model/types.ts
export type Usuario = {
  id_usuario: number;
  cedula_usuario: string;
  nombre_usuario: string;
  apellido_usuario: string;
  telefono_usuario: string;
  correo_usuario: string;
  contrasena_usuario?: string;
  img_usuario?: File | null;
  estado_usuario?: "activo" | "inactivo";
  id_rol_fk?: number;
  nombre_rol?: string;
};


// #/modules/auth/model/types.ts

export type UsuarioRegistroPublico = {
  cedula_usuario: string;
  nombre_usuario: string;
  apellido_usuario: string;
  correo_usuario: string;
  telefono_usuario: string;
  contrasena_usuario: string;
  img_usuario?: File | null;
};
