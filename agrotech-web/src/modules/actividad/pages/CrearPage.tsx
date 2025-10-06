// src/modules/actividad/pages/CrearPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Input, Select, SelectItem, Button, Card } from "@heroui/react";
import { Calendar, ListChecks, Timer, HandCoins } from "lucide-react";

import type { LayoutContext } from "@/app/layout/ProtectedLayout";
import type { CreateActividadDTO } from "../model/types";
import { createActividad } from "../api";

export default function CrearPage() {
  const { setTitle } = useOutletContext<LayoutContext>();
  const navigate = useNavigate();

  // título dinámico en el layout
  useEffect(() => setTitle("Registrar Actividad"), [setTitle]);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [form, setForm] = useState<CreateActividadDTO>({
    nombre_actividad: "",
    descripcion_actividad: "",
    estado_actividad: "En progreso",
    tiempo_actividad: 1,
    costo_mano_obra_actividad: 0,
    fecha_actividad: today,
    fecha_inicio_actividad: today,
    fecha_fin_actividad: today,
    id_tipo_actividad_fk: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validar = (): string | null => {
    if (!form.nombre_actividad.trim()) return "El nombre es obligatorio.";
    if (!form.descripcion_actividad.trim())
      return "La descripción es obligatoria.";
    if (!form.fecha_actividad) return "Selecciona la fecha de la actividad.";
    if (!form.fecha_inicio_actividad) return "Selecciona la fecha de inicio.";
    if (!form.fecha_fin_actividad) return "Selecciona la fecha de fin.";
    if (new Date(form.fecha_inicio_actividad) > new Date(form.fecha_fin_actividad))
      return "La fecha de inicio no puede ser mayor que la de fin.";
    if (form.tiempo_actividad <= 0) return "El tiempo debe ser mayor a 0 horas.";
    if (form.costo_mano_obra_actividad < 0)
      return "El costo no puede ser negativo.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = validar();
    if (msg) {
      setError(msg);
      return;
    }
    setError("");
    try {
      setLoading(true);
      await createActividad(form);
      navigate("/actividades");
    } catch (err: any) {
      const msgBack =
        err?.response?.data?.message ?? "No se pudo crear la actividad.";
      setError(Array.isArray(msgBack) ? msgBack.join(", ") : String(msgBack));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 overflow-y-auto h-[calc(100vh-10rem)]">
      <Card className="p-8 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-8">
          <ListChecks className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Registrar Actividad</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* Nombre */}
          <Input
            label="Nombre"
            placeholder="Ej. Deshierbe manual"
            variant="bordered"
            value={form.nombre_actividad}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, nombre_actividad: e.target.value }))
            }
            isRequired
          />

          {/* Estado */}
          <Select
            label="Estado"
            placeholder="Seleccione un estado"
            selectedKeys={new Set([form.estado_actividad])}
            onSelectionChange={(keys) => {
              const k = Array.from(keys)[0] as CreateActividadDTO["estado_actividad"];
              setForm((prev) => ({ ...prev, estado_actividad: k }));
            }}
            isRequired
          >
            <SelectItem key="Pendiente">Pendiente</SelectItem>
            <SelectItem key="En progreso">En progreso</SelectItem>
            <SelectItem key="Completada">Completada</SelectItem>
            <SelectItem key="Cancelada">Cancelada</SelectItem>
          </Select>

          {/* Descripción */}
          <Input
            label="Descripción"
            placeholder="Describe brevemente la actividad"
            variant="bordered"
            value={form.descripcion_actividad}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                descripcion_actividad: e.target.value,
              }))
            }
            className="sm:col-span-2"
            isRequired
          />

          {/* Tiempo */}
          <Input
            label="Tiempo (horas)"
            type="number"
            startContent={<Timer className="h-4 w-4 text-gray-500" />}
            variant="bordered"
            value={String(form.tiempo_actividad)}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                tiempo_actividad: Number(e.target.value),
              }))
            }
            min={0}
            step="0.1"
          />

          {/* Costo */}
          <Input
            label="Costo mano de obra (COP)"
            type="number"
            startContent={<HandCoins className="h-4 w-4 text-gray-500" />}
            variant="bordered"
            value={String(form.costo_mano_obra_actividad)}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                costo_mano_obra_actividad: Number(e.target.value),
              }))
            }
            min={0}
            step="1000"
          />

          {/* Fechas */}
          <Input
            label="Fecha de la actividad"
            type="date"
            startContent={<Calendar className="h-4 w-4 text-gray-500" />}
            variant="bordered"
            value={form.fecha_actividad}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, fecha_actividad: e.target.value }))
            }
            isRequired
          />

          <Input
            label="Fecha de inicio"
            type="date"
            startContent={<Calendar className="h-4 w-4 text-gray-500" />}
            variant="bordered"
            value={form.fecha_inicio_actividad}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                fecha_inicio_actividad: e.target.value,
              }))
            }
            isRequired
          />

          <Input
            label="Fecha de fin"
            type="date"
            startContent={<Calendar className="h-4 w-4 text-gray-500" />}
            variant="bordered"
            value={form.fecha_fin_actividad}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                fecha_fin_actividad: e.target.value,
              }))
            }
            isRequired
          />

          {/* ID tipo actividad */}
          <Input
            label="Tipo de actividad (ID)"
            type="number"
            variant="bordered"
            value={String(form.id_tipo_actividad_fk)}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                id_tipo_actividad_fk: Number(e.target.value),
              }))
            }
            min={1}
            isRequired
          />

          {/* Errores */}
          {error && (
            <p className="text-red-500 text-xs sm:col-span-2">{error}</p>
          )}

          {/* Botones */}
          <div className="sm:col-span-2 flex justify-center mt-6 gap-3">
            <Button variant="light" onPress={() => navigate("/actividades")}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-lg font-medium shadow-sm transition"
              isLoading={loading}
            >
              Registrar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
