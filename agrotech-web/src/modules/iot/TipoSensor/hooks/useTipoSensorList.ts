// src/modules/iot/tiposensor/hooks/useTipoSensorList.ts
import { useQuery } from "@tanstack/react-query";
import { tipoSensorService } from "../api/tipoSensor.service";

// La clave para identificar y gestionar el caché de esta data
export const TIPO_SENSOR_QUERY_KEY = ['tipos-sensores'];

export function useTipoSensorList() {
  const { 
    data: tipos, 
    isLoading, 
    isError,
    error,
    refetch 
  } = useQuery({
    queryKey: TIPO_SENSOR_QUERY_KEY,
    queryFn: () => tipoSensorService.list(),
  });

  return { tipos: tipos ?? [], loading: isLoading, isError, error, refetch };
}