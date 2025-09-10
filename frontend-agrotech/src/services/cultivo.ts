import api from "./api";

export type Cultivo = {
  id: number;
  descripcion_cultivo: string;
  precio_cultivo: number;         // 👉 numérico
  presentacion_cultivo: string;
  fecha_inicio_cultivo: string;   // YYYY-MM-DD
  fecha_fin_cultivo: string;      // YYYY-MM-DD
  id_sublote_fk: number;
  id_tipo_cultivo_fk: number;

  // aún no existen en backend, reservados para futuro
  nombre_cultivo?: string | null;
  estado?: string | null;
  foto?: string | null;
};


// Obtener todos los cultivos
export async function getCultivos(): Promise<Cultivo[]> {
  const res = await api.get("/cultivos");
  return res.data;
}

// Registrar un cultivo
export async function createCultivo(
  data: Omit<Cultivo, "id" | "nombre_cultivo" | "estado" | "foto">
) {
  const res = await api.post("/cultivos", data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

// Buscar cultivo por ID
export async function getCultivoById(id: number): Promise<Cultivo> {
  const res = await api.get(`/cultivos/${id}`);
  return res.data;
}

// Actualizar cultivo
export async function updateCultivo(id: number, data: Partial<Cultivo>) {
  const res = await api.put(`/cultivos/${id}`, data);
  return res.data;
}

// Eliminar cultivo
export async function deleteCultivo(id: number) {
  const res = await api.delete(`/cultivos/${id}`);
  return res.data;
}
