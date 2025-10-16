import { useState } from "react";
import { sensorService } from "../api/sensor.service";
import type { SensorDTO, Sensor } from "../model/types";

export function useCreateSensor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSensor = async (payload: SensorDTO): Promise<Sensor | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await sensorService.create(payload);
      sensorService.emit("sensores:create", payload); // notificar por WebSocket
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createSensor, loading, error };
}
