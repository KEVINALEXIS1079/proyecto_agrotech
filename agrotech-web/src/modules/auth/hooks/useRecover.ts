import { useMutation } from "@tanstack/react-query";
import { recoverRequest, recoverVerify, recoverChange } from "../api/auth";

export function useRecoverRequest() {
  return useMutation({
    mutationKey: ["auth", "recover", "request"],
    mutationFn: async ({ correo_usuario }: { correo_usuario: string }) => await recoverRequest(correo_usuario),
  });
}

export function useRecoverVerify() {
  return useMutation({
    mutationKey: ["auth", "recover", "verify"],
    mutationFn: async ({ correo_usuario, codigo }: { correo_usuario: string; codigo: string }) =>
      await recoverVerify(correo_usuario, codigo),
  });
}

export function useRecoverChange() {
  return useMutation({
    mutationKey: ["auth", "recover", "change"],
    mutationFn: async (payload: { correo_usuario: string; contrasena_usuario: string; codigo: string }) =>
      await recoverChange(payload.correo_usuario, payload.contrasena_usuario, payload.codigo),
  });
}
