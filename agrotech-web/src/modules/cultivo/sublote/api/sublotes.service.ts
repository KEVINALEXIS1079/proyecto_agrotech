import type { Sublote, CreateSubloteDTO } from "../model/types";
import { mapSubloteFromApi, mapSubloteToApi } from "../model/mappers";
import { api, connectSocket } from "@/shared/api/client";
import type { Socket } from "socket.io-client";

class SubloteService {
  private socket: Socket | null = null;

  // ----------------------
  // CRUD REST
  // ----------------------
  async list(): Promise<Sublote[]> {
    const { data } = await api.get("/sublotes");
    return Array.isArray(data) ? data.map(mapSubloteFromApi) : [];
  }

  async getById(id: number): Promise<Sublote> {
    const { data } = await api.get(`/sublotes/${id}`);
    return mapSubloteFromApi(data);
  }

  async create(payload: CreateSubloteDTO): Promise<Sublote> {
    const apiPayload = mapSubloteToApi(payload);
    const { data } = await api.post("/sublotes", apiPayload);
    return mapSubloteFromApi(data);
  }

  async update(id: number, payload: CreateSubloteDTO): Promise<Sublote> {
    const apiPayload = mapSubloteToApi(payload);
    const { data } = await api.patch(`/sublotes/${id}`, apiPayload);
    return mapSubloteFromApi(data);
  }

  async remove(id: number): Promise<boolean> {
    await api.delete(`/sublotes/${id}`);
    return true;
  }

  // ----------------------
  // WebSocket
  // ----------------------
  connect(): Socket {
    if (!this.socket || this.socket.disconnected) {
      this.socket = connectSocket();

      this.socket.on("connect", () => {
        console.log("✅ Socket conectado:", this.socket?.id);
      });

      this.socket.on("connect_error", (err) => {
        console.warn("⚠️ Error de conexión del socket:", err.message);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("🔌 Socket desconectado:", reason);
      });
    }

    return this.socket;
  }

  on(event: string, callback: (...args: any[]) => void) {
    const socket = this.connect();
    socket.off(event); // Evita duplicar listeners
    socket.on(event, callback);
  }

  emit(event: string, payload?: any) {
    const socket = this.connect();
    if (socket.connected) {
      socket.emit(event, payload);
    } else {
      console.warn(`⚠️ No se pudo emitir ${event}, socket no conectado.`);
    }
  }

  disconnect() {
    if (this.socket) {
      if (this.socket.connected) {
        this.socket.disconnect();
        console.log("🧹 Socket cerrado correctamente.");
      }
      this.socket = null;
    }
  }
}

export const subloteService = new SubloteService();
