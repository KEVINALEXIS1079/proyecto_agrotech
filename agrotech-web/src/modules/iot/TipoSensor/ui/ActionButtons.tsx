import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Props {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export const ActionButtons = ({ onEdit, onDelete, isDeleting }: Props) => (
  <div className="flex justify-end items-center gap-3">
    <button
      onClick={onEdit}
      className="text-indigo-600 hover:text-indigo-900 transition-colors"
      title="Editar"
    >
      <PencilIcon className="h-5 w-5" />
    </button>
    <button
      onClick={onDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      title="Eliminar"
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  </div>
);