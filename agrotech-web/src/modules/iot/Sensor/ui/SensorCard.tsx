import React, { useState } from "react";
import type { Sensor } from "../model/types";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Tooltip,
  Badge,
} from "@heroui/react";

// === Íconos ===
const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 20 20"
    width="1em"
    {...props}
  >
    <path
      d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DeleteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 20 20"
    width="1em"
    {...props}
  >
    <path
      d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RestoreIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M12.9 5.2c-3.1-1.3-6.5.6-7.8 3.7s.6 6.5 3.7 7.8c3.1 1.3 6.5-.6 7.8-3.7"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 2v4l-2-2"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ImagePlaceholderIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    className="w-full h-full text-gray-300"
    stroke="currentColor"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
    />
  </svg>
);

interface Props {
  sensor: Sensor;
  onEdit: (sensor: Sensor) => void;
  onDelete: (sensor: Sensor) => void;
  onRestore: (sensor: Sensor) => void;
}

export const SensorCard: React.FC<Props> = ({
  sensor,
  onEdit,
  onDelete,
  onRestore,
}) => {
  const isDeleted = !!sensor.delete_at;
  const [imgError, setImgError] = useState(false);

  // 🔗 URL base fija
  const API_BASE = "http://localhost:4000";

  // 🧩 Limpieza total de ruta
  const cleanedPath = sensor.imagen_sensor
    ? sensor.imagen_sensor
        .replace(/\\/g, "/")
        .replace(/^.*uploads\//, "uploads/") // deja solo desde uploads/
        .replace(/^\/+/, "")
        
    : "";

  // ✅ Construcción segura de la URL final
  const imageUrl =
    imgError || !cleanedPath ? "/no-image.png" : `${API_BASE}/${cleanedPath}`;

  return (
    <Card
      className={`shadow-lg transition-shadow duration-300 ${
        isDeleted ? "bg-gray-100" : "hover:shadow-xl"
      }`}
    >
      {/* Imagen */}
      <div className="h-32 bg-gray-200 flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt={sensor.nombre_sensor}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          onError={() => setImgError(true)}
        />
        {!sensor.imagen_sensor && <ImagePlaceholderIcon />}
      </div>

      {/* Cabecera */}
      <CardHeader className="flex justify-between items-start pt-3 pb-2 px-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {sensor.nombre_sensor}
          </h3>
          <p className="text-sm text-gray-500">
            {sensor.tipo_sensor?.nombre_tipo_sensor || "Sin tipo"}
          </p>
        </div>
        {!isDeleted && (
          <Badge color={sensor.activo ? "success" : "danger"} variant="flat">
            {sensor.activo ? "Activo" : "Inactivo"}
          </Badge>
        )}
      </CardHeader>

      {/* Cuerpo */}
      <CardBody className="py-2 text-sm text-gray-700 px-4">
        <p>
          <strong>Cultivo:</strong> {sensor.cultivo?.nombre_cultivo || "—"}
        </p>
        <p>
          <strong>Rango:</strong> {sensor.valor_minimo} - {sensor.valor_maximo}
        </p>
        <p>
          <strong>Inicio:</strong>{" "}
          {new Date(sensor.fecha_inicio_sensor).toLocaleDateString()}
        </p>
      </CardBody>

      {/* Footer */}
      <CardFooter className="pt-2 flex justify-end gap-2 px-4 pb-3">
        {isDeleted ? (
          <Tooltip content="Restaurar Sensor" color="success">
            <Button
              isIconOnly
              variant="light"
              color="success"
              onClick={() => onRestore(sensor)}
            >
              <RestoreIcon />
            </Button>
          </Tooltip>
        ) : (
          <>
            <Tooltip content="Editar Sensor">
              <Button
                isIconOnly
                variant="light"
                onClick={() => onEdit(sensor)}
              >
                <EditIcon className="text-gray-500" />
              </Button>
            </Tooltip>
            <Tooltip content="Eliminar Sensor" color="danger">
              <Button
                isIconOnly
                variant="light"
                color="danger"
                onClick={() => onDelete(sensor)}
              >
                <DeleteIcon />
              </Button>
            </Tooltip>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
