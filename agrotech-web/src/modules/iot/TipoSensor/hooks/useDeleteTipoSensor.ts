// src/modules/iot/tiposensor/hooks/useDeleteTipoSensor.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tipoSensorService } from "../api/tipoSensor.service";
import { TIPO_SENSOR_QUERY_KEY } from "./useTipoSensorList";

export function useDeleteTipoSensor() {
  const queryClient = useQueryClient();

  const { 
    mutateAsync: remove, 
    isPending: loading, 
    error 
  } = useMutation({
    mutationFn: tipoSensorService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TIPO_SENSOR_QUERY_KEY });
    },
  });

  return { remove, loading, error };
}