// src/modules/auth/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { loginService } from "../api/auth";

type LoginData = string; // access_token
type LoginError = Error;
type LoginVars = { correo: string; password: string };

export function useLogin() {
  return useMutation<LoginData, LoginError, LoginVars>({
    mutationKey: ["auth", "login"],
    mutationFn: async ({ correo, password }) => {
      // loginService ya guarda el token; si no, añade el setItem aquí.
      const token = await loginService(correo, password);
      return token;
    },
  });
}
