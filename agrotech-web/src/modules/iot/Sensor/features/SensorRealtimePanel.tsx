import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  Brush,
} from "recharts";
import { CircularProgress } from "@heroui/react";

type Point = { ts: number; v: number };

export function SensorRealtimePanel({
  selected,
  percent,
  radialColor,
  selectedHistory,
  onPrev,
  onNext,
  onRangeLeftEdge,
}: {
  selected: any | null;
  percent: number;
  radialColor: "default" | "danger" | "warning" | "success";
  selectedHistory: Point[];
  onPrev?: () => void;
  onNext?: () => void;
  onRangeLeftEdge?: () => void; // ← para cargar más cuando el brush toca el borde
}) {
  const data = selectedHistory.map((p) => ({
    time: new Date(p.ts).toLocaleTimeString(),
    v: p.v,
    ts: p.ts,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* IZQ: radial */}
      <div className="md:col-span-4">
        <div className="bg-content2 rounded-2xl p-6 flex flex-col items-center justify-center">
          <div className="text-default-500 mb-2">{selected?.tipo_sensor?.nombre_tipo_sensor ?? "—"}</div>
          {selected ? (
            <CircularProgress
              aria-label="Nivel actual"
              value={percent}
              color={radialColor}
              showValueLabel
              classNames={{ svg: "w-44 h-44", value: "text-3xl font-bold" }}
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
          <div className="mt-4 flex gap-2">
            <button className="px-2 py-1 text-sm rounded bg-default-100" onClick={onPrev}>◀</button>
            <button className="px-2 py-1 text-sm rounded bg-default-100" onClick={onNext}>▶</button>
          </div>
        </div>
      </div>

      {/* DER: gráfica con Brush */}
      <div className="md:col-span-8">
        <div className="flex items-center justify-between mb-2 text-small text-default-500">
          {selected ? (
            <>
              <div>
                <b>{selected.nombre_sensor}</b>{" "}
                <span className="text-default-400">· {selected.lote?.nombre_lote || selected.lote?.codigo || "—"}</span>
              </div>
              <div>
                Último: <b>{selected.ultimo_valor ?? "—"}{selected.tipo_sensor?.unidades_tipo_sensor ? ` ${selected.tipo_sensor.unidades_tipo_sensor}` : ""}</b>{" "}
                · {selected.ultima_medicion ? new Date(selected.ultima_medicion).toLocaleString() : "—"}
              </div>
            </>
          ) : (
            <div>Selecciona un sensor</div>
          )}
        </div>

        <div className="h-60 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} minTickGap={24} />
              <YAxis width={48} tick={{ fontSize: 11 }} allowDecimals />
              <RTooltip isAnimationActive={false} formatter={(v: any) => [v, "valor"]} labelFormatter={(l: string) => `Hora: ${l}`} />
              <Area type="monotone" dataKey="v" dot={false} isAnimationActive={false} strokeOpacity={0.9} fillOpacity={0.15} />
              <Brush
                dataKey="time"
                travellerWidth={8}
                height={24}
                startIndex={Math.max(0, data.length - 180)}
                endIndex={data.length - 1}
                onChange={(range) => {
                  if (!range) return;
                  const start = (range as any).startIndex ?? 0;
                  if (start <= 2) onRangeLeftEdge?.();
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
