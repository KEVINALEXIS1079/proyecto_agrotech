import api from "@/shared/api/client";

export async function removeiot(id: number) {
  await api.delete(`/almacenes/${id}`);
  return true;
}

