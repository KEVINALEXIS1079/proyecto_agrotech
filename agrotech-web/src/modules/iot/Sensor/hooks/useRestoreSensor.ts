import { useState } from "react";
import { sensorService } from "../api/sensor.service";

export function useRestoreSensor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const restoreSensor = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // El servicio ahora emite el evento internamente tras restaurar
      await sensorService.restore(id);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { restoreSensor, loading, error };
}