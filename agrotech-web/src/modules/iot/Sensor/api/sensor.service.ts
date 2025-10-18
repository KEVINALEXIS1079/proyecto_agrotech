import { api, connectSocket } from "@/shared/api/client";
import type { Sensor, SensorDTO } from "../model/types";
import { mapSensorFromApi } from "../model/mappers";

// Conexión al WebSocket (solo una vez)
const sensorSocket = connectSocket("/sensores");

class SensorService {
  public socket = sensorSocket;

  // --- MÉTODOS CRUD ---

  async list(): Promise<Sensor[]> {
    const { data } = await api.get("/sensores");
    return Array.isArray(data) ? data.map(mapSensorFromApi) : [];
  }

  async listDeleted(): Promise<Sensor[]> {
    const { data } = await api.get("/sensores/deleted");
    return Array.isArray(data) ? data.map(mapSensorFromApi) : [];
  }

  async restore(id: number): Promise<boolean> {
    await api.patch(`/sensores/restore/${id}`);
    return true;
  }

  async getById(id: number): Promise<Sensor> {
    const { data } = await api.get(`/sensores/${id}`);
    return mapSensorFromApi(data);
  }

  // CREAR SENSOR CON IMAGEN
  async create(payload: SensorDTO, imagen?: File): Promise<Sensor> {
    const formData = new FormData();

    // Campos del formulario
    formData.append("nombre_sensor", payload.nombre_sensor);
    formData.append("valor_minimo", String(payload.valor_minimo));
    formData.append("valor_maximo", String(payload.valor_maximo));
    formData.append("fecha_inicio_sensor", payload.fecha_inicio_sensor);
    formData.append("fecha_fin_sensor", payload.fecha_fin_sensor);
    formData.append("id_cultivo_fk", String(payload.id_cultivo_fk));
    formData.append("id_tipo_sensor_fk", String(payload.id_tipo_sensor_fk));

    if (payload.activo !== undefined) {
      formData.append("activo", payload.activo ? "true" : "false");
    }

    // NOMBRE DEL CAMPO CORREGIDO: imagen_sensor
    if (imagen) {
      formData.append("imagen_sensor", imagen);
    }

    const { data } = await api.post("/sensores", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Emitir evento por WebSocket
    this.socket.emit("sensores:create", data);

    return mapSensorFromApi(data);
  }

  // ACTUALIZAR SENSOR CON IMAGEN
  async update(
    id: number,
    payload: Partial<SensorDTO>,
    imagen?: File
  ): Promise<Sensor> {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "activo") {
          const boolValue =
            String(value) === "true" || String(value) === "1" || value === true;
          formData.append(key, boolValue ? "true" : "false");
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // NOMBRE DEL CAMPO CORREGIDO: imagen_sensor
    if (imagen) {
      formData.append("imagen_sensor", imagen);
    }

    const { data } = await api.patch(`/sensores/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Emitir evento por WebSocket
    this.socket.emit("sensores:update", data);

    return mapSensorFromApi(data);
  }

  async remove(id: number): Promise<boolean> {
    await api.delete(`/sensores/${id}`);
    this.socket.emit("sensores:remove", { id });
    return true;
  }
}

export const sensorService = new SensorService();
