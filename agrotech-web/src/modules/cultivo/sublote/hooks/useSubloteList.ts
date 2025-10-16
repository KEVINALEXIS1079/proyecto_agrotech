import { useEffect, useState } from "react";
import { subloteService } from "../api/sublotes.service";
import type { Sublote } from "../model/types";

export function useSubloteList() {
  const [sublotes, setSublotes] = useState<Sublote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSublotes = async () => {
    try {
      setLoading(true);
      const data = await subloteService.list();
      setSublotes(data);
      setError(null);
    } catch (err: any) {
      console.error("❌ Error al listar sublotes:", err);
      setError(err.message || "Error al obtener los sublotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSublotes();
  }, []);

  return { sublotes, loading, error, refresh: fetchSublotes };
}
