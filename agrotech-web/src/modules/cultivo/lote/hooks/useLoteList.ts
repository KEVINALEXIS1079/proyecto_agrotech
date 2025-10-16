import { useEffect, useState } from "react";
import { loteService } from "../api/lotes.service";
import type { Lote } from "../model/types";

export function useLoteList() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await loteService.listLotes();
        setLotes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();

    // Conectar a WebSocket
    const socket = loteService.connect();
    socket.on("lotes:created", load);
    socket.on("lotes:updated", load);
    socket.on("lotes:removed", load);

    return () => {
      socket.off("lotes:created", load);
      socket.off("lotes:updated", load);
      socket.off("lotes:removed", load);
      loteService.disconnect();
    };
  }, []);

  return { lotes, loading, error, setLotes };
}
