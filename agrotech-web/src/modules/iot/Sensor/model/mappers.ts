import type { Sensor, S                                                                                                                                                                                                                                     rom "./types";

/**
 * Mapea el formato que viene del backend al formato del frontend.
 */
export function mapSensorFromApi(data: any): Sensor {
  return {
    id_sensor_pk: data.id_sensor_pk,
    nombre_sensor: data.nombre_sensor,
    valor_minimo: Number(data.valor_minimo),
    valor_maximo: Number(data.valor_maximo),
    fecha_inicio_sensor: data.fecha_inicio_sensor,
    fecha_fin_sensor: data.fecha_fin_sensor ?? "",
    cultivo: {
      id_cultivo_pk: data.cultivo?.id_cultivo_pk ?? 0,
      nombre_cultivo: data.cultivo?.nombre_cultivo ?? "",
      descripcion_cultivo: data.cultivo?.descripcion_cultivo ?? "",
      img_cultivo: data.cultivo?.img_cultivo ?? "",
      estado_cultivo: data.cultivo?.estado_cultivo ?? "",
      fecha_inicio_cultivo: data.cultivo?.fecha_inicio_cultivo ?? "",
      fecha_fin_cultivo: data.cultivo?.fecha_fin_cultivo ?? "",
      delete_at: data.cultivo?.delete_at ?? null,
    },
    tipo_sensor: {
      id_tipo_sensor_pk: data.tipo_sensor?.id_tipo_sensor_pk ?? 0,
      nombre_tipo_sensor: data.tipo_sensor?.nombre_tipo_sensor ?? "",
      delete_at: data.tipo_sensor?.delete_at ?? null,
    },
    imagen_sensor: data.imagen_sensor ?? null,
    activo: data.activo ?? false,
    delete_at: data.delete_at ?? null,
  };
}

/**
 * Mapea el formato del frontend al formato que espera el backend.
 */
export function mapSensorToApi(sensor: SensorDTO) {
  return {
    nombre_sensor: sensor.nombre_sensor,
    valor_minimo: sensor.valor_minimo,
    valor_maximo: sensor.valor_maximo,
    fecha_inicio_sensor: sensor.fecha_inicio_sensor,
    fecha_fin_sensor: sensor.fecha_fin_sensor || null,
    id_cultivo_fk: sensor.id_cultivo_fk,
    id_tipo_sensor_fk: sensor.id_tipo_sensor_fk,
  };
}
