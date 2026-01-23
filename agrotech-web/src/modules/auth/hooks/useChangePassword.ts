// src/modules/auth/hooks/useChangePassword.ts
import { useMutation } from "@tanstack/react-query";
import { cambiarContrasena, type CambiarContrasenaDTO } from "../api/auth";

type ChangePwdData = { message: string };          // ajusta al response real de tu API
type ChangePwdError = Error;

export function useChangePassword() {
  return useMutation<ChangePwdData, ChangePwdError, CambiarContrasenaDTO>({
    mutationKey: ["auth", "changePassword"],
    mutationFn: cambiarContrasena, // (v) => cambiarContrasena(v)
  });
}
