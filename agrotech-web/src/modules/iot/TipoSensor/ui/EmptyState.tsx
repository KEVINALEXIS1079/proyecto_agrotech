import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center border-2 border-dashed border-gray-300 p-12 rounded-lg">
    <DocumentMagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-medium text-gray-900">Sin resultados</h3>
    <p className="mt-1 text-sm text-gray-500">{message}</p>
  </div>
);