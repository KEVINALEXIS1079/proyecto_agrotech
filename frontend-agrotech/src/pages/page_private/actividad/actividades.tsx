import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Plus } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import type { LayoutContext } from "../../../layouts/ProtectedLayout";
import type { Actividad } from "../../../services/actividad";
import { getActividades, createActividad } from "../../../services/actividad";

const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const estadoColor: Record<Actividad["estado_actividad"], "warning" | "primary" | "success"> = {
  Pendiente: "warning",
  "En progreso": "primary",
  Finalizada: "success",
};

export default function Actividades() {
  const { setTitle } = useOutletContext<LayoutContext>();
  useEffect(() => setTitle("Actividades"), [setTitle]);

  const [list, setList] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [form, setForm] = useState<Actividad>({
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getActividades();
        setList(Array.isArray(data) ? data : []);
      } catch {
        setList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChange = <K extends keyof Actividad>(k: K, v: Actividad[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const validar = (): string | null => {
    if (!form.nombre_actividad.trim()) return "El nombre es obligatorio.";
    if (!form.descripcion_actividad.trim()) return "La descripción es obligatoria.";
    if (!form.fecha_actividad) return "Selecciona la fecha de actividad.";
    if (!form.fecha_inicio_actividad) return "Selecciona la fecha de inicio.";
    if (!form.fecha_fin_actividad) return "Selecciona la fecha de fin.";
    if (new Date(form.fecha_inicio_actividad) > new Date(form.fecha_fin_actividad))
      return "La fecha de inicio no puede ser mayor a la de fin.";
    if (form.tiempo_actividad <= 0) return "El tiempo (horas) debe ser mayor a 0.";
    if (form.id_tipo_actividad_fk <= 0) return "El tipo de actividad (ID) debe ser mayor a 0.";
    return null;
  };

  const submit = async () => {
    const msg = validar();
    if (msg) {
      setError(msg);
      return;
    }
    setError("");
    try {
      setSaving(true);
      const created = await createActividad(form);
      setList((prev) => [...prev, created]);
      setOpen(false);
      setForm((f) => ({
        ...f,
        nombre_actividad: "",
        descripcion_actividad: "",
        tiempo_actividad: 1,
        costo_mano_obra_actividad: 0,
      }));
    } catch (e: any) {
      setError(e?.response?.data?.message || "No se pudo crear la actividad.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Actividades</h2>
        <Button color="success" startContent={<Plus className="h-4 w-4" />} onPress={() => setOpen(true)}>
          Nueva actividad
        </Button>
      </div>

      {loading ? (
        <Card shadow="sm">
          <CardBody className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-6 w-40 bg-default-200 rounded" />
              <div className="h-10 w-full bg-default-200 rounded" />
              <div className="h-10 w-full bg-default-200 rounded" />
            </div>
          </CardBody>
        </Card>
      ) : list.length === 0 ? (
        <Card shadow="sm">
          <CardBody className="p-8 text-center">
            <p className="text-foreground-600">Aún no hay actividades registradas.</p>
            <p className="text-foreground-500 text-sm mt-1">
              Crea tu primera actividad usando el botón “Nueva actividad”.
            </p>
          </CardBody>
        </Card>
      ) : (
        <Table aria-label="Listado de actividades" shadow="none">
          <TableHeader>
            <TableColumn>Nombre</TableColumn>
            <TableColumn>Estado</TableColumn>
            <TableColumn>Fecha</TableColumn>
            <TableColumn>Inicio</TableColumn>
            <TableColumn>Fin</TableColumn>
            <TableColumn>Tiempo (h)</TableColumn>
            <TableColumn>Costo (COP)</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Sin datos">
            {list.map((a, i) => {
              const estado = (a.estado_actividad || "En progreso") as Actividad["estado_actividad"];
              const color = estadoColor[estado] ?? "primary";
              return (
                <TableRow key={a.id_actividad ?? `row-${i}`}>
                  <TableCell className="font-medium">{a.nombre_actividad}</TableCell>
                  <TableCell>
                    <Chip size="sm" color={color} variant="flat">
                      {estado}
                    </Chip>
                  </TableCell>
                  <TableCell>{a.fecha_actividad}</TableCell>
                  <TableCell>{a.fecha_inicio_actividad}</TableCell>
                  <TableCell>{a.fecha_fin_actividad}</TableCell>
                  <TableCell className="text-right">{a.tiempo_actividad}</TableCell>
                  <TableCell className="text-right">
                    {COP.format(Number(a.costo_mano_obra_actividad || 0))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <Modal isOpen={open} onOpenChange={(o) => setOpen(o)} size="lg" placement="center">
        <ModalContent>
          <ModalHeader>Registrar actividad</ModalHeader>
          <ModalBody className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Nombre"
              size="sm"
              value={form.nombre_actividad}
              onChange={(e) => onChange("nombre_actividad", e.target.value)}
              isRequired
            />
            <Select
              label="Estado"
              selectedKeys={new Set([form.estado_actividad])}
              onSelectionChange={(keys) => {
                const k = Array.from(keys)[0] as Actividad["estado_actividad"] | undefined;
                onChange("estado_actividad", k ?? "En progreso");
              }}
              size="sm"
            >
              <SelectItem key="Pendiente">Pendiente</SelectItem>
              <SelectItem key="En progreso">En progreso</SelectItem>
              <SelectItem key="Finalizada">Finalizada</SelectItem>
            </Select>

            <Input
              label="Descripción"
              size="sm"
              value={form.descripcion_actividad}
              onChange={(e) => onChange("descripcion_actividad", e.target.value)}
              className="md:col-span-2"
              isRequired
            />

            <Input
              label="Tiempo (horas)"
              type="number"
              size="sm"
              value={String(form.tiempo_actividad)}
              onChange={(e) => onChange("tiempo_actividad", Number(e.target.value))}
              min={0}
              step="0.1"
            />
            <Input
              label="Costo mano de obra (COP)"
              type="number"
              size="sm"
              value={String(form.costo_mano_obra_actividad)}
              onChange={(e) => onChange("costo_mano_obra_actividad", Number(e.target.value))}
              min={0}
              step="1000"
            />

            <Input
              label="Fecha actividad"
              type="date"
              size="sm"
              value={form.fecha_actividad}
              onChange={(e) => onChange("fecha_actividad", e.target.value)}
            />
            <Input
              label="Fecha inicio"
              type="date"
              size="sm"
              value={form.fecha_inicio_actividad}
              onChange={(e) => onChange("fecha_inicio_actividad", e.target.value)}
            />
            <Input
              label="Fecha fin"
              type="date"
              size="sm"
              value={form.fecha_fin_actividad}
              onChange={(e) => onChange("fecha_fin_actividad", e.target.value)}
            />

            <Input
              label="Tipo de actividad (ID)"
              type="number"
              size="sm"
              value={String(form.id_tipo_actividad_fk)}
              onChange={(e) => onChange("id_tipo_actividad_fk", Number(e.target.value))}
              min={1}
            />

            {error && <p className="text-danger text-xs md:col-span-2">{error}</p>}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button color="success" isLoading={saving} onPress={submit}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
