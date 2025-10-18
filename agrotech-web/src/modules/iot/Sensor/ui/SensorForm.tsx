import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  Input,
  Select,
  SelectItem,
  Switch,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@heroui/react";
import { toast } from "react-toastify";
import { useCreateSensor, useUpdateSensor } from "../hooks";
import { getCultivos } from "../../../cultivo/cultivo/api";
import { tipoSensorService } from "../../TipoSensor/api/tipoSensor.service";
import type { Cultivo } from "../../../cultivo/cultivo/model/types";
import type { TipoSensor as TipoSensorType } from "../../TipoSensor/model/types";
import type { Sensor, SensorDTO } from "../model/types";
import { PlusIcon, UploadCloudIcon } from "lucide-react";

interface Props {
  sensorToEdit?: Sensor | null;
  onSuccess?: () => void;
}

export function SensorForm({ sensorToEdit, onSuccess }: Props) {
  const isEditMode = !!sensorToEdit;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Fecha local actual corregida (sin desfasar al día siguiente)
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  const [form, setForm] = useState<SensorDTO>({
    nombre_sensor: "",
    valor_minimo: undefined as unknown as number,
    valor_maximo: undefined as unknown as number,
    fecha_inicio_sensor: today,
    fecha_fin_sensor: "",
    id_cultivo_fk: 0,
    id_tipo_sensor_fk: 0,
    activo: true,
  });

  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [tiposSensor, setTiposSensor] = useState<TipoSensorType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoTipoNombre, setNuevoTipoNombre] = useState("");

  const { createSensor, loading: isCreating } = useCreateSensor();
  const { updateSensor, loading: isUpdating } = useUpdateSensor();
  const isLoading = isCreating || isUpdating;

  /* ===========================
   * Cargar datos iniciales
   * =========================== */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [cultivosData, tiposData] = await Promise.all([
          getCultivos(),
          tipoSensorService.list(),
        ]);
        setCultivos(cultivosData);
        setTiposSensor(tiposData);
      } catch {
        toast.error("Error al cargar datos del formulario.");
      }
    };
    loadInitialData();
  }, []);

  /* ===========================
   * Modo edición
   * =========================== */
  useEffect(() => {
    if (isEditMode && sensorToEdit) {
      setForm({
        nombre_sensor: sensorToEdit.nombre_sensor,
        valor_minimo: sensorToEdit.valor_minimo,
        valor_maximo: sensorToEdit.valor_maximo,
        fecha_inicio_sensor: sensorToEdit.fecha_inicio_sensor.split("T")[0],
        fecha_fin_sensor: sensorToEdit.fecha_fin_sensor.split("T")[0],
        id_cultivo_fk: sensorToEdit.cultivo.id_cultivo_pk,
        id_tipo_sensor_fk: sensorToEdit.tipo_sensor.id_tipo_sensor_pk,
        activo: sensorToEdit.activo,
      });
      setPreview(sensorToEdit.imagen_sensor || null);
    }
  }, [sensorToEdit, isEditMode]);

  const handleChange = (field: keyof SensorDTO, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* ===========================
   * Validación de imagen
   * =========================== */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    const maxSizeMB = 20;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      toast.error("Formato de imagen no válido. Usa JPG, PNG o WEBP.");
      e.target.value = "";
      return;
    }

    if (file.size > maxSizeBytes) {
      toast.error(`La imagen supera los ${maxSizeMB} MB permitidos.`);
      e.target.value = "";
      return;
    }

    setImagenFile(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ===========================
   * Validaciones del formulario
   * =========================== */
  const validateForm = (): boolean => {
    if (!form.nombre_sensor.trim()) {
      toast.error("El nombre del sensor es obligatorio.");
      return false;
    }
    if (form.valor_minimo == null || form.valor_maximo == null) {
      toast.error("Debes ingresar los valores mínimo y máximo.");
      return false;
    }
    if (form.valor_minimo < 0 || form.valor_maximo < 0) {
      toast.error("Los valores deben ser positivos.");
      return false;
    }
    if (Number(form.valor_maximo) <= Number(form.valor_minimo)) {
      toast.error("El valor máximo debe ser mayor que el mínimo.");
      return false;
    }
    if (!form.fecha_fin_sensor) {
      toast.error("Debes seleccionar la fecha de fin.");
      return false;
    }
    if (new Date(form.fecha_fin_sensor) < new Date(form.fecha_inicio_sensor)) {
      toast.error("La fecha de fin no puede ser anterior a la de inicio.");
      return false;
    }
    if (!form.id_cultivo_fk) {
      toast.error("Debes seleccionar un cultivo.");
      return false;
    }
    if (!form.id_tipo_sensor_fk) {
      toast.error("Debes seleccionar un tipo de sensor.");
      return false;
    }
    return true;
  };

  /* ===========================
   * Agregar nuevo tipo de sensor
   * =========================== */
  const handleAddTipoSensor = async () => {
    if (!nuevoTipoNombre.trim()) return toast.error("El nombre es requerido.");
    try {
      const nuevoTipo = await tipoSensorService.create({
        nombre: nuevoTipoNombre,
      });
      const updatedList = await tipoSensorService.list();
      setTiposSensor(updatedList);

      handleChange("id_tipo_sensor_fk", nuevoTipo.id_tipo_sensor);
      toast.success("Tipo de sensor agregado.");
      setIsModalOpen(false);
      setNuevoTipoNombre("");
    } catch {
      toast.error("Error al crear el tipo de sensor.");
    }
  };

  /* ===========================
   * Envío del formulario
   * =========================== */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    let success = false;
    const payload = { ...form };

    try {
      if (isEditMode && sensorToEdit) {
        const result = await updateSensor(
          sensorToEdit.id_sensor_pk,
          payload,
          imagenFile ?? undefined
        );
        success = !!result;
      } else {
        const result = await createSensor(payload, imagenFile ?? undefined);
        success = !!result;
      }

      if (success) {
        toast.success(
          `Sensor ${isEditMode ? "actualizado" : "creado"} correctamente.`
        );
        onSuccess?.();
      }
    } catch {
      toast.error("Error al guardar el sensor.");
    }
  };

  /* ===========================
   * Render
   * =========================== */
  return (
    <Card className="p-8 shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        {isEditMode ? "Editar Sensor" : "Registrar Sensor"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        <Input
          label="Nombre del sensor"
          value={form.nombre_sensor}
          onValueChange={(v) => handleChange("nombre_sensor", v)}
          isRequired
        />

        <Input
          label="Valor mínimo"
          type="number"
          placeholder="Ej: 10"
          min={0}
          value={form.valor_minimo === undefined ? "" : String(form.valor_minimo)}
          onValueChange={(v) =>
            handleChange("valor_minimo", v ? Number(v) : undefined)
          }
          isRequired
        />

        <Input
          label="Valor máximo"
          type="number"
          placeholder="Ej: 50"
          min={0}
          value={form.valor_maximo === undefined ? "" : String(form.valor_maximo)}
          onValueChange={(v) =>
            handleChange("valor_maximo", v ? Number(v) : undefined)
          }
          isRequired
        />

        <Input label="Fecha inicio" type="date" value={form.fecha_inicio_sensor} isDisabled />

        <Input
          label="Fecha fin"
          type="date"
          min={form.fecha_inicio_sensor}
          value={form.fecha_fin_sensor}
          onValueChange={(v) => handleChange("fecha_fin_sensor", v)}
          isRequired
        />

        <Select
          label="Cultivo"
          selectedKeys={form.id_cultivo_fk ? [String(form.id_cultivo_fk)] : []}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            handleChange("id_cultivo_fk", Number(e.target.value))
          }
          isRequired
        >
          {cultivos.map((c) => (
            <SelectItem key={c.id_cultivo_pk}>{c.nombre_cultivo}</SelectItem>
          ))}
        </Select>

        <div className="flex items-end gap-2">
          <Select
            label="Tipo de Sensor"
            selectedKeys={
              form.id_tipo_sensor_fk ? [String(form.id_tipo_sensor_fk)] : []
            }
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleChange("id_tipo_sensor_fk", Number(e.target.value))
            }
            className="flex-grow"
            isRequired
          >
            {tiposSensor.map((t) => (
              <SelectItem key={t.id_tipo_sensor}>{t.nombre}</SelectItem>
            ))}
          </Select>
          <Button
            type="button"
            onPress={() => setIsModalOpen(true)}
            className="h-10 flex-shrink-0"
          >
            <PlusIcon size={20} />
          </Button>
        </div>

        {isEditMode && (
          <div className="flex items-center gap-2">
            <Switch
              isSelected={form.activo}
              onValueChange={(v: boolean) => handleChange("activo", v)}
            >
              Sensor Activo
            </Switch>
          </div>
        )}

        {/* Imagen del sensor */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen del Sensor
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition"
          >
            {preview ? (
              <img
                src={preview}
                alt="Vista previa"
                className="w-48 h-48 object-cover rounded-lg shadow"
              />
            ) : (
              <>
                <UploadCloudIcon className="h-10 w-10 text-gray-400" />
                <p className="text-gray-500 mt-2">
                  Clic para seleccionar una imagen
                </p>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/jpeg,image/png,image/jpg,image/webp"
            />
          </div>
        </div>

        <div className="sm:col-span-2 flex justify-center mt-6">
          <Button
            type="submit"
            color="primary"
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading
              ? "Guardando..."
              : isEditMode
              ? "Actualizar Sensor"
              : "Guardar Sensor"}
          </Button>
        </div>
      </form>

      {/* Modal nuevo tipo de sensor */}
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalHeader>Registrar Nuevo Tipo de Sensor</ModalHeader>
        <ModalBody>
          <Input
            label="Nombre del tipo"
            value={nuevoTipoNombre}
            onValueChange={setNuevoTipoNombre}
            placeholder="Ej: Humedad del Suelo"
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button color="primary" onPress={handleAddTipoSensor}>
            Guardar
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  );
}
