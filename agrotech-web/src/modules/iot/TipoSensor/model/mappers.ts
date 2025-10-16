import type { TipoSensor, TipoSensorDTO } from "./types";


export function mapTipoSensorFromApi(data: any): TipoSensor {
return {
id_tipo_sensor: data.id_tipo_sensor_pk ?? data.id_tipo_sensor ?? data.id,
nombre: data.nombre_tipo_sensor ?? data.nombre,
delete_at: data.delete_at ?? null,
};
}


export function mapTipoSensorToApi(tipo: TipoSensorDTO) {
return {
nombre_tipo_sensor: tipo.nombre,
};
}