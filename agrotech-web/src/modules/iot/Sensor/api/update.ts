import api from "@/shared/api/client";

export type SensorPayload = {
  nombre_sensor: string;
  valor_minimo: number;
  valor_maximo: number;
  fecha_inicio_sensor: string;
  fecha_fin_sensor?: string;
  id_cultivo_fk: number;
  id_tipo_sensor_fk: number;
};

export const updateSensor = (id: number, payload: SensorPayload) => {
  return api.patch(`/sensores/${id}`, payload);
};
