import type { Almacen } from "../model/types";
import api from "@/shared/api/client";

export async function getalmacenById(id: number) {
  const { data } = await api.get(`/almacenes/${id}`);
  return data as Almacen;
}