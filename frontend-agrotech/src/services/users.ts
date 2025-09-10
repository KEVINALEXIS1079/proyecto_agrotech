// src/services/users.ts
import api from "./api";

export type RegisterPayload = {
  cedula_usuario: string;
  nombre_usuario: string;
  apellido_usuario: string;
  telefono_usuario: string;
  correo_usuario: string;
  contrasena_usuario: string;
  estado_usuario: "activo" | "inactivo";
  id_rol_fk: number;
};

export async function registerUser(payload: RegisterPayload) {
  // 1) toma token de localStorage (o de .env para pruebas)
  const token = localStorage.getItem("token") || import.meta.env.VITE_ADMIN_TOKEN || "";

  if (!token) {
    // evita hacer la llamada si no hay token (si tu API lo exige)
    throw new Error("Necesitas iniciar sesión como administrador para registrar usuarios.");
  }

  const { data, status } = await api.post("/usuarios", payload, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`, // 2) lo ponemos explícito aquí también
    },
    validateStatus: () => true,
  });

  if (status >= 200 && status < 300) return data;

  const message =
    (typeof data === "string" && data) ||
    data?.message ||
    `Error ${status || ""} al registrar`;
  throw new Error(message);
}
