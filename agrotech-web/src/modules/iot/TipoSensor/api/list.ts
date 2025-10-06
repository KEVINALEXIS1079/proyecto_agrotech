import api from "@/shared/api/client";
import type { TipoSensor } from "../model/types";

export const getTiposSensor = async (): Promise<TipoSensor[]> => {
  const { data } = await api.get("/tipo-sensor");
  return data;
};
