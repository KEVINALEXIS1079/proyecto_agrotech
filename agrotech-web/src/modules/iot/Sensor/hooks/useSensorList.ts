import { useEffect, useState } from "react";
import { sensorService } from "../api/sensor.service";
import type { Sensor } from "../model/types";

export function useSensorList() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await sensorService.list();
        setSensors(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();

    // Escucha eventos en tiempo real
    const socket = sensorService.connect();
    socket.on("sensores:created", load);
    socket.on("sensores:updated", load);
    socket.on("sensores:removed", load);
    socket.on("sensores:restored", load);

    return () => {
      socket.off("sensores:created", load);
      socket.off("sensores:updated", load);
      socket.off("sensores:removed", load);
      socket.off("sensores:restored", load);
      sensorService.disconnect();
    };
  }, []);

  return { sensors, loading, error };
}
