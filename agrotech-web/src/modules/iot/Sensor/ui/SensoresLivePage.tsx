import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Switch,
  Button,
  CircularProgress,
} from "@heroui/react";
import { Search, RefreshCcw, Wifi } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
} from "recharts";
import {
  useSensoresList,
  useCreateSensor,
  useUpdateSensor,
  useRemoveSensor,
  useRestoreSensor,
  useSensoresRealtime,
} from "../hooks/useSensores";
import { sensorService, socketSensores } from "../api/sensorService";
import type { Sensor } from "../model/types";
import SensoresTable from "../ui/SensoresTable";
import SensorForm from "../ui/SensorForm";

/* ===== helpers gráficos ===== */
type Point = { t: number; v: number };
const MAX_POINTS = 120;
const pushPoint = (m: Map<number, Point[]>, id: number, p: Point) => {
  const arr = m.get(id) ?? [];
  arr.push(p);
  if (arr.length > MAX_POINTS) arr.splice(0, arr.length - MAX_POINTS);
  m.set(id, arr);
};
const toPercent = (v?: number | null, min?: number | null, max?: number | null) => {
  if (v == null) return 0;
  const lo = min ?? 0, hi = max ?? 100;
  if (hi === lo) return 0;
  return Math.max(0, Math.min(100, Math.round(((v - lo) / (hi - lo)) * 100)));
};
const pickColor = (v?: number | null, min?: number | null, max?: number | null) => {
  if (v == null) return "default" as const;
  const lo = min ?? 0, hi = max ?? 100;
  if (v < lo || v > hi) return "danger" as const;
  const edge = (hi - lo || 1) * 0.1;
  if (v - lo < edge || hi - v < edge) return "warning" as const;
  return "success" as const;
};

export default function SensoresLivePage() {
  const [query, setQuery] = useState("");
  const [soloActivos, setSoloActivos] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const historyRef = useRef<Map<number, Point[]>>(new Map());
  const [, force] = useState(0);
  const forceRender = useCallback(() => force((x) => (x + 1) % 1_000_000), []);

  // Datos + invalidación realtime
  const { data: activos, isLoading: lAct } = useSensoresList();
  useSensoresRealtime();

  // Sembrar historiales primera vez
  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await sensorService.list();
      const now = Date.now();
      data.forEach((s) => {
        if (s.ultimo_valor != null) {
          const t = s.ultima_medicion ? new Date(s.ultima_medicion).getTime() : now;
          pushPoint(historyRef.current, s.id_sensor_pk, { t, v: s.ultimo_valor! });
        }
      });
      if (!selectedId && data.length) {
        const first = data.find((x) => x.activo) ?? data[0];
        setSelectedId(first.id_sensor_pk);
      }
    } finally {
      setLoading(false);
      forceRender();
    }
  };
  useEffect(() => { fetchAll(); /* eslint-disable-line */ }, []);

  // WS: alimentar historial en caliente
  useEffect(() => {
    const s = socketSensores();
    const onUpsert = (sensor: Sensor) => {
      if (sensor.ultimo_valor != null) {
        const t = sensor.ultima_medicion ? new Date(sensor.ultima_medicion).getTime() : Date.now();
        pushPoint(historyRef.current, sensor.id_sensor_pk, { t, v: sensor.ultimo_valor });
        forceRender();
      }
    };
    s.on("sensores:created", onUpsert);
    s.on("sensores:updated", onUpsert);
    s.on("sensores:restored", onUpsert);
    return () => {
      s.off("sensores:created", onUpsert);
      s.off("sensores:updated", onUpsert);
      s.off("sensores:restored", onUpsert);
    };
  }, [selectedId]);

  // Filtro y selección
  const filtered = useMemo<Sensor[]>(() => {
    const q = query.trim().toLowerCase();
    const base = (activos || []).filter((s) => (soloActivos ? s.activo : true));
    if (!q) return base;
    return base.filter((s) =>
      [
        s.nombre_sensor,
        s.tipo_sensor?.nombre_tipo_sensor,
        s.lote?.nombre_lote || s.lote?.codigo,
        s.topico_sensor,
        s.broker_sensor,
        String(s.puerto_sensor),
      ]
        .join("|")
        .toLowerCase()
        .includes(q)
    );
  }, [activos, query, soloActivos]);

  const selected = useMemo<Sensor | null>(
    () => filtered.find((x) => x.id_sensor_pk === selectedId) || filtered[0] || null,
    [filtered, selectedId]
  );

  const selectedHistory = useMemo(() => {
    if (!selected) return [] as { time: string; v: number }[];
    return (historyRef.current.get(selected.id_sensor_pk) ?? []).map((p) => ({
      time: new Date(p.t).toLocaleTimeString(),
      v: p.v,
    }));
  }, [selected, loading]);

  const percent = toPercent(
    selected?.ultimo_valor,
    selected?.valor_minimo_sensor,
    selected?.valor_maximo_sensor
  );
  const radialColor = pickColor(
    selected?.ultimo_valor,
    selected?.valor_minimo_sensor,
    selected?.valor_maximo_sensor
  );

  // CRUD
  const [form, setForm] = useState<{ open: boolean; editing: Sensor | null }>({ open: false, editing: null });
  const { mutateAsync: createSensor, isPending: creating } = useCreateSensor();
  const { mutateAsync: updateSensor, isPending: updating } = useUpdateSensor();
  const { mutateAsync: removeSensor } = useRemoveSensor();
  const { mutateAsync: restoreSensor } = useRestoreSensor();

  const handleSubmit = async (payload: any) => {
    if (form.editing) await updateSensor({ id: form.editing.id_sensor_pk, input: payload });
    else await createSensor(payload);
    setForm({ open: false, editing: null });
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <Card shadow="sm" className="border border-default-100 bg-content1/60 backdrop-blur">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Wifi className="w-5 h-5" />
            <div>
              <h2 className="text-lg font-semibold">Sensores · Monitoreo en tiempo real</h2>
              <p className="text-small text-default-500">Live por WebSocket (sensores:*). Sin animaciones.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <Input
              size="sm"
              variant="bordered"
              startContent={<Search className="w-4 h-4" />}
              placeholder="Buscar por nombre, tipo, lote, tópico, broker…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Switch isSelected={soloActivos} onValueChange={setSoloActivos}>
                Solo activos
              </Switch>
              <Button
                size="sm"
                variant="flat"
                startContent={<RefreshCcw className="w-4 h-4" />}
                onPress={fetchAll}
                isDisabled={loading || lAct}
              >
                Recargar
              </Button>
              <Button size="sm" color="primary" onPress={() => setForm({ open: true, editing: null })}>
                Nuevo sensor
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* ===== Radial + gráfica ===== */}
        <Divider />
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* IZQ: radial */}
            <div className="md:col-span-4">
              <div className="bg-content2 rounded-2xl p-6 flex flex-col items-center justify-center">
                <div className="text-default-500 mb-2">
                  {selected?.tipo_sensor?.nombre_tipo_sensor ?? "—"}
                </div>

                {selected ? (
                  <CircularProgress
                    aria-label="Nivel actual"
                    value={percent}
                    color={radialColor}
                    showValueLabel
                    classNames={{ base: "relative", svg: "w-44 h-44", value: "text-3xl font-bold" }}
                  >
                    <div className="text-center text-default-600">
                      {selected.ultimo_valor ?? "—"}
                      {selected.tipo_sensor?.unidades_tipo_sensor ? ` ${selected.tipo_sensor.unidades_tipo_sensor}` : ""}
                      <div className="text-tiny mt-1">
                        {selected.valor_minimo_sensor != null && selected.valor_maximo_sensor != null
                          ? `Rango: ${selected.valor_minimo_sensor} – ${selected.valor_maximo_sensor}`
                          : "Sin umbrales"}
                      </div>
                    </div>
                  </CircularProgress>
                ) : (
                  <div className="text-default-500">Selecciona un sensor</div>
                )}

                <div className="w-full flex items-center justify-between mt-4 text-default-500">
                  <span>0</span><span>100</span>
                </div>
              </div>
            </div>

            {/* DER: gráfica temporal */}
            <div className="md:col-span-8">
              <div className="flex items-center justify-between mb-2">
                <div className="text-small text-default-500">
                  {selected ? (
                    <>
                      <b>{selected.nombre_sensor}</b>{" "}
                      <span className="text-default-400">· {selected.lote?.nombre_lote || selected.lote?.codigo || "—"}</span>
                    </>
                  ) : (
                    "Selecciona un sensor (clic en la tabla)"
                  )}
                </div>
                {selected && (
                  <div className="text-small text-default-500">
                    Último:{" "}
                    <b>
                      {selected.ultimo_valor ?? "—"}
                      {selected.tipo_sensor?.unidades_tipo_sensor ? ` ${selected.tipo_sensor.unidades_tipo_sensor}` : ""}
                    </b>{" "}
                    · {selected.ultima_medicion ? new Date(selected.ultima_medicion).toLocaleString() : "—"}
                  </div>
                )}
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} minTickGap={24} />
                    <YAxis width={48} tick={{ fontSize: 11 }} allowDecimals />
                    <RTooltip isAnimationActive={false} formatter={(v: any) => [v, "valor"]} labelFormatter={(l: string) => `Hora: ${l}`} />
                    <Area type="monotone" dataKey="v" dot={false} isAnimationActive={false} strokeOpacity={0.9} fillOpacity={0.15} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardBody>

        {/* ===== Tabla ===== */}
        <Divider />
        <CardBody>
          <SensoresTable
            data={filtered}
            loading={lAct}
            onCreate={() => setForm({ open: true, editing: null })}
            onEdit={(row) => setForm({ open: true, editing: row })}
            onRemove={async (row) => {
              await removeSensor(row.id_sensor_pk);
              if (selectedId === row.id_sensor_pk) setSelectedId(null);
            }}
            onRestore={async (row) => { await restoreSensor(row.id_sensor_pk); }}
            onSelect={(id) => setSelectedId(id)}
            selectedId={selectedId}
          />
        </CardBody>
      </Card>

      {/* ===== Modal crear/editar ===== */}
      <SensorForm
  open={form.open}
  onClose={() => setForm({ open: false, editing: null })}
  onSubmit={handleSubmit}
  initial={form.editing || undefined}
  submitting={creating || updating}
  onViewTipos={() => {
  }}
  onQuickCreateTipo={() => {
  }}
/>

    </div>
  );
}
