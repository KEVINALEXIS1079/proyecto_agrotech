export type SolicitarRecuperacionBody = {
  email: string;
};

export type VerificarCodigoBody = {
  email: string;
  codigo: string; // 6 dígitos
};

export type CambiarContrasenaBody = {
  email: string;
  codigo: string;
  nuevaContrasena: string; // min 8, con mayúscula, minúscula y número
};
