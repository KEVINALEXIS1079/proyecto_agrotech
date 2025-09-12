// src/services/iot.ts
import api from "./api";

// --- Tipos para los datos anidados ---

// Define el tipo para el objeto 'tipo_sensor'
type TipoSensor = {
  id_tipo_sensor_pk: number;
  nombre_tipo_sensor: string;
};

// Define el tipo para el objeto 'cultivo'
type Cultivo = {
  id_cultivo_pk: number;
  descripcion_cultivo: string;
};

// --- Tipo principal del Sensor actualizado ---

export type Sensor = {
  id_sensor_pk: number;
  nombre_sensor: string;
  fecha_inicio_sensor: string; // YYYY-MM-DD
  tipo_sensor?: TipoSensor;   // Objeto anidado y opcional
  cultivo?: Cultivo;          // Objeto anidado y opcional
};

// --- Funciones del servicio (sin cambios en la lógica) ---

// Obtener todos los sensores
export async function getSensores(): Promise<Sensor[]> {
  const res = await api.get("/sensores");
  return res.data;
}

// Registrar un sensor (se mantiene flexible)
export async function registrarSensor(data: any) {
  const res = await api.post("/sensores", data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

// Buscar sensor por ID
export async function getSensorById(id: number): Promise<Sensor> {
  const res = await api.get(`/sensores/${id}`);
  return res.data;
}

// Actualizar sensor
export async function updateSensor(id: number, data: Partial<Sensor>) {
  const res = await api.put(`/sensores/${id}`, data);
  return res.data;
}

// Eliminar sensor
export async function deleteSensor(id: number) {
  const res = await api.delete(`/sensores/${id}`);
  return res.data;
}