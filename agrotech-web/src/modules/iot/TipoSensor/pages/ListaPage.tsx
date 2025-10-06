import { useEffect, useState } from "react";
import { Card, CardBody, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner } from "@heroui/react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/shared/api/client";
import type { TipoSensor } from "../model/types";

// Rutas
const CREATE_PATH = "/tipo-sensor/crear";
const EDIT_PATH = (id: number) => `/tipo-sensor/editar/${id}`;

export default function ListaPageTipoSensor() {
  const [list, setList] = useState<TipoSensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [rowDelete, setRowDelete] = useState<TipoSensor | null>(null);

  // Cargar tipo sensores
  useEffect(() => {
    api
      .get("/tipo-sensor")
      .then((res) => {
        if (Array.isArray(res.data)) {
          const activeItems = res.data.filter((item: TipoSensor) => item.deletedAt == null);
          setList(activeItems);
        } else {
          setList([]);
        }
      })
      .catch((err) => {
        console.error("Error cargando tipos de sensor:", err);
        setError("No se pudieron cargar los tipos de sensor.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Abrir modal de confirmación
  const openDeleteConfirm = (row: TipoSensor) => {
    setRowDelete(row);
    setOpenDelete(true);
  };

  // Eliminar tipo sensor
  const submitDelete = async () => {
    if (!rowDelete) return;
    try {
      await api.delete(`/tipo-sensor/${rowDelete.id_tipo_sensor_pk}`);
      setList((prev) => prev.filter((s) => s.id_tipo_sensor_pk !== rowDelete.id_tipo_sensor_pk));
    } catch (err) {
      console.error("Error eliminando:", err);
      alert("No se pudo eliminar el tipo de sensor");
    } finally {
      setOpenDelete(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Tipos de Sensor</h2>
        <Button as={Link} to={CREATE_PATH} color="success" startContent={<Plus className="h-4 w-4" />}>
          Nuevo tipo sensor
        </Button>
      </div>

      {/* Listado */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <Card>
          <CardBody className="text-red-500">{error}</CardBody>
        </Card>
      ) : list.length === 0 ? (
        <Card>
          <CardBody>No se encontraron tipos de sensor</CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((s) => (
            <Card key={s.id_tipo_sensor_pk} shadow="sm" className="hover:shadow-md transition">
              <CardBody className="space-y-3">
                <h3 className="font-semibold text-lg">{s.nombre_tipo_sensor}</h3>

                {/* Acciones */}
                <div className="flex justify-end gap-2 pt-3">
                  <Button
                    as={Link}
                    to={EDIT_PATH(s.id_tipo_sensor_pk)}
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
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Modal delete */}
      <Modal isOpen={openDelete} onOpenChange={setOpenDelete}>
        <ModalContent>
          <ModalHeader>Eliminar tipo de sensor</ModalHeader>
          <ModalBody>
            ¿Seguro que deseas eliminar <strong>{rowDelete?.nombre_tipo_sensor}</strong>?
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
