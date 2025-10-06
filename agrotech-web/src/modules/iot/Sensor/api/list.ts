import type { Sensor } from "../model/types";
import api from "@/shared/api/client";

export async function listiot() {
  const { data } = await api.get("/sensores");
  return data as Sensor[];
}

