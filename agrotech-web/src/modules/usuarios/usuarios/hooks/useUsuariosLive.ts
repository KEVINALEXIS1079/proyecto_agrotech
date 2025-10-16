// src/modules/usuarios/usuarios/hooks/useUsuariosLive.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usuarioService } from "../api/usuarioService";

export function useUsuariosLive() {
  const qc = useQueryClient();

  useEffect(() => {
    const invalidate = () => {
      qc.invalidateQueries({ queryKey: ["usuarios", "list"], exact: false });
    };

    // Conectar una vez al namespace correcto y suscribirse
    usuarioService.connect();
    usuarioService.onListChanged(invalidate);

    // Si luego usas perfil:
    // usuarioService.onProfileChanged(invalidate);

    return () => {
      usuarioService.offListChanged();
      // usuarioService.offProfileChanged();
    };
  }, [qc]);
}
