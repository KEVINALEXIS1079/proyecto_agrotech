import api from "@/shared/api/client";

export async function createiot(payload: any) {
  const { data } = await api.post("/sensores", payload);
  return data;
}
