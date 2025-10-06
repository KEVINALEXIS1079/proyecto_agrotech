import api from "@/shared/api/client";
import type { TipoSensorPayload } from "../model/types";

export const updateTipoSensor = async (id: number, payload: TipoSensorPayload): Promise<string> => {
  const { data } = await api.patch(`/tipo-sensor/${id}`, payload);
  return data;
};
