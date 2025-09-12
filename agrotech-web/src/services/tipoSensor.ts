// src/services/tipoSensor.ts
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1/tipo-sensor";

export interface TipoSensor {
  id_tipo_sensor_pk: number;
  nombre_tipo_sensor: string;
}

export const getTiposSensor = async () => {
  const token = localStorage.getItem("token"); // o donde lo guardes tras login
  const res = await axios.get("http://localhost:4000/api/v1/tipo-sensor", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// ✅ Registrar un nuevo tipo de sensor
export const registrarTipoSensor = async (
  data: Omit<TipoSensor, "id_tipo_sensor_pk">
): Promise<string> => {
  try {
    const res = await axios.post(API_URL, data);
    return res.data.message || "Tipo de sensor registrado correctamente";
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Error al registrar tipo de sensor");
  }
};

// ✅ Buscar un tipo de sensor por ID
export const getTipoSensorById = async (id: number): Promise<TipoSensor> => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Error al buscar tipo de sensor");
  }
};

// ✅ Actualizar un tipo de sensor
export const actualizarTipoSensor = async (
  id: number,
  data: Omit<TipoSensor, "id_tipo_sensor_pk">
): Promise<string> => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data.message || "Tipo de sensor actualizado correctamente";
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Error al actualizar tipo de sensor");
  }
};

// ✅ Eliminar un tipo de sensor
export const eliminarTipoSensor = async (id: number): Promise<string> => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data.message || "Tipo de sensor eliminado correctamente";
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Error al eliminar tipo de sensor");
  }
};
