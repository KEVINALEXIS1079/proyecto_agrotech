// src/services/cultivo.ts
import api from "./api";

/** --------- SHAPE que devuelve tu API (backend) --------- */
export type BackendCultivo = {
  id: number;
  nombre_cultivo: string;
  descripcion_cultivo: string;
  img_cultivo: string;                 // URL imagen
  estado_cultivo: "activo" | "inactivo";
  fecha_inicio_cultivo: string;        // YYYY-MM-DD
  fecha_fin_cultivo: string;           // YYYY-MM-DD
  id_sublote_fk: number;
  id_tipo_cultivo_fk: number;
};

/** --------- SHAPE que usa la PAGE (view-model) --------- */
export type Cultivo = {
  id_cultivo: number;
  nombre_cultivo?: string;
  descripcion_cultivo?: string;
  imagen_url?: string;
  estado_cultivo?: "Activo" | "En riesgo" | "Listo para cosecha" | "Suspendido";
  fecha_siembra?: string;              // ISO/AAAA-MM-DD
  fecha_cosecha_estimada?: string;     // ISO/AAAA-MM-DD
  lote?: string;                       // texto mostrado
  tipo_cultivo?: string;               // opcional (si luego lo traes por join)
  area_m2?: number | string;           // opcional
  ph_promedio?: number | string;       // opcional
  humedad_promedio?: number | string;  // opcional
};

/** --------- MAPEOS --------- */
function estadoToVM(s: BackendCultivo["estado_cultivo"]): Cultivo["estado_cultivo"] {
  // Ajusta si luego agregas más estados en backend
  return s === "activo" ? "Activo" : "Suspendido";
}

function toVM(b: BackendCultivo): Cultivo {
  return {
    id_cultivo: b.id,
    nombre_cultivo: b.nombre_cultivo,
    descripcion_cultivo: b.descripcion_cultivo,
    imagen_url: b.img_cultivo || undefined,
    estado_cultivo: estadoToVM(b.estado_cultivo),
    fecha_siembra: b.fecha_inicio_cultivo,
    fecha_cosecha_estimada: b.fecha_fin_cultivo,
    lote: b.id_sublote_fk ? `Sublote #${b.id_sublote_fk}` : undefined,
    // Si más adelante traes el nombre del tipo por join, asígnalo aquí:
    tipo_cultivo: undefined,
  };
}

// Si necesitas enviar datos al backend desde el formulario/card, este helper
// convierte del VM al shape que espera el backend.
function toBackendPartial(vm: Partial<Cultivo>): Partial<BackendCultivo> {
  return {
    id: vm.id_cultivo as number,
    nombre_cultivo: vm.nombre_cultivo as string,
    descripcion_cultivo: vm.descripcion_cultivo as string,
    img_cultivo: vm.imagen_url as string,
    estado_cultivo:
      vm.estado_cultivo === "Activo" ? "activo" : "inactivo",
    fecha_inicio_cultivo: vm.fecha_siembra as string,
    fecha_fin_cultivo: vm.fecha_cosecha_estimada as string,
    // OJO: estos FKs deben venir del formulario si los usas para editar/crear
    id_sublote_fk: undefined as unknown as number,
    id_tipo_cultivo_fk: undefined as unknown as number,
  };
}

/** --------- CRUD PUBLICO (compatibles con la PAGE) --------- */

// Obtener todos los cultivos → en formato que consume la page
export async function getCultivos(): Promise<Cultivo[]> {
  const res = await api.get<BackendCultivo[]>("/cultivos");
  const arr = Array.isArray(res.data) ? res.data : [];
  return arr.map(toVM);
}

// Crear cultivo (acepta FormData o JSON). Devuelve VM
export async function createCultivo(
  data: FormData | Omit<BackendCultivo, "id">
): Promise<Cultivo> {
  const res = await api.post("/cultivos", data, {
    headers:
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
  });
  return toVM(res.data as BackendCultivo);
}

// Buscar cultivo por ID → VM
export async function getCultivoById(id: number): Promise<Cultivo> {
  const res = await api.get<BackendCultivo>(`/cultivos/${id}`);
  return toVM(res.data);
}

// Actualizar cultivo (parcial). Acepta VM parcial; convierte al backend.
export async function updateCultivo(
  id: number,
  data: Partial<Cultivo> | Partial<BackendCultivo>
): Promise<Cultivo> {
  // Si el caller te pasó VM, lo convertimos; si ya pasó backend-shape lo usamos tal cual.
  const payload =
    "id_cultivo" in (data as any) ||
    "fecha_siembra" in (data as any) ||
    "imagen_url" in (data as any)
      ? toBackendPartial(data as Partial<Cultivo>)
      : (data as Partial<BackendCultivo>);

  const res = await api.put<BackendCultivo>(`/cultivos/${id}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return toVM(res.data);
}

// Eliminar cultivo
export async function deleteCultivo(id: number) {
  const res = await api.delete(`/cultivos/${id}`);
  return res.data;
}
