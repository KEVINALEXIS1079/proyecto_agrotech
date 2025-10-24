// src/modules/iot/tipo-sensor/hooks/useTipoSensor.ts
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tipoSensorService, socketTipoSensor } from "../api/tipoSensor.service";
import type {
  CreateTipoSensorInput,
  UpdateTipoSensorInput,
  TipoSensor,
} from "../model/types";

export const qk = {
  all: ["tipo-sensor"] as const,
  list: () => ["tipo-sensor", "list"] as const,
  deleted: () => ["tipo-sensor", "deleted"] as const,
  byId: (id?: number) => ["tipo-sensor", "byId", id] as const,
};

export function useTipoSensorList() {
  return useQuery({ queryKey: qk.list(), queryFn: tipoSensorService.list });
}

export function useTipoSensorDeleted() {
  return useQuery({
    queryKey: qk.deleted(),
    queryFn: tipoSensorService.listDeleted,
  });
}

export function useTipoSensor(id?: number) {
  return useQuery({
    queryKey: qk.byId(id),
    queryFn: () =>
      id
        ? tipoSensorService.getById(id)
        : Promise.resolve(null as unknown as TipoSensor),
    enabled: !!id,
  });
}

export function useCreateTipoSensor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTipoSensorInput) =>
      tipoSensorService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.list() });
      qc.invalidateQueries({ queryKey: qk.deleted() });
    },
  });
}

export function useUpdateTipoSensor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; input: UpdateTipoSensorInput }) =>
      tipoSensorService.update(payload.id, payload.input),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: qk.list() });
      qc.invalidateQueries({ queryKey: qk.byId(id) });
    },
  });
}

export function useRemoveTipoSensor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tipoSensorService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.list() });
      qc.invalidateQueries({ queryKey: qk.deleted() });
    },
  });
}

export function useRestoreTipoSensor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tipoSensorService.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.list() });
      qc.invalidateQueries({ queryKey: qk.deleted() });
    },
  });
}

/**
 * Suscripción WebSocket para invalidar caches cuando el backend
 * emite `tipo-sensor:changes-detected` (create/update/delete/restore).
 * Requiere que tu app esté envuelta en <QueryClientProvider>.
 */
export function useTipoSensorRealtime() {
  const qc = useQueryClient();

  useEffect(() => {
    const s = socketTipoSensor(); // namespace /tipo-sensor
    const handler = (evt: { action: string; data?: any; timestamp?: string }) => {
      // Invalidar listados
      qc.invalidateQueries({ queryKey: qk.list() });
      qc.invalidateQueries({ queryKey: qk.deleted() });

      // Si viene un id puntual, invalidar ese detalle también
      const id =
        evt?.data?.id_tipo_sensor_pk ??
        evt?.data?.id ??
        evt?.data?.idTipoSensor ??
        null;
      if (id) qc.invalidateQueries({ queryKey: qk.byId(Number(id)) });
    };

    s.on("tipo-sensor:changes-detected", handler);
    return () => {
      s.off("tipo-sensor:changes-detected", handler);
    };
  }, [qc]);
}

/* =========================
 * Alias conveniente
 * ========================= */
// Para mantener el nombre que usas en otros módulos:
export function useTiposSensor() {
  return useTipoSensorList();
}
