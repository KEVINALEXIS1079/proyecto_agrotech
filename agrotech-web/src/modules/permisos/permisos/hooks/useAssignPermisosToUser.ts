import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignPermisosToUser } from "../api";
import type { AssignPermisosDTO } from "../model/types";

export function useAssignPermisosToUser() {
  const qc = useQueryClient();
  return useMutation<{ ok: boolean }, unknown, AssignPermisosDTO>({
    mutationFn: assignPermisosToUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["permisos", "all"] });
    },
  });
}
