// src/modules/iot/tiposensor/hooks/useUpdateTipoSensor.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tipoSensorService } from "../api/tipoSensor.service";
import { TIPO_SENSOR_QUERY_KEY } from "./useTipoSensorList";

export function useUpdateTipoSensor() {
  const queryClient = useQueryClient();

  const { 
    mutateAsync: update, 
    isPending: loading, 
    error 
  } = useMutation({
    // useMutation espera una función con un solo argumento, así que la adaptamos.
    mutationFn: (variables: { id: number; data: any }) => 
      tipoSensorService.update(variables.id, variables.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TIPO_SENSOR_QUERY_KEY });
    },
  });

  return { update, loading, error };
}