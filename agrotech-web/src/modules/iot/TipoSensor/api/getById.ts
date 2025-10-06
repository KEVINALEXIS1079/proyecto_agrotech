import api from "@/shared/api/client";
import type { TipoSensor } from "../model/types";

export const getTipoSensorById = async (id: number): Promise<TipoSensor> => {
  const { data } = await api.get(`/tipo-sensor/${id}`);
  return data;
};
