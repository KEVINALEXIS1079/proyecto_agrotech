
import { api } from "@/shared/api/client";

export async function createusuarios(payload: any) {
  const response = await api.post("/usuarios", payload);
  return response.data;
}
