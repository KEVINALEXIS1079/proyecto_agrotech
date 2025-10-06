import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPermiso } from "../api";
import type { Permiso, PermisoCreateDTO } from "../model/types";

export function useCreatePermiso() {
  const qc = useQueryClient();
  return useMutation<Permiso, unknown, PermisoCreateDTO>({
    mutationFn: createPermiso,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["permisos", "all"] });
    },
  });
}