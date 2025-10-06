import { useQuery } from "@tanstack/react-query";
import { listPermisosAll } from "../api";
import type { Permiso } from "../model/types";

export function useListPermisosAll() {
  return useQuery<Permiso[]>({
    queryKey: ["permisos", "all"],
    queryFn: listPermisosAll,
  });
}