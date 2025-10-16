// src/shared/api/client.ts
import axios, { AxiosError } from "axios";
import { io, Socket } from "socket.io-client";

// =====================
// Axios centralizado
// =====================
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1",
});

function extractApiMessage(data: any): string {
  if (!data) return "Error inesperado";
  const msg = Array.isArray(data?.message) ? data.message.join("\n") : data?.message;
  return msg || data?.error || data?.errors?.[0]?.msg || data?.detail || "Error inesperado";
}

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("token");
  if (t) {
    if (cfg.headers && typeof (cfg.headers as any).set === "function") {
      (cfg.headers as any).set("Authorization", `Bearer ${t}`);
    } else if (cfg.headers) {
      (cfg.headers as any)["Authorization"] = `Bearer ${t}`;
    } else {
      cfg.headers = { Authorization: `Bearer ${t}` } as any;
    }
  }
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err: AxiosError) => {
    const status = err?.response?.status;

    if (status === 401 && location.pathname !== "/login") {
      localStorage.removeItem("token");
      location.replace("/login");
      return Promise.reject(new Error("Sesión expirada"));
    }

    if (err.response) {
      const message = extractApiMessage(err.response.data);
      const apiError = new Error(message) as Error & { status?: number };
      apiError.status = status;
      return Promise.reject(apiError);
    }

    if (err.code === "ECONNABORTED") return Promise.reject(new Error("La solicitud tardó demasiado."));
    if (err.message === "Network Error") return Promise.reject(new Error("No hay conexión con el servidor."));
    return Promise.reject(new Error(err.message || "Error inesperado"));
  }
);

// =====================
// WebSocket centralizado
// Un socket por namespace (cache)
// =====================
const socketsByNs = new Map<string, Socket>();

/**
 * Conecta al WebSocket con namespace opcional.
 * Ejemplo: const s = connectSocket("/usuarios");
 */
export function connectSocket(namespace = "/", token?: string): Socket {
  const baseUrl =
    import.meta.env.VITE_API_URL?.replace("/api/v1", "") ?? "http://localhost:4000";
  const url = `${baseUrl}${namespace}`;

  const existing = socketsByNs.get(url);
  if (existing) {
    if (!existing.connected) existing.connect();
    return existing;
  }

  const s = io(url, {
    transports: ["websocket"],
    withCredentials: true,
    auth: { token: token || localStorage.getItem("token") || "" }, // en browser va en auth
    path: "/socket.io", // ajusta si usas otro path
    reconnectionAttempts: 10,
    reconnectionDelay: 3000,
    timeout: 8000,
  });

  s.on("connect", () => console.log("✅ WS conectado:", namespace, s.id));
  s.on("disconnect", (r) => console.warn("⚠️ WS desconectado:", namespace, r));
  s.on("connect_error", (e) => console.error("❌ WS error:", namespace, e.message));

  socketsByNs.set(url, s);
  return s;
}

export default api;
