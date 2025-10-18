import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listUsuarios,
  usuarioService,
} from "@/modules/usuarios/usuarios/api/usuario.service";

/** Normaliza y ordena los params para que la queryKey sea estable */
function normalizeParams(params?: {
  page?: number; limit?: number; q?: string;
  estado?: "activo" | "inactivo" | "eliminado" | "todos";
  rolId?: number;
}) {
  const p = params ?? {};
  return {
    page: p.page ?? 1,
    limit: p.limit ?? 10,
    q: p.q ?? "",
    estado: p.estado ?? "activo",
    rolId: p.rolId ?? undefined,
  };
}

export const qkUsers = {
  base: ["usuarios", "lite"] as const,
  list: (params: ReturnType<typeof normalizeParams>) =>
    ["usuarios", "lite", params] as const,
};

/**
 * Hook para leer usuarios "lite" con WS:
 * - `params` normalizados para clave estable
 * - invalidación específica (misma clave) y global (todas las variantes)
 * - atajos para setQueryData opcional si tu WS trae el payload del usuario
 */
export function useUsuariosLite(params?: {
  page?: number; limit?: number; q?: string;
  estado?: "activo" | "inactivo" | "eliminado" | "todos";
  rolId?: number;
}) {
  const qc = useQueryClient();
  const norm = useMemo(() => normalizeParams(params), [params]);

  const query = useQuery({
    queryKey: qkUsers.list(norm),
    queryFn: () => listUsuarios(norm),
    staleTime: 10_000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // Helper: invalida solo la lista visible
    const invalidateExact = () =>
      qc.invalidateQueries({ queryKey: qkUsers.list(norm) });

    // Helper: invalida TODAS las variantes (cambia filtros, páginas, etc.)
    const invalidateAll = () =>
      qc.invalidateQueries({ queryKey: qkUsers.base, exact: false });

    // Si tu WS emite el usuario afectado, puedes actualizar en caliente:
    const offCreated = usuarioService.onCreated((u?: any) => {
      // Si no quieres setQueryData fino, descomenta solo invalidateAll()
      invalidateAll();
      // — OPCIONAL fino: si cae en el filtro actual, intenta meterlo en la página:
      // qc.setQueryData(qkUsers.list(norm), (old: any) => old ? {...old, items: [u, ...old.items]} : old);
    }) as (() => void) | undefined;

    const offUpdated = usuarioService.onUpdated((u?: any) => {
      // Refresca todo (seguro) o solo la visible si tu backend garantiza el filtro:
      invalidateAll();
      // — OPCIONAL fino:
      // qc.setQueryData(qkUsers.list(norm), (old: any) =>
      //   old ? {...old, items: old.items.map((x: any) => x.id === u.id ? u : x)} : old
      // );
    }) as (() => void) | undefined;

    const offDeleted = usuarioService.onDeleted((id?: number) => {
      invalidateAll();
      // — OPCIONAL fino:
      // qc.setQueryData(qkUsers.list(norm), (old: any) =>
      //   old ? {...old, items: old.items.filter((x: any) => x.id !== id)} : old
      // );
    }) as (() => void) | undefined;

    const offList = usuarioService.onListChanged(() => {
      // Cuando el backend diga que cambió “la lista”, invalida todas las variantes
      invalidateAll();
    }) as (() => void) | undefined;

    return () => {
      offCreated?.();
      offUpdated?.();
      offDeleted?.();
      offList?.();
    };
  }, [qc, norm]);

  return query; // { data, isLoading, error, ... }
}
