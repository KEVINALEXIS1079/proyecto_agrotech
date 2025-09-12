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
} from "@heroui/react";
import { Calendar, Clock4, HandCoins, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import type { LayoutContext } from "../../../layouts/ProtectedLayout";
import type { Actividad } from "../../../services/actividad";
import { getActividades, deleteActividad } from "../../../services/actividad";

const REGISTER_PATH = "/registrar-actividad";
const EDIT_PATH = (id: number) => `/actividades-editar/${id}`;

const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const ESTADOS: Actividad["estado_actividad"][] = ["Pendiente", "En progreso", "Completada", "Cancelada"];
const estadoColor: Record<Actividad["estado_actividad"], "warning" | "primary" | "success"|"danger"> = {
  Pendiente: "warning",
  "En progreso": "primary",
  Completada: "success",
  Cancelada: "danger",
};

export default function ListaActividades() {
  const { setTitle } = useOutletContext<LayoutContext>();
  const navigate = useNavigate();

  useEffect(() => setTitle("Lista de actividades"), [setTitle]);

  const [list, setList] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);

  // filtros
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState<Actividad["estado_actividad"] | "">("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  // eliminar
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [rowDelete, setRowDelete] = useState<Actividad | null>(null);
  const [errorDelete, setErrorDelete] = useState<string>("");

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

  const fmt = (s?: string) =>
    s ? new Date(s).toLocaleDateString("es-CO", { year: "numeric", month: "2-digit", day: "2-digit" }) : "";

  // métricas
  const metrics = useMemo(() => {
    const total = list.length;
    const pendientes = list.filter((x) => x.estado_actividad === "Pendiente").length;
    const enProgreso = list.filter((x) => x.estado_actividad === "En progreso").length;
    const Completada = list.filter((x) => x.estado_actividad === "Completada").length;
    const Cancelada = list.filter((x) => x.estado_actividad === "Cancelada").length;
    const horas = list.reduce((acc, x) => acc + Number(x.tiempo_actividad || 0), 0);
    const costo = list.reduce((acc, x) => acc + Number(x.costo_mano_obra_actividad || 0), 0);
    return { total, pendientes, enProgreso, Completada,Cancelada, horas, costo };
  }, [list]);


  const estadoOptions = useMemo(
    () => [{ key: "", label: "Todos" }, ...ESTADOS.map((e) => ({ key: e, label: e }))],
    []
  );

  // filtrar
  const filtered = useMemo(() => {
    return list.filter((x) => {
      const texto =
        (x.nombre_actividad || "") +
        " " +
        (x.descripcion_actividad || "") +
        " " +
        (x.estado_actividad || "");
      const matchQ = q.trim()
        ? texto.toLowerCase().includes(q.trim().toLowerCase())
        : true;

      const matchEstado = estado ? x.estado_actividad === estado : true;

      const f = (s?: string) => (s ? new Date(s).getTime() : undefined);
      const d = f(x.fecha_actividad);
      const dDesde = f(desde);
      const dHasta = f(hasta);

      const matchFecha =
        d === undefined ||
        ((dDesde === undefined || (dDesde !== undefined && d >= dDesde)) &&
          (dHasta === undefined || (dHasta !== undefined && d <= dHasta)));

      return matchQ && matchEstado && matchFecha;
    });
  }, [list, q, estado, desde, hasta]);

  const openDeleteConfirm = (row: Actividad) => {
    setRowDelete(row);
    setErrorDelete("");
    setOpenDelete(true);
  };

  const submitDelete = async () => {
    if (!rowDelete?.id_actividad) return;
    try {
      setDeleting(true);
      await deleteActividad(rowDelete.id_actividad);
      setList((prev) => prev.filter((x) => x.id_actividad !== rowDelete.id_actividad));
      setOpenDelete(false);
    } catch (e: any) {
      const msgBack = e?.response?.data?.message ?? "No se pudo eliminar la actividad.";
      setErrorDelete(Array.isArray(msgBack) ? msgBack.join(", ") : String(msgBack));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Lista de actividades</h2>
        <Button
          as={Link}
          to={REGISTER_PATH}
          color="success"
          startContent={<Plus className="h-4 w-4" />}
          className="shadow-sm"
        >
          Nueva actividad
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <Card shadow="sm" className="border border-default-200">
          <CardBody className="py-4">
            <p className="text-xs text-foreground-500">Total</p>
            <p className="text-xl font-semibold">{metrics.total}</p>
          </CardBody>
        </Card>
        <Card shadow="sm" className="border border-default-200">
          <CardBody className="py-4">
            <p className="text-xs text-foreground-500">Pendientes</p>
            <p className="text-xl font-semibold">{metrics.pendientes}</p>
          </CardBody>
        </Card>
        <Card shadow="sm" className="border border-default-200">
          <CardBody className="py-4">
            <p className="text-xs text-foreground-500">En progreso</p>
            <p className="text-xl font-semibold">{metrics.enProgreso}</p>
          </CardBody>
        </Card>
        <Card shadow="sm" className="border border-default-200">
          <CardBody className="py-4">
            <p className="text-xs text-foreground-500">Completada</p>
            <p className="text-xl font-semibold">{metrics.Completada}</p>
          </CardBody>
        </Card>
        <Card shadow="sm" className="border border-default-200">
          <CardBody className="py-4">
            <p className="text-xs text-foreground-500">Cancelada</p>
            <p className="text-xl font-semibold">{metrics.Cancelada}</p>
          </CardBody>
        </Card>
        <Card shadow="sm" className="border border-default-200">
          <CardBody className="py-4">
            <p className="text-xs text-foreground-500">Horas</p>
            <p className="text-xl font-semibold">{metrics.horas}</p>
          </CardBody>
        </Card>
        <Card shadow="sm" className="border border-default-200">
          <CardBody className="py-4">
            <p className="text-xs text-foreground-500">Costo</p>
            <p className="text-xl font-semibold">{COP.format(metrics.costo)}</p>
          </CardBody>
        </Card>
      </div>

      <Card shadow="sm" className="border border-default-200">
        <CardBody className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            startContent={<Search className="h-4 w-4 text-foreground-500" />}
            placeholder="Buscar por nombre, descripción, estado…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            variant="bordered"
          />
          <Select
            items={estadoOptions}
            selectedKeys={new Set(estado ? [estado] : [""])}
            onSelectionChange={(keys) => {
              const k = (keys as Set<string>).values().next().value as string;
              setEstado(k === "" ? "" : (k as Actividad["estado_actividad"]));
            }}
            placeholder="Filtrar por estado"
            variant="bordered"
          >
            {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
          </Select>
          <Input
            type="date"
            labelPlacement="outside"
            startContent={<Calendar className="h-4 w-4 text-foreground-500" />}
            placeholder="Desde"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            variant="bordered"
          />
          <Input
            type="date"
            labelPlacement="outside"
            startContent={<Calendar className="h-4 w-4 text-foreground-500" />}
            placeholder="Hasta"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            variant="bordered"
          />
        </CardBody>
      </Card>


      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} shadow="sm" className="border border-default-200">
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
      ) : filtered.length === 0 ? (
        <Card shadow="sm" className="border border-default-200">
          <CardBody className="p-10 text-center">
            <p className="text-foreground-600 font-medium">No se encontraron actividades</p>
            <p className="text-foreground-500 text-sm">
              Ajusta los filtros o crea una nueva actividad.
            </p>
            <div className="mt-4">
              <Button as={Link} to={REGISTER_PATH} color="success" startContent={<Plus className="h-4 w-4" />}>
                Crear actividad
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((a) => {
            const color = estadoColor[a.estado_actividad ?? "En progreso"] ?? "primary";
            return (
              <Card key={a.id_actividad} shadow="sm" className="border border-default-200 hover:shadow-md transition">
                <CardBody className="p-5 space-y-4">
                
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold">{a.nombre_actividad}</h3>
                      <p className="text-foreground-500 text-sm line-clamp-2">{a.descripcion_actividad}</p>
                    </div>
                    <Chip size="sm" color={color} variant="flat" className="rounded-full">
                      {a.estado_actividad}
                    </Chip>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-foreground-500" />
                      <div>
                        <p className="text-foreground-500">Fecha</p>
                        <p className="font-medium">{fmt(a.fecha_actividad)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock4 className="h-4 w-4 text-foreground-500" />
                      <div>
                        <p className="text-foreground-500">Tiempo (h)</p>
                        <p className="font-medium">{a.tiempo_actividad}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <HandCoins className="h-4 w-4 text-foreground-500" />
                      <div>
                        <p className="text-foreground-500">Costo</p>
                        <p className="font-medium">{COP.format(Number(a.costo_mano_obra_actividad || 0))}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-foreground-500" />
                      <div>
                        <p className="text-foreground-500">Rango</p>
                        <p className="font-medium">
                          {fmt(a.fecha_inicio_actividad)} — {fmt(a.fecha_fin_actividad)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                      as={Link}
                      to={EDIT_PATH(Number(a.id_actividad))}
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
                      onPress={() => openDeleteConfirm(a)}
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


      <Modal isOpen={openDelete} onOpenChange={(o) => setOpenDelete(o)} placement="center">
        <ModalContent>
          <ModalHeader>Eliminar actividad</ModalHeader>
          <ModalBody>
            <p>
              ¿Seguro que deseas eliminar{" "}
              <span className="font-semibold">{rowDelete?.nombre_actividad}</span>?
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
