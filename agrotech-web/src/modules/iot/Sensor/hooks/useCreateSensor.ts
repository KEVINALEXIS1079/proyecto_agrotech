import { useState } from "react";
import { sensorService } from "../api/sensor.service";
import type { Sensor, SensorDTO } from "../model/types";
import { toast } from "react-toastify";

export function useCreateSensor() {
  const [loading, setLoading] = useState(false);

  const createSensor = async (data: SensorDTO, file?: File): Promise<Sensor | null> => {
    try {
      setLoading(true);
      const result = await sensorService.create(data, file);
      return result;
    } catch (error) {
      console.error("Error al crear sensor:", error);
      toast.error("Error al crear sensor");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createSensor, loading };
}
