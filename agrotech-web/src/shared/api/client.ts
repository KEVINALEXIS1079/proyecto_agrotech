
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1",
});

function extractApiMessage(data: any): string {
  if (!data) return "Error inesperado";

  const msg = Array.isArray(data?.message) ? data.message.join("\n") : data?.message;
  return (
    msg ||
    data?.error ||            
    data?.errors?.[0]?.msg || 
    data?.detail ||           
    "Error inesperado"
  );
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

export default api;
export { api };
