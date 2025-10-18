import React, { useState } from "react";
import { toast } from "react-toastify";
import type { SortDescriptor } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
  Tooltip,
} from "@heroui/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

import { useTipoSensorList } from "../hooks/useTipoSensorList";
import { useDeleteTipoSensor } from "../hooks/useDeleteTipoSensor";
import { useRestoreTipoSensor } from "../hooks/useRestoreTipoSensor";
import type { TipoSensor } from "../model/types";
import { TableSkeleton } from "./TableSkeleton";

// --- Props del Componente ---
interface Props {
  onAdd: () => void;
  onEdit: (tipo: TipoSensor) => void;
  showDeleted: boolean;
}

// --- Iconos ---
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

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const columns = [
  { name: "#", uid: "id_tipo_sensor", sortable: true },
  { name: "NOMBRE", uid: "nombre", sortable: true },
  { name: "ACCIONES", uid: "actions" },
];

export const TipoSensorTable: React.FC<Props> = ({
  onAdd,
  onEdit,
  showDeleted,
}) => {
  const { tipos, loading: isLoading } = useTipoSensorList({ showDeleted });
  const { remove, loading: isDeleting } = useDeleteTipoSensor();
  const { restore, loading: isRestoring } = useRestoreTipoSensor();

  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id_tipo_sensor",
    direction: "ascending",
  });

  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [sensorToDelete, setSensorToDelete] = useState<TipoSensor | null>(null);

  const filteredItems = React.useMemo(() => {
    let filteredTipos = tipos || [];
    if (filterValue) {
      filteredTipos = filteredTipos.filter((tipo) =>
        tipo.nombre.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredTipos;
  }, [tipos, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  // Tipo extendido para incluir índice visible
  type TipoSensorConIndex = TipoSensor & { visibleIndex?: number };

  const sortedItems: TipoSensorConIndex[] = React.useMemo(() => {
    if (!filteredItems) return [];

    let sorted = [...filteredItems].sort((a, b) => a.id_tipo_sensor - b.id_tipo_sensor);

    sorted.sort((a, b) => {
      const key = sortDescriptor.column as keyof TipoSensor;
      const first = a[key] ?? "";
      const second = b[key] ?? "";
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sorted.slice(start, end).map((item, index) => ({
      ...item,
      visibleIndex: start + index + 1,
    }));
  }, [sortDescriptor, page, rowsPerPage, filteredItems]);

  const renderCell = React.useCallback(
    (tipo: TipoSensorConIndex, columnKey: React.Key) => {
      switch (columnKey) {
        case "id_tipo_sensor":
          return <span className="font-bold text-sm">{tipo.visibleIndex}</span>;

        case "nombre":
          return <span className="capitalize text-sm">{tipo.nombre}</span>;

        case "actions":
          return (
            <div className="relative flex items-center justify-end gap-3">
              {showDeleted ? (
                <Tooltip content="Restaurar">
                  <button
                    onClick={() =>
                      handleRestore(tipo.id_tipo_sensor, tipo.nombre)
                    }
                    disabled={isRestoring}
                    className="text-lg text-green-500 cursor-pointer active:opacity-50"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                  </button>
                </Tooltip>
              ) : (
                <>
                  <Tooltip content="Editar">
                    <button
                      onClick={() => onEdit(tipo)}
                      className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    >
                      <EditIcon />
                    </button>
                  </Tooltip>
                  <Tooltip color="danger" content="Eliminar">
                    <button
                      onClick={() => handleDeleteClick(tipo)}
                      disabled={isDeleting}
                      className="text-lg text-danger cursor-pointer active:opacity-50"
                    >
                      <DeleteIcon />
                    </button>
                  </Tooltip>
                </>
              )}
            </div>
          );

        default:
          return tipo[columnKey as keyof TipoSensor];
      }
    },
    [showDeleted, onEdit, isDeleting, isRestoring]
  );

  const handleRestore = async (id: number, nombre: string) => {
    try {
      await restore(id);
      toast.success(`"${nombre}" fue restaurado correctamente.`);
    } catch {
      toast.error("Error al restaurar el sensor.");
    }
  };

  const handleDeleteClick = (sensor: TipoSensor) => {
    setSensorToDelete(sensor);
    setDeleteConfirmOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setDeleteConfirmOpen(false);
    setSensorToDelete(null);
  };

  const confirmDelete = async () => {
    if (!sensorToDelete) return;
    try {
      await remove(sensorToDelete.id_tipo_sensor);
      toast.success(`"${sensorToDelete.nombre}" fue eliminado correctamente.`);
    } catch {
      toast.error("Error al eliminar el tipo de sensor.");
    } finally {
      handleCloseConfirmModal();
    }
  };

  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-center">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Buscar por nombre..."
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={setFilterValue}
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">
          Total {tipos?.length || 0} tipos de sensores
        </span>
        <label className="flex items-center text-default-400 text-small">
          Filas por página:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>
    </div>
  );

  const bottomContent = (
    <div className="py-2 px-2 flex justify-center items-center">
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={page}
        total={pages}
        onChange={setPage}
      />
    </div>
  );

  if (isLoading) return <TableSkeleton />;

  return (
    <>
      <Table
        aria-label="Tabla de Tipos de Sensores"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent="No se encontraron tipos de sensores."
          items={sortedItems}
        >
          {(item) => (
            <TableRow key={item.id_tipo_sensor}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={confirmDelete}
        sensorName={sensorToDelete?.nombre || ""}
        isDeleting={isDeleting}
      />
    </>
  );
};

// --- Modal de Confirmación de Eliminación ---
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sensorName: string;
  isDeleting: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  sensorName,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Confirmar Eliminación
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          ¿Estás seguro de que deseas eliminar el tipo de sensor{" "}
          <strong className="text-gray-800">"{sensorName}"</strong>? Esta acción
          no se puede deshacer.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="flat" onClick={onClose}>
            Cancelar
          </Button>
          <Button color="danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </div>
    </div>
  );
};
