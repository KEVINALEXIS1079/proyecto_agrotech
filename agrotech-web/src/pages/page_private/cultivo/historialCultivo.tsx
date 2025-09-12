import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Input, Button } from "@heroui/react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import type { LayoutContext } from "../../../layouts/ProtectedLayout";
import { getCultivos, deleteCultivo, type Cultivo } from "../../../services/cultivo";

export default function HistorialCultivo() {
  const { setTitle } = useOutletContext<LayoutContext>();
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setTitle("Historial de Cultivos");
    fetchData();
  }, []);

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

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este cultivo?")) return;
    try {
      await deleteCultivo(id);
      setCultivos((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error eliminando cultivo", err);
    }
  };

  const filtered = cultivos.filter((c) =>
    c.nombre_cultivo.toLowerCase().includes(filtro.toLowerCase())
  );

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

      {/* Header con botón registrar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Historial de Cultivos</h2>
        <Button
          color="success"
          startContent={<Plus className="w-4 h-4" />}
          onPress={() => navigate("/private/cultivos/registrar")}
        >
          Registrar Cultivo
        </Button>
      </div>

      {/* Filtro */}
      <div className="mb-4">
        <Input
          placeholder="Filtrar por nombre..."
          size="sm"
          className="max-w-xs"
          startContent={<Search className="h-4 w-4 text-default-500" />}
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando cultivos...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No hay cultivos registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Imagen</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Nombre</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Descripción</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Inicio</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Fin</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Estado</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <img
                      src={c.img_cultivo}
                      alt={c.nombre_cultivo}
                      className="h-10 w-10 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-800 font-medium">{c.nombre_cultivo}</td>
                  <td className="px-4 py-3 text-gray-600">{c.descripcion_cultivo}</td>
                  <td className="px-4 py-3 text-gray-600">{c.fecha_inicio_cultivo}</td>
                  <td className="px-4 py-3 text-gray-600">{c.fecha_fin_cultivo}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center justify-center w-20 py-1 px-2.5 text-xs font-medium rounded-full
                        ${
                          c.estado_cultivo === "activo"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {c.estado_cultivo.charAt(0).toUpperCase() + c.estado_cultivo.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20"
                        startContent={<Pencil className="h-4 w-4" />}
                        onPress={() => navigate(`/private/cultivos/editar/${c.id}`)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        className="bg-red-500/10 text-red-600 hover:bg-red-500/20"
                        startContent={<Trash2 className="h-4 w-4" />}
                        onPress={() => handleDelete(c.id)}
                      >
                        Borrar
                      </Button>
                    </div>
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
