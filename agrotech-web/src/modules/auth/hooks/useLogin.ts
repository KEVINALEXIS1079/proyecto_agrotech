import { useMutation } from "@tanstack/react-query";
import { loginService } from "../api/auth";

export function useLogin() {
  return useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: async ({ correo, password }: { correo: string; password: string }) => {
      const token = await loginService(correo, password);
      localStorage.setItem("token", token);
      return token;
    },
  });
}
