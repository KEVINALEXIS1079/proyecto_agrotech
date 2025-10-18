// src/modules/usuarios/usuarios/hooks/useUsuarios.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UsuarioLite } from "../model/types";
import {
  listUsuarios as svcListUsuarios,
  listRolesLite as svcListRolesLite,
  updateUsuario as svcUpdateUsuario,
  updateEstado as svcUpdateEstado,
  softDeleteUsuario as svcSoftDeleteUsuario,
  restoreUsuario as svcRestoreUsuario,
} from "../api/usuario.service";

export type TabKey = "gestionar" | "restaurar";

type UsuariosListResp = {
  items: UsuarioLite[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  nextOffset: number;
};

export const qk = {
  usuariosList: (tab: TabKey, q: string, page: number, limit: number) =>
    ["usuarios", "list", { tab, q, page, limit }] as const,
  rolesLite: () => ["roles", "lite"] as const,
};

export function useUsuariosList({
  page,
  q,
  tab,
  limit = 10,
}: {
  page: number;
  q: string;
  tab: TabKey;
  limit?: number;
}) {
  const estado = tab === "restaurar" ? ("eliminado" as const) : ("todos" as const);

  return useQuery<UsuariosListResp>({
    queryKey: qk.usuariosList(tab, q, page, limit),
    queryFn: async () => {
      const resp: any = await svcListUsuarios({
        page,
        limit,
        q: q?.trim() || undefined,
        estado,
      });

      if (resp && typeof resp === "object" && "items" in resp) {
        const r = resp as any;
        const items: UsuarioLite[] = Array.isArray(r.items) ? r.items : [];
        const filtered =
          estado === "eliminado"
            ? items.filter((u) => u.estado === "eliminado")
            : items.filter((u) => u.estado !== "eliminado");

        return {
          items: filtered,
          page: r.page ?? page,
          limit: r.limit ?? limit,
          total: r.total ?? filtered.length,
          hasMore:
            r.hasMore ??
            (r.total
              ? r.total > (r.page ?? page) * (r.limit ?? limit)
              : filtered.length === limit),
          nextOffset: r.nextOffset ?? ((r.page ?? page) * (r.limit ?? limit)),
        };
      }

      const arr: UsuarioLite[] = Array.isArray(resp) ? resp : [];
      const filtered =
        estado === "eliminado"
          ? arr.filter((u) => u.estado === "eliminado")
          : arr.filter((u) => u.estado !== "eliminado");

      const start = (page - 1) * limit;
      const paged = filtered.slice(start, start + limit);

      return {
        items: paged,
        page,
        limit,
        total: filtered.length,
        hasMore: start + limit < filtered.length,
        nextOffset: start + limit,
      };
    },
    staleTime: 15_000,
  });
}

export function useRolesLite() {
  return useQuery<{ items: Array<{ id: number; nombre: string }> }>({
    queryKey: qk.rolesLite(),
    queryFn: async () => {
      const data: any = await svcListRolesLite();
      if (data && typeof data === "object" && "items" in data) return data as any;
      return { items: Array.isArray(data) ? data : [] };
    },
    staleTime: 5 * 60_000,
  });
}

/* =========================
 * Mutaciones
 * ========================= */

export function useUsuarioUpdate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: Partial<UsuarioLite> & { idRol?: number } }) =>
      svcUpdateUsuario(id, dto),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["usuarios", "list"], exact: false });
    },
  });
}

export function useUsuarioToggleEstado() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, to }: { id: number; to: "activo" | "inactivo" }) =>
      svcUpdateEstado(id, to),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["usuarios", "list"], exact: false });
    },
  });
}

export function useUsuarioRemove() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => svcSoftDeleteUsuario(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["usuarios", "list"], exact: false });
    },
  });
}

export function useUsuarioRestore() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => svcRestoreUsuario(id),
    onMutate: async (id: number) => {
      await qc.cancelQueries({ queryKey: ["usuarios", "list"] });

      const prevEntries = qc.getQueriesData<UsuariosListResp>({
        queryKey: ["usuarios", "list"],
      });

      prevEntries.forEach(([key, data]) => {
        if (!data) return;
        const filtered = data.items.filter((u) => u.id !== id);
        qc.setQueryData<UsuariosListResp>(key, {
          ...data,
          items: filtered,
          total: Math.max(0, (data.total ?? filtered.length) - 1),
        });
      });

      return { prevEntries };
    },
    onError: (_err, _id, ctx) => {
      ctx?.prevEntries?.forEach(([key, data]) => {
        qc.setQueryData(key, data);
      });
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: ["usuarios", "list"], exact: false });
    },
  });
}
