import { api } from "@/shared/api/client";
import type { TipoSensor, TipoSensorDTO } from "../model/types";
import { mapTipoSensorFromApi, mapTipoSensorToApi } from "../model/mappers";

class TipoSensorService {
  async list(): Promise<TipoSensor[]> {
    const { data } = await api.get("/tipo-sensor");
    return Array.isArray(data) ? data.map(mapTipoSensorFromApi) : [];
  }

  async getById(id: number): Promise<TipoSensor> {
    const { data } = await api.get(`/tipo-sensor/${id}`);
    return mapTipoSensorFromApi(data);
  }

  async create(payload: TipoSensorDTO): Promise<TipoSensor> {
    const body = mapTipoSensorToApi(payload);
    const { data } = await api.post("/tipo-sensor", body);
    return mapTipoSensorFromApi(data);
  }

  async update(id: number, payload: TipoSensorDTO): Promise<TipoSensor> {
    const body = mapTipoSensorToApi(payload);
    const { data } = await api.patch(`/tipo-sensor/${id}`, body);
    return mapTipoSensorFromApi(data);
  }

  async remove(id: number): Promise<boolean> {
    await api.delete(`/tipo-sensor/${id}`);
    return true;
  }
}

export const tipoSensorService = new TipoSensorService();
