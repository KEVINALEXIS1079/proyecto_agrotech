// src/modules/auth/hooks/useRegisterPublic.ts
import { useMutation } from "@tanstack/react-query";
import { createUsuarioPublic } from "../api/auth";

type RegisterData = { message?: string }; // ajusta si tu API devuelve algo más
type RegisterErr = Error;

export function useRegisterPublic() {
  return useMutation<RegisterData, RegisterErr, FormData>({
    mutationKey: ["auth", "registerPublic"],
    mutationFn: (fd) => createUsuarioPublic(fd),
  });
}
