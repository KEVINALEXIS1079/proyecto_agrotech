import { useState } from "react";
import { sensorService } from "../api/sensor.service";
import type { SensorDTO, Sensor } from "../model/types";

export function useUpdateSensor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSensor = async (id: number, payload: SensorDTO): Promise<Sensor | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await sensorService.update(id, payload);
      sensorService.emit("sensores:update", { id, dto: payload }); // WebSocket
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateSensor, loading, error };
}
