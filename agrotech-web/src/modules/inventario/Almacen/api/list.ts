import type { Almacen } from "../model/types";
import api from "@/shared/api/client";

export async function listalmacen() {
  const { data } = await api.get("/almacenes");
  return data as Almacen[];
}

