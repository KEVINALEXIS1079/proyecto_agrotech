import { api } from "@/shared/api/client";
import type { TipoSensor, TipoSensorDTO } from "../model/types";
import { mapTipoSensorFromApi, mapTipoSensorToApi } from "../model/mappers";
import { io, Socket } from "socket.io-client";

class TipoSensorService {
  private socket: Socket | null = null;


  async list(): Promise<TipoSensor[]> {
    const { data } = await api.get("/tipo-sensor");
    return Array.isArray(data) ? data.map(mapTipoSensorFromApi) : [];
  }

  async listDeleted(): Promise<TipoSensor[]> {
    const { data } = await api.get("/tipo-sensor/deleted");
    return Array.isArray(data) ? data.map(mapTipoSensorFromApi) : [];
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

  async restore(id: number): Promise<boolean> {
    await api.patch(`/tipo-sensor/restore/${id}`);
    return true;
  }

  // --- Métodos WebSocket (para escuchar en tiempo real) ---

  connect(): Socket {
    if (!this.socket || this.socket.disconnected) {
      const base = import.meta.env.VITE_API_URL?.replace("/api/v1", "") ?? "http://localhost:4000";
      this.socket = io(`${base}/tipo-sensor`, {
        auth: { token: localStorage.getItem("token") },
        transports: ["websocket"],
      });
    }
    return this.socket;
  }

  on(event: string, callback: (...args: any[]) => void): void {
    this.connect().on(event, callback);
  }
  
  off(event: string) {
    this.connect().off(event);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const tipoSensorService = new TipoSensorService();