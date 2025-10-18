import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tipoSensorService } from "../api/tipoSensor.service";
import { TIPO_SENSOR_QUERY_KEY } from "./useTipoSensorList";

export function useRestoreTipoSensor() {
  const queryClient = useQueryClient();

  const { 
    mutateAsync: restore, 
    isPending: loading, 
  } = useMutation({
    mutationFn: tipoSensorService.restore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TIPO_SENSOR_QUERY_KEY] });
    },
  });

  return { restore, loading };
}