import api from "./api";

export type TipoCultivo = {
  id_tipo_cultivo: number;
  nombre_tipo_cultivo: string;
};

// Obtener todos los tipos de cultivo
export async function getTiposCultivo(): Promise<TipoCultivo[]> {
  const res = await api.get("/tipo-cultivo"); 
  return res.data;
}