import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
} from "@heroui/react";
import type { CreateSensorInput, Sensor } from "../model/types";
import { useLotes, useTiposSensor } from "../hooks/useSensores";

export type SensorFormValues = CreateSensorInput;

interface SensorFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: SensorFormValues) => void;
  initial?: Partial<Sensor> | null;
  submitting?: boolean;
  onViewTipos: () => void | Promise<void>;
  onQuickCreateTipo: () => void;
}

export default function SensorForm({
  open,
  onClose,
  onSubmit,
  initial,
  submitting = false,
  onViewTipos,
  onQuickCreateTipo,
}: SensorFormProps) {
  const { data: tipos } = useTiposSensor();
  const { data: lotes } = useLotes();

  const [values, setValues] = useState<SensorFormValues>({
    nombre_sensor: "",
    broker_sensor: "",
    puerto_sensor: 1883,
    topico_sensor: "",
    valor_minimo_sensor: 0,
    valor_maximo_sensor: 100,
    activo: true,
    id_lote_fk: 0,
    id_tipo_sensor_fk: 0,
  });

  useEffect(() => {
    if (open) {
      setValues({
        nombre_sensor: initial?.nombre_sensor || "",
        broker_sensor: initial?.broker_sensor || "",
        puerto_sensor: initial?.puerto_sensor ?? 1883,
        topico_sensor: initial?.topico_sensor || "",
        valor_minimo_sensor: initial?.valor_minimo_sensor ?? 0,
        valor_maximo_sensor: initial?.valor_maximo_sensor ?? 100,
        activo: initial?.activo ?? true,
        id_lote_fk: (initial as any)?.lote?.id_lote_pk ?? 0,
        id_tipo_sensor_fk:
          (initial as any)?.tipo_sensor?.id_tipo_sensor_pk ?? 0,
      });
    }
  }, [open, initial]);

  function handleChange<K extends keyof SensorFormValues>(k: K, v: any) {
    setValues((s) => ({ ...s, [k]: v }));
  }

  function submit() {
    if (!values.nombre_sensor.trim()) return;
    if (!values.broker_sensor.trim()) return;
    if (!values.topico_sensor.trim()) return;
    if (!values.id_lote_fk || !values.id_tipo_sensor_fk) return;
    onSubmit(values);
  }

  return (
    <Modal isOpen={open} onOpenChange={(v) => !v && onClose()}>
      <ModalContent>
        <ModalHeader className="text-lg font-semibold">
          {initial?.id_sensor_pk ? "Editar sensor" : "Nuevo sensor"}
        </ModalHeader>

        <ModalBody className="gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              value={values.nombre_sensor}
              onChange={(e) => handleChange("nombre_sensor", e.target.value)}
              isRequired
            />

            {/* Select de tipo de sensor */}
            <div className="flex items-end gap-2">
<Select
  label="Tipo de sensor"
  selectedKeys={
    values.id_tipo_sensor_fk
      ? new Set([String(values.id_tipo_sensor_fk)])
      : new Set()
  }
  onSelectionChange={(keys) => {
    const id = Number(Array.from(keys)[0]);
    handleChange("id_tipo_sensor_fk", id);
  }}
>
  {(tipos || []).map((t) => (
    <SelectItem
      key={String(t.id_tipo_sensor_pk)} // solo key
    >
      {t.nombre_tipo_sensor}
      {t.unidades_tipo_sensor ? ` (${t.unidades_tipo_sensor})` : ""}
    </SelectItem>
  ))}
</Select>


              
            </div>

            {/* Select de lote */}
            <Select
              label="Lote"
              selectedKeys={
                values.id_lote_fk
                  ? new Set([String(values.id_lote_fk)])
                  : new Set()
              }
              onSelectionChange={(keys) => {
                const id = Number(Array.from(keys)[0]);
                handleChange("id_lote_fk", id);
              }}
            >
              {(lotes || []).map((l) => (
                <SelectItem key={String(l.id_lote_pk)}>
                  {l.nombre_lote || l.codigo || `Lote ${l.id_lote_pk}`}
                </SelectItem>
              ))}
            </Select>

            <Input
              label="Broker"
              placeholder="mqtt://… o host"
              value={values.broker_sensor}
              onChange={(e) => handleChange("broker_sensor", e.target.value)}
            />

            <Input
              type="number"
              label="Puerto"
              value={String(values.puerto_sensor)}
              onChange={(e) =>
                handleChange("puerto_sensor", Number(e.target.value))
              }
            />

            <Input
              label="Tópico"
              value={values.topico_sensor}
              onChange={(e) => handleChange("topico_sensor", e.target.value)}
            />

            <Input
              type="number"
              label="Valor mínimo"
              value={String(values.valor_minimo_sensor)}
              onChange={(e) =>
                handleChange("valor_minimo_sensor", Number(e.target.value))
              }
            />

            <Input
              type="number"
              label="Valor máximo"
              value={String(values.valor_maximo_sensor)}
              onChange={(e) =>
                handleChange("valor_maximo_sensor", Number(e.target.value))
              }
            />

            <div className="flex items-center gap-2">
              <Switch
                isSelected={!!values.activo}
                onValueChange={(v) => handleChange("activo", v)}
              >
                Activo
              </Switch>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button color="primary" onPress={submit} isLoading={submitting}>
            {initial?.id_sensor_pk ? "Guardar" : "Crear"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
