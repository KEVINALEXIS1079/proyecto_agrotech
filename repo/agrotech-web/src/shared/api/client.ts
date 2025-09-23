import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1",
});

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("token");
  if (t) {
    if (cfg.headers && typeof cfg.headers.set === "function") {
      cfg.headers.set("Authorization", `Bearer ${t}`);
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
  (err) => {
    if (err?.response?.status === 401 && location.pathname !== "/login") {
      localStorage.removeItem("token");
      location.replace("/login");
    }
    return Promise.reject(err);
  }
);

export default api;
