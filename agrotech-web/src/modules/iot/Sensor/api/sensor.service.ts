import { api, connectSocket } from "@/shared/api/client";
import type { Sensor, SensorDTO } from "../model/types";
import { mapSensorFromApi, mapSensorToApi } from "../model/mappers";
import { io, Socket } from "socket.io-client";

/**
 * Servicio centralizado para Sensores:
 * - CRUD mediante API REST
 * - Subscripción a eventos WebSocket
 */
class SensorService {
  private socket: Socket | null = null;

  // ------------------------------
  // CRUD: API REST
  // ------------------------------

  async list(): Promise<Sensor[]> {
    const { data } = await api.get("/sensores");
    return Array.isArray(data) ? data.map(mapSensorFromApi) : [];
  }

  async getById(id: number): Promise<Sensor> {
    const { data } = await api.get(`/sensores/${id}`);
    return mapSensorFromApi(data);
  }

  async create(payload: SensorDTO): Promise<Sensor> {
    const body = mapSensorToApi(payload);
    const { data } = await api.post("/sensores", body);
    return mapSensorFromApi(data);
  }

  async update(id: number, payload: SensorDTO): Promise<Sensor> {
    const body = mapSensorToApi(payload);
    const { data } = await api.patch(`/sensores/${id}`, body);
    return mapSensorFromApi(data);
  }

  async remove(id: number): Promise<boolean> {
    await api.delete(`/sensores/${id}`);
    return true;
  }

  // ------------------------------
  // WebSocket: Tiempo real
  // ------------------------------

  /**
   * Conecta al namespace `/sensores` del backend.
   * Reutiliza el token JWT almacenado.
   */
  connect(): Socket {
    if (!this.socket) {
      const base = import.meta.env.VITE_API_URL?.replace("/api/v1", "") ?? "http://localhost:4000";
      this.socket = io(`${base}/sensores`, {
        auth: { token: localStorage.getItem("token") },
        transports: ["websocket"],
      });
    }
    return this.socket;
  }

  /**
   * Escucha eventos en tiempo real del backend.
   * Ejemplo:
   *   sensorService.on("sensores:created", data => console.log(data));
   */
  on(event: string, callback: (...args: any[]) => void): void {
    this.connect().on(event, callback);
  }

  /**
   * Emite eventos al backend WebSocket.
   * Ejemplo:
   *   sensorService.emit("sensores:create", payload);
   */
  emit(event: string, payload?: any): void {
    this.connect().emit(event, payload);
  }

  /**
   * Cierra la conexión WebSocket.
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// ------------------------------
// Export único
// ------------------------------
export const sensorService = new SensorService();
