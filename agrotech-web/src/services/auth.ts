import api from "./api";

export async function loginService(correo: string, password: string) {
  const body = {
    correo_usuario: correo,
    contrasena_usuario: password,
  };

  const { data } = await api.post("/auth/login", body, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });


  const token = data?.access_token;
  if (!token) throw new Error("No se recibió access_token del servidor.");
  return token;
}

export async function solicitarRecuperacion(email: string) {
  const { data, status } = await api.post(
    "/usuarios/solicitar-recuperacion",
    { email },
    { validateStatus: () => true }
  );

  if (status === 200 || status === 201) {
    return data; // Respuesta del backend
  }

  const msg = data?.message || `Error ${status} en solicitar recuperación`;
  throw new Error(msg);
}

export async function verificarCodigo(email: string, codigo: string) {
  const { data, status } = await api.post(
    "/usuarios/verificar-codigo",
    { email, codigo },
    { validateStatus: () => true }
  );

  if (status === 200 || status === 201) {
    return data; // éxito
  }

  const msg =
    (typeof data === "string" && data) ||
    data?.message ||
    `Error ${status} al verificar el código`;
  throw new Error(msg);
}

export async function cambiarContrasena(payload: {
  email: string;
  codigo: string;
  nuevaContrasena: string;
}) {
  const { data, status } = await api.post(
    "/usuarios/cambiar-contrasena",
    payload,
    { validateStatus: () => true }
  );

  if (status === 200 || status === 201) {
    return data;
  }

  const msg =
    (typeof data === "string" && data) ||
    data?.message ||
    `Error ${status} al cambiar la contraseña`;
  throw new Error(msg);
}