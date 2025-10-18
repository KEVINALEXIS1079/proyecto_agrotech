import { useQuery } from "@tanstack/react-query";
import { tipoSensorService } from "../api/tipoSensor.service";

export const TIPO_SENSOR_QUERY_KEY = 'tipos-sensores';

export function useTipoSensorList(options: { showDeleted?: boolean } = {}) {
  const { showDeleted = false } = options;

  const queryKey = [TIPO_SENSOR_QUERY_KEY, { deleted: showDeleted }];

  const { 
    data: tipos, 
    isLoading, 
  } = useQuery({
    queryKey: queryKey,
    queryFn: () => 
      showDeleted 
        ? tipoSensorService.listDeleted() 
        : tipoSensorService.list(),
  });

  return { tipos: tipos ?? [], loading: isLoading };
}