// src/modules/iot/tiposensor/hooks/useCreateTipoSensor.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tipoSensorService } from "../api/tipoSensor.service";
import { TIPO_SENSOR_QUERY_KEY } from "./useTipoSensorList";

export function useCreateTipoSensor() {
  const queryClient = useQueryClient();

  const { 
    mutateAsync: create, 
    isPending: loading, 
    error 
  } = useMutation({
    mutationFn: tipoSensorService.create,
    onSuccess: () => {
      // Al tener éxito, le decimos a React Query que los datos de la lista están obsoletos.
      // Esto hará que cualquier componente usando esta clave se actualice.
      queryClient.invalidateQueries({ queryKey: TIPO_SENSOR_QUERY_KEY });
    },
  });

  return { create, loading, error };
}