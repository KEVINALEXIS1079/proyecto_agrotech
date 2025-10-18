import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSensorList, useDeleteSensor, useRestoreSensor } from "../hooks";
import { SensorList } from "../ui/SensorList";
import type { Sensor } from "../model/types";
import {
  Input,
  Button,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import {
  EyeIcon,
  EyeSlashIcon,
  CpuChipIcon,
  PlusIcon,
  MagnifyingGlassIcon as SearchIcon,
} from "@heroicons/react/24/outline";

export const ListaPage: React.FC = () => {
  const navigate = useNavigate();
  const { sensors, deletedSensors, loading, error } = useSensorList();
  const { deleteSensor, loading: isDeleting } = useDeleteSensor();
  const { restoreSensor, loading: isRestoring } = useRestoreSensor();

  const [filterValue, setFilterValue] = useState("");
  const [viewingDeleted, setViewingDeleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sensorToAction, setSensorToAction] = useState<Sensor | null>(null);

  const listToDisplay = useMemo(
    () => (viewingDeleted ? deletedSensors : sensors),
    [viewingDeleted, sensors, deletedSensors]
  );

  const filteredSensors = useMemo(() => {
    if (!filterValue) return listToDisplay;
    return listToDisplay.filter((sensor) =>
      sensor.nombre_sensor.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [listToDisplay, filterValue]);

  const handleNavigateToAdd = () => navigate("/iot-registrar");
  const handleNavigateToEdit = (sensor: Sensor) =>
    navigate(`/iot/editar/${sensor.id_sensor_pk}`);
  const handleNavigateToTipoSensor = () => navigate("/tipo-sensor");

  const openDeleteModal = (sensor: Sensor) => {
    setSensorToAction(sensor);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!sensorToAction) return;
    const success = await deleteSensor(sensorToAction.id_sensor_pk);
    if (success) {
      toast.success(`Sensor "${sensorToAction.nombre_sensor}" eliminado.`);
    } else {
      toast.error("Error al eliminar el sensor.");
    }
    setIsModalOpen(false);
    setSensorToAction(null);
  };

  const handleRestore = async (sensor: Sensor) => {
    const success = await restoreSensor(sensor.id_sensor_pk);
    if (success) {
      toast.success(`Sensor "${sensor.nombre_sensor}" restaurado.`);
    } else {
      toast.error("Error al restaurar el sensor.");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* --- Header --- */}
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {viewingDeleted ? "Sensores Eliminados" : "Gestión de Sensores"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {viewingDeleted
              ? "Visualiza y restaura los sensores eliminados."
              : "Crea, edita y elimina los sensores de tus cultivos."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleNavigateToTipoSensor}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-gray-700 transition-colors"
          >
            <CpuChipIcon className="h-5 w-5" />
            Ir a Tipos de Sensor
          </button>

          <button
            onClick={() => setViewingDeleted(!viewingDeleted)}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-gray-50 transition-colors"
          >
            {viewingDeleted ? (
              <EyeIcon className="h-5 w-5" />
            ) : (
              <EyeSlashIcon className="h-5 w-5" />
            )}
            {viewingDeleted ? "Ver Activos" : "Ver Eliminados"}
          </button>

          {!viewingDeleted && (
            <button
              onClick={handleNavigateToAdd}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-green-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Registrar Sensor
            </button>
          )}
        </div>
      </header>

      {/* --- Search Input --- */}
      <div className="mb-6">
        <Input
          isClearable
          className="w-full sm:max-w-xs"
          placeholder="Buscar por nombre..."
          startContent={<SearchIcon className="h-5 w-5 text-gray-400" />}
          value={filterValue}
          onValueChange={setFilterValue}
        />
      </div>

      {/* --- Main Content --- */}
      <main>
        {loading && (
          <div className="flex justify-center items-center h-64">
            <Spinner label="Cargando..." />
          </div>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && (
          <SensorList
            sensors={filteredSensors}
            onEdit={handleNavigateToEdit}
            onDelete={openDeleteModal}
            onRestore={handleRestore}
          />
        )}
      </main>

      {/* --- Modal --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader className="font-bold">Confirmar Eliminación</ModalHeader>
          <ModalBody>
            <p>
              ¿Estás seguro de que deseas eliminar el sensor
              <span className="font-bold">
                {" "}
                "{sensorToAction?.nombre_sensor}"
              </span>
              ?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button color="danger" onClick={confirmDelete} isLoading={isDeleting}>
              {isDeleting ? "Eliminando..." : "Aceptar"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* --- Status Toast --- */}
      {(isDeleting || isRestoring) && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-xl animate-pulse">
          {isRestoring ? "Restaurando sensor..." : "Eliminando sensor..."}
        </div>
      )}
    </div>
  );
};
