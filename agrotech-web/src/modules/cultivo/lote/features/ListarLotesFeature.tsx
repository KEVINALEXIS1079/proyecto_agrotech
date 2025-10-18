// features/ListarLotesFeature.tsx
import { useMemo, useState, useEffect } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { useLoteList } from "../hooks";
import EliminarLoteFeature from "../features/EliminarLoteFeature";
import LoteCard from "../ui/LoteCard";
import LoteMapList from "../widgets/LoteMapList";
import LoteDeleteModal from "../ui/LoteDeleteModal";
import { FiltrarLotesFeature } from "./FiltrarLotesFeature";
import type { Lote, CreateLoteDTO } from "../model/types";

import { loteService } from "../api/lotes.service";

export default function ListarLotesFeature() {
  const { lotes, loading, error } = useLoteList();

  const [openDelete, setOpenDelete] = useState(false);
  const [rowDelete, setRowDelete] = useState<Lote | null>(null);
  const [lotesOrden, setLotesOrden] = useState<Lote[]>([]);
  const [filtered, setFiltered] = useState<Lote[]>([]);

  // Inicializar orden al cargar lotes
  useEffect(() => {
    if (lotes.length && lotesOrden.length === 0) setLotesOrden(lotes);
  }, [lotes, lotesOrden.length]);

  // Actualización incremental
  useEffect(() => {
    if (!lotes.length) return;
    setLotesOrden((prev) => {
      const idsPrev = new Set(prev.map((l) => l.id_lote_pk));
      const nuevos = lotes.filter((l) => !idsPrev.has(l.id_lote_pk));
      return nuevos.length === 0 ? prev : [...prev, ...nuevos];
    });
  }, [lotes]);

  // Sincronizar filtro base
  useEffect(() => {
    setFiltered(lotesOrden);
  }, [lotesOrden]);

  // Convertir lotes para el mapa
  const lotesMap = useMemo(
    () =>
      lotesOrden.map((l) => ({
        id_lote_pk: l.id_lote_pk,
        nombre_lote: l.nombre_lote,
        coordenadas:
          l.coordenadas_lote?.map((c) => ({
            latitud: c.latitud_lote,
            longitud: c.longitud_lote,
          })) || [],
      })),
    [lotesOrden]
  );

  // 🔥 Integración WebSocket para actualizaciones en tiempo real
  useEffect(() => {
    const socket = loteService.connect();

    socket.on("lotes:created", (nuevoLote: Lote) => {
      setLotesOrden((prev) => [...prev, nuevoLote]);
    });

    socket.on("lotes:updated", (loteActualizado: Lote) => {
      setLotesOrden((prev) =>
        prev.map((l) =>
          l.id_lote_pk === loteActualizado.id_lote_pk ? loteActualizado : l
        )
      );
    });

    socket.on("lotes:removed", ({ id }: { id: number }) => {
      setLotesOrden((prev) => prev.filter((l) => l.id_lote_pk !== id));
    });

    socket.on("lotes:restored", (restaurado: Lote) => {
      setLotesOrden((prev) => [...prev, restaurado]);
    });

    return () => {
      loteService.disconnect();
    };
  }, []);

  // 🔥 Lógica de eliminación usando feature
  const { handleDelete, loading: deleting } = EliminarLoteFeature({
    onDeleted: (id: number) =>
      setLotesOrden((prev) => prev.filter((l) => l.id_lote_pk !== id)),
  });

  const submitDelete = async () => {
    if (!rowDelete) return;
    await handleDelete(rowDelete.id_lote_pk);
    setOpenDelete(false);
    setRowDelete(null);
  };

  const openDeleteConfirm = (row: Lote) => {
    setRowDelete(row);
    setOpenDelete(true);
  };

  // Filtrado mapa (según resultados del filtrador)
  const filteredMap = useMemo(() => {
    const base = filtered.length > 0 ? filtered : lotesOrden;
    return lotesMap.filter((l) =>
      base.some((f) => f.id_lote_pk === l.id_lote_pk)
    );
  }, [lotesMap, filtered, lotesOrden]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-6 relative z-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Lista de lotes</h2>
        <Button
          as={Link}
          to="/lotes/crear"
          color="success"
          startContent={<Plus className="h-4 w-4" />}
          className="shadow-sm"
          aria-label="Crear nuevo lote"
        >
          Nuevo lote
        </Button>
      </div>

      {/* Filtros */}
      <FiltrarLotesFeature lotes={lotesOrden} onFilteredChange={setFiltered} />

      {/* Mapa interactivo */}
      {lotesMap.length > 0 && (
        <Card className="border border-gray-200 relative z-0 overflow-hidden">
          <CardBody className="h-[500px] p-0 rounded-lg">
            <LoteMapList lotes={filteredMap} editable={false} />
          </CardBody>
        </Card>
      )}

      {/* Lista de lotes */}
      {loading ? (
        <Card>
          <CardBody>Cargando lotes desde el servidor...</CardBody>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardBody>No se encontraron lotes registrados</CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((lote) => (
            <LoteCard
              key={lote.id_lote_pk}
              lote={lote}
              openDeleteConfirm={openDeleteConfirm}
            />
          ))}
        </div>
      )}

      {/* Modal de eliminación */}
      <LoteDeleteModal
        open={openDelete}
        onOpenChange={setOpenDelete}
        loteName={rowDelete?.nombre_lote}
        onConfirm={submitDelete}
        loading={deleting}
      />
    </div>
  );
}
