// src/modules/iot/tipo-sensor/ui/TipoSensorForm.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Chip,
  Card,
  CardBody,
  Tooltip,
} from "@heroui/react";
import type {
  CreateTipoSensorInput,
  UpdateTipoSensorInput,
  TipoSensor,
} from "../model/types";
import ImagePreview from "./ImagePreview";

export type TipoSensorFormValues = CreateTipoSensorInput;

const isValidRemotePath = (s: string) =>
  /^(https?:\/\/)/i.test(s) || /^\/?uploads\//i.test(s); // http(s) o ruta relativa del backend

export default function TipoSensorForm({
  open,
  onClose,
  onSubmit,
  initial,
  submitting = false,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TipoSensorFormValues) => void;
  initial?: Partial<TipoSensor> | null;
  submitting?: boolean;
}) {
  const [values, setValues] = useState<TipoSensorFormValues>({
    nombre_tipo_sensor: "",
    unidades_tipo_sensor: "",
    decimales_tipo_sensor: undefined,
    imagen_tipo_sensor: null, // no lo usamos directo; controlamos con file/url
  });

  // archivo seleccionado
  const [fileObj, setFileObj] = useState<File | null>(null);
  // url/ruta pegada (absoluta o relativa)
  const [imageUrl, setImageUrl] = useState<string>("");
  const [urlError, setUrlError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset al abrir / hidratar con initial
  useEffect(() => {
    if (!open) return;
    setValues({
      nombre_tipo_sensor: initial?.nombre_tipo_sensor || "",
      unidades_tipo_sensor: initial?.unidades_tipo_sensor || "",
      decimales_tipo_sensor: initial?.decimales_tipo_sensor ?? undefined,
      imagen_tipo_sensor: null,
    });
    setFileObj(null);
    const initialImg =
      typeof initial?.imagen_tipo_sensor === "string" ? initial.imagen_tipo_sensor : "";
    setImageUrl(initialImg);
    setUrlError(null);
  }, [open, initial]);

  // Preview preferencia: File -> URL pegada -> (fallback) initial string
  const imagePreviewSrc = useMemo(() => {
    if (fileObj) return fileObj as unknown as File; // ImagePreview acepta File
    if (imageUrl?.trim()) return imageUrl.trim();
    return (typeof initial?.imagen_tipo_sensor === "string"
      ? initial?.imagen_tipo_sensor
      : null) as string | null;
  }, [fileObj, imageUrl, initial?.imagen_tipo_sensor]);

  function handleChange<K extends keyof TipoSensorFormValues>(key: K, v: any) {
    setValues((s) => ({ ...s, [key]: v }));
  }

  const triggerFile = () => fileInputRef.current?.click();

  const clearImage = () => {
    setFileObj(null);
    setImageUrl("");
    setUrlError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  function submit() {
    const url = imageUrl.trim();
    const payload: CreateTipoSensorInput | UpdateTipoSensorInput = {
      ...values,
      // prioridad: archivo si existe; si no, string válida; si no, undefined (mantiene actual)
      imagen_tipo_sensor: fileObj
        ? fileObj
        : url && isValidRemotePath(url)
        ? url
        : undefined,
    };
    onSubmit(payload as CreateTipoSensorInput);
  }

  return (
    <Modal
      isOpen={open}
      onOpenChange={(v) => !v && onClose()}
      size="2xl"
      scrollBehavior="inside"
      classNames={{ base: "max-h-[85vh]", body: "gap-5" }}
    >
      <ModalContent>
        <ModalHeader className="text-lg font-semibold">
          {initial?.id_tipo_sensor_pk ? "Editar tipo de sensor" : "Nuevo tipo de sensor"}
        </ModalHeader>

        <ModalBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Nombre"
              labelPlacement="outside"
              placeholder="Temperatura, Humedad, pH, Luminosidad…"
              value={values.nombre_tipo_sensor}
              onChange={(e) => handleChange("nombre_tipo_sensor", e.target.value)}
              isRequired
            />

            <Input
              label="Unidades"
              labelPlacement="outside"
              placeholder="°C, %, pH, lx…"
              value={values.unidades_tipo_sensor || ""}
              onChange={(e) => handleChange("unidades_tipo_sensor", e.target.value)}
              description="Abreviatura que se mostrará en lecturas y gráficos."
            />

            <Input
              type="number"
              label="Decimales"
              labelPlacement="outside"
              placeholder="0, 1, 2…"
              value={values.decimales_tipo_sensor?.toString() ?? ""}
              min={0}
              max={6}
              step={1}
              onChange={(e) =>
                handleChange(
                  "decimales_tipo_sensor",
                  e.target.value === ""
                    ? undefined
                    : Math.max(0, Math.min(6, Number(e.target.value)))
                )
              }
              description="Cantidad de decimales a mostrar (0–6)."
            />

            {/* Selector + preview de imagen */}
            <Card shadow="sm" className="border border-default-100">
              <CardBody className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-small text-default-600 mb-1">Icono / Imagen</div>

                  {/* Controles: elegir archivo + pegar URL */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="flat" size="sm" onPress={triggerFile}>
                      Elegir imagen
                    </Button>

                    <Input
                      size="sm"
                      placeholder="Pegar URL http(s) o ruta (uploads/...png)"
                      value={imageUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        setImageUrl(val);
                        // Validar: no aceptar rutas locales tipo C:\...
                        setUrlError(
                          val && !isValidRemotePath(val)
                            ? "Usa URL http(s) o ruta del servidor (uploads/...). Las rutas locales C:\\ no funcionan."
                            : null
                        );
                        if (fileObj) setFileObj(null); // prioriza URL si el usuario escribe
                      }}
                      isInvalid={!!urlError}
                      errorMessage={urlError || undefined}
                      className="min-w-[220px]"
                    />

                    {(fileObj || imageUrl) && (
                      <Tooltip content="Quitar imagen">
                        <Button size="sm" variant="light" onPress={clearImage}>
                          Limpiar
                        </Button>
                      </Tooltip>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    className="hidden"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setFileObj(f);
                      if (f) {
                        setImageUrl(""); // al seleccionar archivo, vaciamos URL
                        setUrlError(null);
                      }
                    }}
                    aria-label="Seleccionar imagen del tipo de sensor"
                  />

                  <div className="mt-3 flex items-center justify-center">
                    <ImagePreview src={imagePreviewSrc || undefined} size={80} />
                  </div>

                  {/* Etiqueta del estado actual */}
                  <div className="mt-2">
                    {fileObj ? (
                      <Chip size="sm" variant="flat">{fileObj.name}</Chip>
                    ) : imageUrl?.trim() ? (
                      <Chip size="sm" variant="flat">Usando URL</Chip>
                    ) : initial?.imagen_tipo_sensor ? (
                      <Chip size="sm" variant="flat">Imagen actual</Chip>
                    ) : (
                      <Chip size="sm" variant="flat" color="warning">Opcional</Chip>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={submit}
            isLoading={submitting}
            isDisabled={!!urlError}
          >
            {initial?.id_tipo_sensor_pk ? "Guardar cambios" : "Crear"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
