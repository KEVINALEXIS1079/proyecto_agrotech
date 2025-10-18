import { useEffect, useState, useCallback } from "react";
import { sensorService } from "../api/sensor.service";
import type { Sensor } from "../model/types";

export function useSensorList() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [deletedSensors, setDeletedSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSensors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [activeData, deletedData] = await Promise.all([
        sensorService.list().catch(() => []),
        sensorService.listDeleted().catch(() => []),
      ]);
      setSensors(activeData);
      setDeletedSensors(deletedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSensors();

    // CORRECCIÓN: Usamos la propiedad .socket directamente
    const socket = sensorService.socket;
    
    // Nos suscribimos a los eventos
    socket.on("sensores:created", loadSensors);
    socket.on("sensores:updated", loadSensors);
    socket.on("sensores:removed", loadSensors);
    socket.on("sensores:restored", loadSensors);

    // Función de limpieza para desuscribirnos
    return () => {
      socket.off("sensores:created", loadSensors);
      socket.off("sensores:updated", loadSensors);
      socket.off("sensores:removed", loadSensors);
      socket.off("sensores:restored", loadSensors);
      // Ya no es necesario desconectar manualmente
    };
  }, [loadSensors]);

  return { sensors, deletedSensors, loading, error, refresh: loadSensors };
}