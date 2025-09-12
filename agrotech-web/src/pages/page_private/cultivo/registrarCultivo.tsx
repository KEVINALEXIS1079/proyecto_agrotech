// src/pages/page_private/cultivo/registrarCultivo.tsx
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Input, Select, SelectItem, Button, Card } from "@heroui/react";
import { Image as ImageIcon, Leaf } from "lucide-react";
import type { LayoutContext } from "../../../layouts/ProtectedLayout";
import { createCultivo } from "../../../services/cultivo";
import { getTiposCultivo, type TipoCultivo } from "../../../services/tipoCultivo";

export default function RegistrarCultivo() {
  const { setTitle } = useOutletContext<LayoutContext>();

  // --- Estados del formulario ---
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState(""); // guarda el id_tipo_cultivo seleccionado
  const [estado, setEstado] = useState<"activo" | "inactivo" | "">("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [sublote, setSublote] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [tiposCultivo, setTiposCultivo] = useState<TipoCultivo[]>([]);

  // Cargar tipos de cultivo desde la API
  useEffect(() => {
    setTitle("Registrar cultivos");
    const fetchTipos = async () => {
      try {
        const data = await getTiposCultivo();
        setTiposCultivo(data);
      } catch (error) {
        console.error("Error al cargar los tipos de cultivo:", error);
      }
    };
    fetchTipos();
  }, [setTitle]);

  // Manejo de archivo seleccionado
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!estado || !file) {
      alert("Debes seleccionar un estado y una imagen.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nombre_cultivo", nombre);
      formData.append("descripcion_cultivo", descripcion);
      formData.append("estado_cultivo", estado);
      formData.append("fecha_inicio_cultivo", fechaInicio);
      formData.append("fecha_fin_cultivo", fechaFin);
      formData.append("id_sublote_fk", sublote);
      formData.append("id_tipo_cultivo_fk", tipo);
      formData.append("imagen", file);

      await createCultivo(formData);
      alert("✅ Cultivo registrado con éxito");

      // Reset
      setNombre("");
      setDescripcion("");
      setTipo("");
      setEstado("");
      setFechaInicio("");
      setFechaFin("");
      setSublote("");
      setFile(null);
      setPreview(null);
    } catch (err: any) {
      console.error("❌ Error en el registro:", err);
      if (err.response) {
        const errorMsg = Array.isArray(err.response.data.message)
          ? err.response.data.message.join(", ")
          : JSON.stringify(err.response.data.message);
        alert("Error: " + errorMsg);
      } else {
        alert("Error al registrar el cultivo");
      }
    }
  };

  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background-color: #f3f4f6; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #10b981; border-radius: 9999px; }
  `;

  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 overflow-y-scroll h-[calc(100vh-10rem)] custom-scrollbar">
      <style>{scrollbarStyles}</style>
      <Card className="p-8 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-8">
          <Leaf className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Registrar Cultivo</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <Input
            label="Nombre del cultivo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            isRequired
          />
          <Input
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            isRequired
          />

          <Select
            label="Tipo de cultivo"
            selectedKeys={tipo ? [tipo] : []}
            onSelectionChange={(keys) =>
              setTipo(String(Array.from(keys)[0] ?? ""))
            }
            isRequired
          >
            {tiposCultivo.map((t) => (
              <SelectItem key={t.id_tipo_cultivo}>
                {t.nombre_tipo_cultivo}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Estado"
            selectedKeys={estado ? [estado] : []}
            onSelectionChange={(keys) =>
              setEstado(Array.from(keys)[0] as "activo" | "inactivo")
            }
            isRequired
          >
            <SelectItem key="activo">Activo</SelectItem>
            <SelectItem key="inactivo">Inactivo</SelectItem>
          </Select>

          <Input
            label="Fecha inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            isRequired
          />
          <Input
            label="Fecha fin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            isRequired
          />
          <Input
            label="Sublote (ID)"
            type="number"
            value={sublote}
            onChange={(e) => setSublote(e.target.value)}
            isRequired
          />

          {/* Imagen */}
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Imagen del cultivo
            </label>
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer bg-gray-50 hover:bg-gray-100 transition text-center"
            >
              <ImageIcon className="h-12 w-12 text-green-600 mb-3" />
              <span className="text-gray-700 font-medium">
                Arrastra o haz clic para seleccionar una imagen
              </span>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            {preview && (
              <div className="mt-4 flex justify-center">
                <img
                  src={preview}
                  alt="Vista previa"
                  className="h-32 w-auto rounded-md shadow-md border"
                />
              </div>
            )}
          </div>

          <div className="sm:col-span-2 flex justify-center mt-6">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-lg font-medium shadow-sm transition"
            >
              Registrar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
