import api from "@/shared/api/client";

export async function createalmacen(payload: any) {
  const { data } = await api.post("/almacenes", payload);
  return data;
}
