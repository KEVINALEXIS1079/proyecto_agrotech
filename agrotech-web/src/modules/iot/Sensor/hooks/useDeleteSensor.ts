import { useState } from "react";
import { sensorService } from "../api/sensor.service";

export function useDeleteSensor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteSensor = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await sensorService.remove(id);
      sensorService.emit("sensores:remove", { id }); // WebSocket
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteSensor, loading, error };
}
