import api from "@/shared/api/client";

export type AlmacenPayload = {
  nombre_almacen: string;
};

export const updateSensor = (id: number, payload: AlmacenPayload) => {
  return api.patch(`/almacenes/${id}`, payload);
};
