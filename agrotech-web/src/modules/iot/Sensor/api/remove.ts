import api from "@/shared/api/client";

export async function removeiot(id: number) {
  await api.delete(`/sensores/${id}`);
  return true;
}

