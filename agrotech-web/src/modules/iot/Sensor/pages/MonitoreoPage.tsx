import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Button,
  Divider,
  Switch,
} from "@heroui/react";
import { Wifi, Server, Search, RefreshCcw } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
} from "recharts";
import api, { connectSocket } from "@/shared/api/client";

/* =========================
 * Tipos (alineados a tu backend)
 * ========================= */
type TipoSensor = {
  id_tipo_sensor_pk: number;
  nombre_tipo_sensor: string;
  unidades?: string | null;
};

type Lote = {
  id_lote_pk: number;
  nombre_lote?: string | null;
  codigo?: string | null;
};

type Sensor = {
  id_sensor_pk: number;
  nombre_sensor: string;
  activo: boolean;
  broker_sensor: string;
  puerto_sensor: number;
  topico_sensor: string;
  ultimo_valor: number | null;
  ultima_medicion: string | null; // ISO
  tipo_sensor: TipoSensor;
  lote: Lote;
};

/* =========================
 * Utils
 * ========================= */
function formatDateTime(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} · ${d.getFullYear()}-${pad(
    d.getMonth() + 1
  )}-${pad(d.getDate())}`;
}

function includesI(s: string, q: string) {
  return s.toLowerCase().includes(q.toLowerCase());
}

type Point = { t: number; v: number }; // epoch ms, valor

const MAX_POINTS = 120;

/* Guarda arrays por id_sensor_pk con tope de puntos */
function pushPoint(historyMap: Map<number, Point[]>, id: number, p: Point) {
  const arr = historyMap.get(id) ?? [];
  arr.push(p);
  if (arr.length > MAX_POINTS) arr.splice(0, arr.length - MAX_POINTS);
  historyMap.set(id, arr);
}

/* =========================
 * Page
 * ========================= */
export default function SensoresLivePage() {
  const [loading, setLoading] = useState(true);
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [query, setQuery] = useState("");
  const [soloActivos, setSoloActivos] = useState(true);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Historial por sensor (solo en memoria del front)
  const historyRef = useRef<Map<number, Point[]>>(new Map());

  // Para evitar renders por cada punto, usamos un "tick" barato
  const [, force] = useState(0);
  const forceRender = useCallback(() => force((x) => (x + 1) % 1000000), []);

  // =========== Cargar lista inicial ===========
  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Sensor[]>("/sensores");
      setSensores(data);

      // Siembra puntos iniciales a partir de ultimo_valor / ultima_medicion
      const now = Date.now();
      data.forEach((s) => {
        if (s.ultimo_valor != null) {
          const t = s.ultima_medicion ? new Date(s.ultima_medicion).getTime() : now;
          pushPoint(historyRef.current, s.id_sensor_pk, { t, v: s.ultimo_valor! });
        }
      });

      // Seleccionar el primero activo si no hay selección
      if (!selectedId && data.length) {
        const first = data.find((x) => x.activo) ?? data[0];
        setSelectedId(first.id_sensor_pk);
      }
    } finally {
      setLoading(false);
      forceRender();
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========== WebSocket live ===========
  useEffect(() => {
    const s = connectSocket("/sensores");

    const onCreated = (sensor: Sensor) => {
      setSensores((prev) => {
        const exists = prev.some((x) => x.id_sensor_pk === sensor.id_sensor_pk);
        return exists ? prev.map((x) => (x.id_sensor_pk === sensor.id_sensor_pk ? sensor : x)) : [sensor, ...prev];
      });
      if (sensor.ultimo_valor != null) {
        const t = sensor.ultima_medicion ? new Date(sensor.ultima_medicion).getTime() : Date.now();
        pushPoint(historyRef.current, sensor.id_sensor_pk, { t, v: sensor.ultimo_valor });
        forceRender();
      }
    };

    const onUpdated = (sensor: Sensor) => {
      setSensores((prev) => prev.map((x) => (x.id_sensor_pk === sensor.id_sensor_pk ? sensor : x)));
      if (sensor.ultimo_valor != null) {
        const t = sensor.ultima_medicion ? new Date(sensor.ultima_medicion).getTime() : Date.now();
        pushPoint(historyRef.current, sensor.id_sensor_pk, { t, v: sensor.ultimo_valor });
        forceRender();
      }
    };

    const onRemoved = ({ id }: { id: number }) => {
      setSensores((prev) => prev.filter((x) => x.id_sensor_pk !== id));
      historyRef.current.delete(id);
      if (selectedId === id) setSelectedId(null);
      forceRender();
    };

    const onRestored = (sensor: Sensor) => {
      setSensores((prev) => {
        const exists = prev.some((x) => x.id_sensor_pk === sensor.id_sensor_pk);
        return exists ? prev.map((x) => (x.id_sensor_pk === sensor.id_sensor_pk ? sensor : x)) : [sensor, ...prev];
      });
      if (sensor.ultimo_valor != null) {
        const t = sensor.ultima_medicion ? new Date(sensor.ultima_medicion).getTime() : Date.now();
        pushPoint(historyRef.current, sensor.id_sensor_pk, { t, v: sensor.ultimo_valor });
        forceRender();
      }
    };

    s.on("sensores:created", onCreated);
    s.on("sensores:updated", onUpdated);
    s.on("sensores:removed", onRemoved);
    s.on("sensores:restored", onRestored);

    return () => {
      s.off("sensores:created", onCreated);
      s.off("sensores:updated", onUpdated);
      s.off("sensores:removed", onRemoved);
      s.off("sensores:restored", onRestored);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // =========== Filtro simple ===========
  const filtered = useMemo(() => {
    const q = query.trim();
    return sensores.filter((s) => {
      if (soloActivos && !s.activo) return false;
      if (!q) return true;
      const cols = [
        s.nombre_sensor || "",
        s.tipo_sensor?.nombre_tipo_sensor || "",
        s.lote?.nombre_lote || s.lote?.codigo || "",
        s.topico_sensor || "",
        s.broker_sensor || "",
        String(s.puerto_sensor || ""),
      ].join(" | ");
      return includesI(cols, q);
    });
  }, [sensores, query, soloActivos]);

  // Datos del sensor seleccionado (gráfica grande)
  const selected = useMemo(() => sensores.find((x) => x.id_sensor_pk === selectedId) || null, [sensores, selectedId]);
  const selectedHistory = useMemo(() => {
    if (!selected) return [];
    return (historyRef.current.get(selected.id_sensor_pk) ?? []).map((p) => ({
      t: p.t,
      v: p.v,
      // etiqueta horaria compacta
      time: new Date(p.t).toLocaleTimeString(),
    }));
  }, [selected, loading]); // se forza render con forceRender en updates

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <Card shadow="sm" className="border border-default-100 bg-content1/60 backdrop-blur">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Wifi className="w-5 h-5" />
            <div>
              <h2 className="text-lg font-semibold">Sensores · Datos en tiempo real</h2>
              <p className="text-small text-default-500">
                Live desde <code>sensores:updated</code>. Gráficas sin animaciones.
              </p>
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
                isDisabled={loading}
              >
                Recargar
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* ================= Gráfica grande del seleccionado ================= */}
        <Divider />
        <CardBody className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-small text-default-500">
              {selected ? (
                <>
                  <b>{selected.nombre_sensor}</b>{" "}
                  <span className="text-default-400">
                    · {selected.tipo_sensor?.nombre_tipo_sensor}
                    {selected.tipo_sensor?.unidades ? ` (${selected.tipo_sensor.unidades})` : ""}
                    {" · "}
                    {selected.lote?.nombre_lote || selected.lote?.codigo || "—"}
                  </span>
                </>
              ) : (
                "Selecciona un sensor (clic en una fila)"
              )}
            </div>
            {selected && (
              <div className="text-small text-default-500">
                Último:{" "}
                <b>
                  {selected.ultimo_valor ?? "—"}
                  {selected.tipo_sensor?.unidades ? ` ${selected.tipo_sensor.unidades}` : ""}
                </b>{" "}
                · {formatDateTime(selected.ultima_medicion)}
              </div>
            )}
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={selectedHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11 }}
                  minTickGap={24}
                />
                <YAxis
                  width={48}
                  tick={{ fontSize: 11 }}
                  allowDecimals
                />
                <RTooltip
                  isAnimationActive={false}
                  formatter={(v: any) => [v, "valor"]}
                  labelFormatter={(l: string) => `Hora: ${l}`}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  dot={false}
                  isAnimationActive={false}
                  strokeOpacity={0.9}
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardBody>

        <Divider />

        {/* ================= Tabla con sparkline por fila ================= */}
        <CardBody className="overflow-x-auto">
          <Table aria-label="tabla-sensores" removeWrapper selectionMode="single" onSelectionChange={(keys) => {
            const k = Array.from(keys as Set<React.Key>)[0];
            if (k != null) setSelectedId(Number(k));
          }}>
            <TableHeader>
              <TableColumn>Sensor</TableColumn>
              <TableColumn>Tipo</TableColumn>
              <TableColumn>Lote</TableColumn>
              <TableColumn>Último valor</TableColumn>
              <TableColumn>Medición</TableColumn>
              <TableColumn>Broker</TableColumn>
              <TableColumn>Puerto</TableColumn>
              <TableColumn>Tópico</TableColumn>
              <TableColumn>Live</TableColumn>
              <TableColumn className="text-center">Estado</TableColumn>
            </TableHeader>

            <TableBody
              emptyContent={loading ? "Cargando…" : "Sin resultados"}
              items={filtered}
            >
              {(s: Sensor) => {
                const hist = (historyRef.current.get(s.id_sensor_pk) ?? []).map((p) => ({ t: p.t, v: p.v }));
                return (
                  <TableRow key={s.id_sensor_pk} className="cursor-pointer">
                    <TableCell className="max-w-[220px]">
                      <div className="flex items-center gap-2">
                        <Chip size="sm" variant="flat">
                          #{s.id_sensor_pk}
                        </Chip>
                        <div className="truncate">{s.nombre_sensor}</div>
                      </div>
                    </TableCell>

                    <TableCell className="capitalize">
                      {s.tipo_sensor?.nombre_tipo_sensor ?? "—"}
                      {s.tipo_sensor?.unidades ? (
                        <span className="text-default-500"> ({s.tipo_sensor.unidades})</span>
                      ) : null}
                    </TableCell>

                    <TableCell>{s.lote?.nombre_lote || s.lote?.codigo || "—"}</TableCell>

                    <TableCell>
                      {s.ultimo_valor ?? "—"}
                      {s.tipo_sensor?.unidades ? <span className="text-default-500"> {s.tipo_sensor.unidades}</span> : null}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">{formatDateTime(s.ultima_medicion)}</TableCell>

                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Server className="w-4 h-4" />
                        <Tooltip content={s.broker_sensor}>
                          <span className="truncate max-w-[140px] inline-block align-bottom">
                            {s.broker_sensor}
                          </span>
                        </Tooltip>
                      </div>
                    </TableCell>

                    <TableCell>{s.puerto_sensor ?? "—"}</TableCell>

                    <TableCell className="max-w-[220px]">
                      <Tooltip content={s.topico_sensor}>
                        <span className="truncate inline-block max-w-[210px]">{s.topico_sensor}</span>
                      </Tooltip>
                    </TableCell>

                    {/* Sparkline sin animación */}
                    <TableCell className="min-w-[140px] w-[160px]">
                      <div className="h-10 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={hist}>
                            <Area
                              type="monotone"
                              dataKey="v"
                              dot={false}
                              isAnimationActive={false}
                              strokeOpacity={0.9}
                              fillOpacity={0.15}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      {s.activo ? (
                        <Chip size="sm" color="success" variant="flat">
                          Activo
                        </Chip>
                      ) : (
                        <Chip size="sm" variant="flat">
                          Inactivo
                        </Chip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              }}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
