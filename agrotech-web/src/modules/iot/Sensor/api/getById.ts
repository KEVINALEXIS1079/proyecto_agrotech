import type { Sensor } from "../model/types";
import api from "@/shared/api/client";

export async function getiotById(id: number) {
  const { data } = await api.get(`/sensores/${id}`);
  return data as Sensor;
}
