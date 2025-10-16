import { useEffect, useState } from "react";
import { sensorService } from "../api/sensor.service";
import type { Sensor } from "../model/types";

export function useSensorById(id?: number) {
  const [sensor, setSensor] = useState<Sensor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const data = await sensorService.getById(id);
        setSensor(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  return { sensor, loading, error };
}
