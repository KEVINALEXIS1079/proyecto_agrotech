// src/services/actividad.ts
import api from "./api";

export type Actividad = {
  id_actividad?: number;
  nombre_actividad: string;
  descripcion_actividad: string;
  estado_actividad: "Pendiente" | "En progreso" | "Finalizada";
  tiempo_actividad: number;
  costo_mano_obra_actividad: number;
  fecha_actividad: string;
  fecha_inicio_actividad: string;
  fecha_fin_actividad: string;
  id_tipo_actividad_fk: number;
};

function normalize(a: any): Actividad {
  return {
    // distintos posibles nombres de id
    id_actividad:
      a?.id_actividad ?? a?.idActividad ?? a?.id_actividad_pk ?? a?.idActividadPk ?? a?.id ?? undefined,

    // soporta con/sin sufijo y camel/snake
    nombre_actividad: a?.nombre_actividad ?? a?.nombreActividad ?? a?.nombre ?? "",
    descripcion_actividad: a?.descripcion_actividad ?? a?.descripcionActividad ?? a?.descripcion ?? "",

    estado_actividad: (
      a?.estado_actividad ?? a?.estadoActividad ?? a?.estado ?? "En progreso"
    ) as Actividad["estado_actividad"],

    tiempo_actividad: Number(a?.tiempo_actividad ?? a?.tiempoActividad ?? a?.tiempo ?? 0),

    costo_mano_obra_actividad: Number(
      a?.costo_mano_obra_actividad ??
        a?.costoManoObraActividad ??
        a?.costo_mano_obra ??
        a?.costoManoObra ??
        0
    ),

    fecha_actividad: a?.fecha_actividad ?? a?.fechaActividad ?? a?.fecha ?? "",
    fecha_inicio_actividad:
      a?.fecha_inicio_actividad ?? a?.fechaInicioActividad ?? a?.fecha_inicio ?? a?.fechaInicio ?? "",
    fecha_fin_actividad:
      a?.fecha_fin_actividad ?? a?.fechaFinActividad ?? a?.fecha_fin ?? a?.fechaFin ?? "",

    id_tipo_actividad_fk: Number(
      a?.id_tipo_actividad_fk ??
        a?.idTipoActividadFk ??
        a?.tipo_actividad_id ??
        a?.tipoActividadId ??
        a?.id_tipo ??
        1
    ),
  };
}

export async function getActividades(): Promise<Actividad[]> {
  const { data } = await api.get("/actividades");
  const list =
    Array.isArray(data) ? data :
    Array.isArray(data?.data) ? data.data :
    Array.isArray(data?.rows) ? data.rows :
    Array.isArray(data?.items) ? data.items :
    [];
  return list.map(normalize);
}

export async function createActividad(payload: Actividad): Promise<Actividad> {
  const { data } = await api.post("/actividades", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return normalize(data ?? payload);
}
