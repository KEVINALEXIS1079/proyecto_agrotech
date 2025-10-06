import api from "@/shared/api/client";
import type { TipoSensorPayload } from "../model/types";

export const createTipoSensor = async (payload: TipoSensorPayload): Promise<string> => {
  const { data } = await api.post("/tipo-sensor", payload);
  return data;
};
