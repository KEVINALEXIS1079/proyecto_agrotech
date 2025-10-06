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
  Spinner,
} from "@heroui/react";
import { Activity, Plus, Search, Trash2, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/shared/api/client";
import type { Sensor } from "../model/types";




// ------------------ constantes ------------------
const CREATE_PATH = "/iot-registrar";
const EDIT_PATH = (id: number) => `/iot/editar/${id}`;

const estadoColor: Record<Sensor["estado"], "success" | "warning"> = {
  Activo: "success",
  Inactivo: "warning",
};

// ------------------ page ------------------
export default function IotPage() {
  const [list, setList] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filtros
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState<Sensor["estado"] | "">("");

  // eliminar
  const [openDelete, setOpenDelete] = useState(false);
  const [rowDelete, setRowDelete] = useState<Sensor | null>(null);

  // cargar sensores
useEffect(() => {
  api
    .get("/sensores")
    .then((res) => {
      if (Array.isArray(res.data)) {
        // --- CAMBIO CLAVE AQUÍ ---
        const activeSensors = res.data.filter(
          (sensor: Sensor) => sensor.delete_at === null
        );
        setList(activeSensors);
        // -------------------------
      } else {
        setList([]);
      }
    })
    .catch((err) => {
      console.error("Error cargando sensores:", err);
      setError("No se pudieron cargar los sensores. Verifica el backend.");
      setList([]);
    })
    .finally(() => setLoading(false));
}, []);


  // métricas
  const metrics = useMemo(() => {
    const total = list.length;
    const activos = list.filter((s) => s.estado === "Activo").length;
    const inactivos = list.filter((s) => s.estado === "Inactivo").length;
    return { total, activos, inactivos };
  }, [list]);

  // opciones de filtro
  const estadoOptions = [
    { key: "", label: "Todos" },
    { key: "Activo", label: "Activo" },
    { key: "Inactivo", label: "Inactivo" },
  ];

  // filtrado
  const filtered = useMemo(() => {
    return list.filter((s) => {
      const matchQ = q.trim()
        ? s.nombre_sensor.toLowerCase().includes(q.trim().toLowerCase())
        : true;
      const matchEstado = estado ? s.estado === estado : true;
      return matchQ && matchEstado;
    });
  }, [list, q, estado]);

  // eliminar
  const openDeleteConfirm = (row: Sensor) => {
    setRowDelete(row);
    setOpenDelete(true);
  };

  const submitDelete = async () => {
    if (!rowDelete) return;
    try {
      await api.delete(`/sensores/${rowDelete.id_sensor_pk}`);
      setList((prev) =>
        prev.filter((s) => s.id_sensor_pk !== rowDelete.id_sensor_pk)
      );
    } catch (err) {
      console.error("Error eliminando:", err);
      alert("No se pudo eliminar el sensor");
    } finally {
      setOpenDelete(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* header */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Panel IoT</h2>
        <Button
          as={Link}
          to={CREATE_PATH}
          color="success"
          startContent={<Plus className="h-4 w-4" />}
          className="shadow-sm"
        >
          Nuevo sensor
        </Button>
      </div>

      {/* métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card shadow="sm">
          <CardBody>
            <p>Total</p>
            <p className="text-xl">{metrics.total}</p>
          </CardBody>
        </Card>
        <Card shadow="sm">
          <CardBody>
            <p>Activos</p>
            <p className="text-xl">{metrics.activos}</p>
          </CardBody>
        </Card>
        <Card shadow="sm">
          <CardBody>
            <p>Inactivos</p>
            <p className="text-xl">{metrics.inactivos}</p>
          </CardBody>
        </Card>
      </div>

      {/* filtros */}
      <Card shadow="sm">
        <CardBody className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            startContent={<Search className="h-4 w-4 text-foreground-500" />}
            placeholder="Buscar sensor…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            variant="bordered"
          />
          <Select
            label="Estado"
            aria-label="Filtrar por estado del sensor"
            items={estadoOptions}
            selectedKeys={new Set(estado ? [estado] : [""])}
            onSelectionChange={(keys) => {
              const k = (keys as Set<string>).values().next().value as string;
              setEstado(k === "" ? "" : (k as Sensor["estado"]));
            }}
            placeholder="Selecciona un estado"
            variant="bordered"
          >
            {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
          </Select>
        </CardBody>
      </Card>

      {/* listado */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <Card>
          <CardBody className="text-red-500">{error}</CardBody>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardBody>No se encontraron sensores</CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((s) => {
            const color = estadoColor[s.estado] ?? "primary";
            return (
              <Card
                key={s.id_sensor_pk}
                shadow="sm"
                className="hover:shadow-md transition"
              >
                <CardBody className="space-y-3">
                  <h3 className="font-semibold text-lg">{s.nombre_sensor}</h3>

                  <p className="text-sm text-foreground-500">
                    Tipo: {s.tipo_sensor?.nombre_tipo_sensor}
                  </p>

                  <p className="text-sm text-foreground-500">
                    Cultivo: {s.cultivo?.nombre_cultivo}
                  </p>

                  <p className="text-sm text-foreground-500">
                    Rango: {s.valor_minimo} – {s.valor_maximo}
                  </p>

                  <p className="text-xs text-foreground-400">
                    Activo desde{" "}
                    {new Date(s.fecha_inicio_sensor).toLocaleDateString()} hasta{" "}
                    {new Date(s.fecha_fin_sensor).toLocaleDateString()}
                  </p>

                  <Chip
                    size="sm"
                    color={
                      estadoColor[
                        s.cultivo.estado_cultivo as "Activo" | "Inactivo"
                      ]
                    }
                    variant="flat"
                  >
                    {s.cultivo.estado_cultivo}
                  </Chip>

                  {/* acciones */}
                  <div className="flex justify-end gap-2 pt-3">
                    <div className="flex justify-end gap-2 pt-3">
                      <Button
                        as={Link}
                        to={EDIT_PATH(Number(s.id_sensor_pk))}
                        size="sm"
                        color="primary"
                        variant="flat"
                        startContent={<Pencil className="h-4 w-4" />}
                      >
                        Editar
                      </Button>

                      <Button
                        size="sm"
                        variant="flat"
                        className="bg-red-500/10 text-red-600 hover:bg-red-500/20"
                        startContent={<Trash2 className="w-4 h-4" />}
                        onPress={() => openDeleteConfirm(s)}
                      >
                        Borrar
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {/* modal delete */}
      <Modal isOpen={openDelete} onOpenChange={setOpenDelete}>
        <ModalContent>
          <ModalHeader>Eliminar sensor</ModalHeader>
          <ModalBody>
            ¿Seguro que deseas eliminar{" "}
            <strong>{rowDelete?.nombre_sensor}</strong>?
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setOpenDelete(false)}>
              Cancelar
            </Button>
            <Button color="danger" onPress={submitDelete}>
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
