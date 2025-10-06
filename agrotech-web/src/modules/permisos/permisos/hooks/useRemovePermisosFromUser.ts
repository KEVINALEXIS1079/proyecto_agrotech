import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removePermisosFromUser } from "../api";
import type { RemovePermisosUserDTO } from "../model/types";

export function useRemovePermisosFromUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RemovePermisosUserDTO) => removePermisosFromUser(payload),
    onSuccess: () => {
      // refresca listas si te interesa
      qc.invalidateQueries({ queryKey: ["permisos", "all"] });
    },
  });
}
