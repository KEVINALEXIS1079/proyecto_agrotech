// ------------------------------
// Import del tipo Lote (para relación entre sublote y lote padre)
// ------------------------------
import type { Lote } from "../../lote/widgets/LoteMapList";

// ------------------------------
// Estructura principal del sublote
// ------------------------------
export interface Sublote {
  id_sublote_pk: number; // ID principal del sublote
  nombre_sublote: string; // Nombre del sublote
  area_sublote: number; // Área calculada en m²

  // Coordenadas geográficas asociadas al sublote
  coordenadas_sublote: {
    latitud_sublote: number;
    longitud_sublote: number;
  }[];

  // Relación con el lote padre
  lote: Lote;

  // Relación con cultivos (si aplica)
  cultivos: any[];

  // Control de eliminación lógica
  delete_at: string | null;
}

// ------------------------------
// DTO para creación de sublotes
// ------------------------------
export interface CreateSubloteDTO {
  nombre_sublote: string; // Nombre asignado por el usuario
  coordenadas_sublote: {
    latitud_sublote: number;
    longitud_sublote: number;
  }[];
  id_lote_fk: number; // ID del lote padre (FK obligatoria)
  area_sublote?: number; // Área opcional (puede calcularse en backend)
}

// ------------------------------
// DTO para actualización de sublotes
// ------------------------------
export interface UpdateSubloteDTO extends Partial<CreateSubloteDTO> {
  id_sublote_pk: number; // Requerido para identificar qué sublote se actualiza
}
