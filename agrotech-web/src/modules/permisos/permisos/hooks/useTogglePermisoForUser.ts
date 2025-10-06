import { useMutation, useQueryClient } from "@tanstack/react-query";
import { togglePermisoForUser } from "../api";
import type { TogglePermisoUserDTO } from "../model/types";

export function useTogglePermisoForUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: TogglePermisoUserDTO) => togglePermisoForUser(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["permisos"] }),
  });
}
