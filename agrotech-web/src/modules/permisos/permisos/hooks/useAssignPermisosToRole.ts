import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignPermisosToRole } from "../api";
import type { AssignPermisosDTO } from "../model/types";

export function useAssignPermisosToRole() {
  const qc = useQueryClient();
  return useMutation<{ ok: boolean }, unknown, AssignPermisosDTO>({
    mutationFn: assignPermisosToRole,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["permisos", "all"] });
    },
  });
}
