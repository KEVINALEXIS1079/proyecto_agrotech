import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Input } from "@heroui/react";
import { Search } from "lucide-react";
import type { LayoutContext } from "../../../layouts/ProtectedLayout";
import { getCultivos } from "../../../services/cultivo";
import type { Cultivo } from "../../../services/cultivo";

export default function HistorialCultivo() {
  const { setTitle } = useOutletContext<LayoutContext>();
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [loading, setLoading] = useState(true);

  setTitle("Cultivos");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCultivos();
        setCultivos(data);
      } catch (err) {
        console.error("Error cargando cultivos", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background-color: #d1fae5;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #10b981;
      border-radius: 9999px;
    }
  `;

  return (
    <div
      className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200
                 overflow-y-scroll h-[calc(100vh-10rem)] custom-scrollbar"
    >
      <style>{scrollbarStyles}</style>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Historial</h2>
      </div>

      {/* Filtro */}
      <div className="mb-4">
        <Input
          placeholder="Filtrar..."
          size="sm"
          className="max-w-xs"
          startContent={<Search className="h-4 w-4 text-default-500" />}
        />
      </div>

      {/* Tabla */}
      {loading ? (
        <p className="text-gray-500">Cargando cultivos...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Nombre</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Descripción</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Inicio</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Fin</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Sublote</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Tipo</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Estado</th>
              </tr>
            </thead>
            <tbody>
              {cultivos.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-800">{c.nombre_cultivo ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{c.descripcion_cultivo}</td>
                  <td className="px-4 py-3 text-gray-600">{c.fecha_inicio_cultivo}</td>
                  <td className="px-4 py-3 text-gray-600">{c.fecha_fin_cultivo}</td>
                  <td className="px-4 py-3 text-gray-600">{c.id_sublote_fk}</td>
                  <td className="px-4 py-3 text-gray-600">{c.id_tipo_cultivo_fk}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex justify-center w-20 py-1 text-xs font-medium rounded-md
                        bg-gray-100 text-gray-800`}
                    >
                      — {/* placeholder, luego se remplaza con c.estado */}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
