import api from "@/shared/api/client";

export const removeTipoSensor = async (id: number): Promise<string> => {
  const { data } = await api.delete(`/tipo-sensor/${id}`);
  return data;
};
