// src/pages/cultivos/ListaCultivos.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  Calendar,
  Droplets,
  FlaskConical,
  MapPin,
  Pencil,
  Plus,
  Search,
  Sprout,
  Trash2,
} from "lucide-react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import type { LayoutContext } from "../../../layouts/ProtectedLayout";
import { getCultivos, deleteCultivo } from "../../../services/cultivo";

// ---------- RUTAS ----------
const REGISTER_PATH = "/cultivos/registrar";
const EDIT_PATH = (id: number | string) => `/cultivos/editar/${id}`;

// ---------- TIPOS (ajusta si ya los tienes en tu proyecto) ----------
export type CultivoEstado = "Activo" | "En riesgo" | "Listo para cosecha" | "Suspendido";
export type Cultivo = {
  id_cultivo: number | string;
  nombre_cultivo?: string;
  descripcion_cultivo?: string;
  estado_cultivo?: CultivoEstado;
  tipo_cultivo?: string;          // (Cacao, Café, Maíz…)
  lote?: string;                  // Lote / Parcela
  area_m2?: number | string;      // Área
  fecha_siembra?: string;         // ISO
  fecha_cosecha_estimada?: string;// ISO
  imagen_url?: string;            // portada opcional
  ph_promedio?: number | string;
  humedad_promedio?: number | string; // %
};

// ---------- CONSTANTES ----------
const ESTADOS: CultivoEstado[] = ["Activo", "En riesgo", "Listo para cosecha", "Suspendido"];
const estadoColor: Record<CultivoEstado, "success" | "warning" | "primary" | "danger"> = {
  Activo: "success",
  "En riesgo": "warning",
  "Listo para cosecha": "primary",
  Suspendido: "danger",
};

export default function ListaCultivos() {
  const { setTitle } = useOutletContext<LayoutContext>();
  const navigate = useNavigate();

  useEffect(() => setTitle("Cultivos"), [setTitle]);

  const [list, setList] = useState<Cultivo[]>([]);
  const [loading, setLoading] = useState(true);

  // filtros
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState<CultivoEstado | "">("");
  const [tipo, setTipo] = useState<string | "">("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  // eliminar
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [rowDelete, setRowDelete] = useState<Cultivo | null>(null);
  const [errorDelete, setErrorDelete] = useState<string>("");

  // cargar
  useEffect(() => {
    (async () => {
      try {
        const data = await getCultivos();
        setList(Array.isArray(data) ? data : []);
      } catch {
        setList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fmt = (s?: string) =>
    s ? new Date(s).toLocaleDateString("es-CO", { year: "numeric", month: "2-digit", day: "2-digit" }) : "—";

  // ---------- MÉTRICAS ----------
  const metrics = useMemo(() => {
    const total = list.length;
    const activos = list.filter((x) => x.estado_cultivo === "Activo").length;
    const riesgo = list.filter((x) => x.estado_cultivo === "En riesgo").length;
    const listos = list.filter((x) => x.estado_cultivo === "Listo para cosecha").length;
    const suspendidos = list.filter((x) => x.estado_cultivo === "Suspendido").length;
    const areaTotal = list.reduce((acc, x) => acc + Number(x.area_m2 || 0), 0);
    const promPH =
      list.length > 0
        ? (list.reduce((acc, x) => acc + Number(x.ph_promedio || 0), 0) / list.length).toFixed(2)
        : "0.00";
    return { total, activos, riesgo, listos, suspendidos, areaTotal, promPH };
  }, [list]);

  // opciones de estado y tipo (con "Todos")
  const estadoOptions = useMemo(
    () => [{ key: "", label: "Todos" }, ...ESTADOS.map((e) => ({ key: e, label: e }))],
    []
  );
  const tiposFromData = useMemo(() => {
    const uniq = Array.from(new Set(list.map((x) => (x.tipo_cultivo || "").trim()).filter(Boolean)));
    return [{ key: "", label: "Todos los tipos" }, ...uniq.map((t) => ({ key: t, label: t }))];
  }, [list]);

  // ---------- FILTRADO ----------
  const filtered = useMemo(() => {
    return list.filter((x) => {
      const texto =
        (x.nombre_cultivo || "") +
        " " +
        (x.descripcion_cultivo || "") +
        " " +
        (x.estado_cultivo || "") +
        " " +
        (x.tipo_cultivo || "") +
        " " +
        (x.lote || "");
      const matchQ = q.trim() ? texto.toLowerCase().includes(q.trim().toLowerCase()) : true;

      const matchEstado = estado ? x.estado_cultivo === estado : true;
      const matchTipo = tipo ? x.tipo_cultivo === tipo : true;

      const toMs = (s?: string) => (s ? new Date(s).getTime() : undefined);
      const d = toMs(x.fecha_siembra);
      const dDesde = toMs(desde);
      const dHasta = toMs(hasta);
      const matchFecha =
        d === undefined ||
        ((dDesde === undefined || (dDesde !== undefined && d >= dDesde)) &&
          (dHasta === undefined || (dHasta !== undefined && d <= dHasta)));

      return matchQ && matchEstado && matchTipo && matchFecha;
    });
  }, [list, q, estado, tipo, desde, hasta]);

  // ---------- ELIMINAR ----------
  // ---------- ELIMINAR ----------
const openDeleteConfirm = (row: Cultivo) => {
  setRowDelete(row);
  setErrorDelete("");
  setOpenDelete(true);
};

const submitDelete = async () => {
  if (!rowDelete?.id_cultivo) return;
  try {
    setDeleting(true);
    await deleteCultivo(Number(rowDelete.id_cultivo));
    setList((prev) => prev.filter((x) => x.id_cultivo !== rowDelete.id_cultivo));
    setOpenDelete(false);
  } catch (e: any) {
    const msgBack = e?.response?.data?.message ?? "No se pudo eliminar el cultivo.";
    setErrorDelete(Array.isArray(msgBack) ? msgBack.join(", ") : String(msgBack));
  } finally {
    setDeleting(false);
  }
};


  // ---------- UI ----------
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-emerald-600" />
          <h2 className="text-2xl font-bold">Cultivos</h2>
        </div>
        <Button
          as={Link}
          to={REGISTER_PATH}
          color="success"
          startContent={<Plus className="h-4 w-4" />}
          className="shadow-sm"
        >
          Nuevo cultivo
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <Metric title="Total" value={metrics.total} />
        <Metric title="Activos" value={metrics.activos} />
        <Metric title="En riesgo" value={metrics.riesgo} />
        <Metric title="Listos p/ cosecha" value={metrics.listos} />
        <Metric title="Suspendidos" value={metrics.suspendidos} />
        <Metric title="Área total (m²)" value={metrics.areaTotal} />
        <Metric title="pH promedio" value={metrics.promPH} />
      </div>

      {/* Filtros */}
      <Card shadow="sm" className="border border-default-200">
        <CardBody className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <Input
            startContent={<Search className="h-4 w-4 text-foreground-500" />}
            placeholder="Buscar por nombre, lote, tipo…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            variant="bordered"
          />
          <Select
            items={estadoOptions}
            selectedKeys={new Set(estado ? [estado] : [""])}
            onSelectionChange={(keys) => {
              const k = (keys as Set<string>).values().next().value as string;
              setEstado(k === "" ? "" : (k as CultivoEstado));
            }}
            placeholder="Estado"
            variant="bordered"
          >
            {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
          </Select>

          <Select
            items={tiposFromData}
            selectedKeys={new Set(tipo ? [tipo] : [""])}
            onSelectionChange={(keys) => {
              const k = (keys as Set<string>).values().next().value as string;
              setTipo(k === "" ? "" : k);
            }}
            placeholder="Tipo de cultivo"
            variant="bordered"
          >
            {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
          </Select>

          <Input
            type="date"
            startContent={<Calendar className="h-4 w-4 text-foreground-500" />}
            placeholder="Desde siembra"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            variant="bordered"
          />
          <Input
            type="date"
            startContent={<Calendar className="h-4 w-4 text-foreground-500" />}
            placeholder="Hasta siembra"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            variant="bordered"
          />
        </CardBody>
      </Card>

      {/* Lista */}
      {loading ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <Card shadow="sm" className="border border-default-200">
          <CardBody className="p-10 text-center space-y-2">
            <p className="text-foreground-600 font-medium">No se encontraron cultivos</p>
            <p className="text-foreground-500 text-sm">Ajusta los filtros o crea un nuevo cultivo.</p>
            <div className="mt-4">
              <Button as={Link} to={REGISTER_PATH} color="success" startContent={<Plus className="h-4 w-4" />}>
                Crear cultivo
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const color = estadoColor[c.estado_cultivo ?? "Activo"] ?? "success";
            return (
              <Card
                key={c.id_cultivo}
                shadow="sm"
                className="border border-default-200 hover:shadow-md transition"
              >
                {/* Imagen / portada */}
                {c.imagen_url ? (
                  <Image
                    src={c.imagen_url}
                    alt={c.nombre_cultivo || "Cultivo"}
                    className="h-40 w-full object-cover rounded-b-none"
                  />
                ) : (
                  <div className="h-40 w-full bg-default-200 flex items-center justify-center rounded-b-none">
                    <Sprout className="h-8 w-8 text-foreground-400" />
                  </div>
                )}

                <CardBody className="p-5 space-y-4">
                  {/* header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold">{c.nombre_cultivo || "Cultivo sin nombre"}</h3>
                      <p className="text-foreground-500 text-sm line-clamp-2">
                        {c.descripcion_cultivo || "—"}
                      </p>
                    </div>
                    <Chip size="sm" color={color} variant="flat" className="rounded-full">
                      {c.estado_cultivo || "Activo"}
                    </Chip>
                  </div>

                  {/* meta */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Meta icon={<MapPin className="h-4 w-4 text-foreground-500" />} label="Lote" value={c.lote || "—"} />
                    <Meta icon={<Sprout className="h-4 w-4 text-foreground-500" />} label="Tipo" value={c.tipo_cultivo || "—"} />
                    <Meta icon={<Calendar className="h-4 w-4 text-foreground-500" />} label="Siembra" value={fmt(c.fecha_siembra)} />
                    <Meta icon={<Calendar className="h-4 w-4 text-foreground-500" />} label="Cosecha est." value={fmt(c.fecha_cosecha_estimada)} />
                    <Meta icon={<FlaskConical className="h-4 w-4 text-foreground-500" />} label="pH" value={String(c.ph_promedio ?? "—")} />
                    <Meta icon={<Droplets className="h-4 w-4 text-foreground-500" />} label="Humedad (%)" value={String(c.humedad_promedio ?? "—")} />
                  </div>

                  {/* acciones */}
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                      as={Link}
                      to={EDIT_PATH(c.id_cultivo)}
                      size="sm"
                      variant="flat"
                      className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20"
                      startContent={<Pencil className="h-4 w-4" />}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      className="bg-red-500/10 text-red-600 hover:bg-red-500/20"
                      startContent={<Trash2 className="h-4 w-4" />}
                      onPress={() => openDeleteConfirm(c)}
                    >
                      Borrar
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {/* Confirmación Borrar */}
      <Modal isOpen={openDelete} onOpenChange={setOpenDelete} placement="center">
        <ModalContent>
          <ModalHeader>Eliminar cultivo</ModalHeader>
          <ModalBody>
            <p>
              ¿Seguro que deseas eliminar{" "}
              <span className="font-semibold">{rowDelete?.nombre_cultivo || "este cultivo"}</span>?
            </p>
            {errorDelete && <p className="text-danger text-xs">{errorDelete}</p>}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setOpenDelete(false)}>
              Cancelar
            </Button>
            <Button color="danger" isLoading={deleting} onPress={submitDelete}>
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

/* ---------- Subcomponentes pequeños ---------- */

function Metric({ title, value }: { title: string; value: number | string }) {
  return (
    <Card shadow="sm" className="border border-default-200">
      <CardBody className="py-4">
        <p className="text-xs text-foreground-500">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </CardBody>
    </Card>
  );
}

function Meta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <p className="text-foreground-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} shadow="sm" className="border border-default-200">
          <div className="h-40 w-full bg-default-200 rounded-b-none" />
          <CardBody className="p-5">
            <div className="animate-pulse space-y-3">
              <div className="h-5 w-1/2 bg-default-200 rounded" />
              <div className="h-4 w-1/3 bg-default-200 rounded" />
              <div className="h-4 w-2/3 bg-default-200 rounded" />
              <div className="h-8 w-full bg-default-200 rounded" />
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
