// src/modules/iot/Sensor/ui/SensoresTable.tsx
import { useMemo, useState } from "react";
import {
  Button,
  Chip,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { Edit3, Plus, RotateCcw, Trash2 } from "lucide-react";
import type { Sensor } from "../model/types";

export default function SensoresTable({
  data,
  deleted = false,
  onCreate,
  onEdit,
  onRemove,
  onRestore,
  loading,
  onSelect,
  selectedId,
}: {
  data: Sensor[] | undefined;
  deleted?: boolean;
  onCreate?: () => void;
  onEdit?: (row: Sensor) => void;
  onRemove?: (row: Sensor) => void;
  onRestore?: (row: Sensor) => void;
  onSelect?: (id: number) => void;
  selectedId?: number | null;
  loading?: boolean;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const txt = q.trim().toLowerCase();
    if (!txt) return data || [];
    return (data || []).filter((r) =>
      [
        r.nombre_sensor,
        r.tipo_sensor?.nombre_tipo_sensor,
        r.lote?.nombre_lote || r.lote?.codigo,
        r.topico_sensor,
        r.broker_sensor,
        String(r.puerto_sensor),
      ]
        .join(" ")
        .toLowerCase()
        .includes(txt)
    );
  }, [data, q]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          {!deleted && (
            <Button color="primary" startContent={<Plus size={16} />} onPress={onCreate}>
              Nuevo sensor
            </Button>
          )}
          <Chip variant="flat" color={deleted ? "danger" : "success"}>
            {deleted ? "Eliminados" : "Activos"}
          </Chip>
        </div>

        <Input
          className="max-w-xs"
          placeholder="Buscar por nombre, tipo, lote, tópico, broker, puerto"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          isClearable
          onClear={() => setQ("")}
        />
      </div>

      <Table
        aria-label="Tabla de sensores"
        removeWrapper
        selectionMode="single"
        selectedKeys={selectedId ? new Set([selectedId]) : new Set()}
        onSelectionChange={(keys) => {
          const k = Array.from(keys as Set<React.Key>)[0];
          if (k != null) onSelect?.(Number(k));
        }}
      >
        <TableHeader>
          <TableColumn>Sensor</TableColumn>
          <TableColumn>Tipo</TableColumn>
          <TableColumn>Lote</TableColumn>
          <TableColumn>Último valor</TableColumn>
          <TableColumn>Medición</TableColumn>
          <TableColumn>Broker</TableColumn>
          <TableColumn>Puerto</TableColumn>
          <TableColumn>Tópico</TableColumn>
          <TableColumn className="w-40 text-right">Acciones</TableColumn>
        </TableHeader>

        <TableBody
          items={filtered}
          emptyContent={loading ? "Cargando..." : "Sin registros"}
        >
          {(row: Sensor) => (
            <TableRow key={row.id_sensor_pk} className="cursor-pointer">
              <TableCell className="font-medium">{row.nombre_sensor}</TableCell>

              <TableCell>
                {row.tipo_sensor?.nombre_tipo_sensor}
                {row.tipo_sensor?.unidades_tipo_sensor ? (
                  <span className="text-foreground-500">
                    {" "}
                    ({row.tipo_sensor.unidades_tipo_sensor})
                  </span>
                ) : null}
              </TableCell>

              <TableCell>{row.lote?.nombre_lote || row.lote?.codigo || "—"}</TableCell>

              <TableCell>
                {row.ultimo_valor ?? "—"}
                {row.tipo_sensor?.unidades_tipo_sensor ? (
                  <span className="text-foreground-500">
                    {" "}
                    {row.tipo_sensor.unidades_tipo_sensor}
                  </span>
                ) : null}
              </TableCell>

              <TableCell className="whitespace-nowrap">
                {row.ultima_medicion
                  ? new Date(row.ultima_medicion).toLocaleString()
                  : "—"}
              </TableCell>

              <TableCell className="max-w-[220px]">
                <Tooltip content={row.broker_sensor}>
                  <span className="truncate inline-block max-w-[210px]">
                    {row.broker_sensor}
                  </span>
                </Tooltip>
              </TableCell>

              <TableCell>{row.puerto_sensor}</TableCell>

              <TableCell className="max-w-[220px]">
                <Tooltip content={row.topico_sensor}>
                  <span className="truncate inline-block max-w-[210px]">
                    {row.topico_sensor}
                  </span>
                </Tooltip>
              </TableCell>

              <TableCell className="text-right">
                {!deleted ? (
                  <div className="flex justify-end gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onPress={() => onEdit?.(row)}
                    >
                      <Edit3 size={16} />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      color="danger"
                      onPress={() => onRemove?.(row)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-end gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      color="success"
                      onPress={() => onRestore?.(row)}
                    >
                      <RotateCcw size={16} />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
