import { useMutation } from "@tanstack/react-query";
import { createUsuarioPublic } from "../api/auth";

export function useRegisterPublic() {
  return useMutation({
    mutationKey: ["auth", "registerPublic"],
    mutationFn: async (fd: FormData) => await createUsuarioPublic(fd),
  });
}
