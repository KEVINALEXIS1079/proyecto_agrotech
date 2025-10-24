import { useMemo, useState } from "react";
import { Card, CardHeader, CardBody, Divider, Input, Button, Chip } from "@heroui/react";
import { Search, RotateCcw, Trash2 } from "lucide-react";
import { useSensoresDeleted, useRestoreSensor } from "../hooks/useSensores";
import type { Sensor } from "../model/types";
import SensoresTable from "../ui/SensoresTable";

export default function SensoresDeletedPage() {
  const { data: deleted, isLoading } = useSensoresDeleted();
  const { mutateAsync: restore } = useRestoreSensor();
  const [q, setQ] = useState("");

  const filtered = useMemo<Sensor[]>(() => {
    const txt = q.trim().toLowerCase();
    if (!txt) return deleted || [];
    return (deleted || []).filter((r) =>
      [
        r.nombre_sensor,
        r.tipo_sensor?.nombre_tipo_sensor,
        r.lote?.nombre_lote || r.lote?.codigo,
        r.topico_sensor,
        r.broker_sensor,
        String(r.puerto_sensor),
      ].join(" ").toLowerCase().includes(txt)
    );
  }, [deleted, q]);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <Card shadow="sm" className="border border-default-100 bg-content1/60 backdrop-blur">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5" />
            <div>
              <h2 className="text-lg font-semibold">Sensores eliminados</h2>
              <p className="text-small text-default-500">Restaura registros con un clic.</p>
            </div>
          </div>
          <Input
            size="sm"
            variant="bordered"
            startContent={<Search className="w-4 h-4" />}
            placeholder="Buscar..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </CardHeader>
        <Divider />
        <CardBody>
          <SensoresTable
            data={filtered}
            deleted
            loading={isLoading}
            onRestore={async (row) => { await restore(row.id_sensor_pk); }}
          />
        </CardBody>
      </Card>
    </div>
  );
}
