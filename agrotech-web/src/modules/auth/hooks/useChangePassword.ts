import { useMutation } from "@tanstack/react-query";
import { cambiarContrasena } from "../api/auth";

export function useChangePassword() {
  return useMutation({
    mutationKey: ["auth", "changePassword"],
    mutationFn: async (payload: { correo_usuario: string; contrasena_usuario: string; codigo?: string }) =>
      await cambiarContrasena(payload),
  });
}
