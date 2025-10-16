import { useEffect, useState } from "react";
import { tipoSensorService } from "../api/tipoSensor.service";
import type { TipoSensor } from "../model/types";

export function useTipoSensorById(id?: number) {
  const [tipo, setTipo] = useState<TipoSensor | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const data = await tipoSensorService.getById(id);
        setTipo(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  return { tipo, loading, error };
}
