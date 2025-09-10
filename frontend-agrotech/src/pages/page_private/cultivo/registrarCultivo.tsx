import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Input, Select, SelectItem, Button, Card } from "@heroui/react";
import { Calendar, Image as ImageIcon, Leaf } from "lucide-react";
import type { LayoutContext } from "../../../layouts/ProtectedLayout";
import { createCultivo } from "../../../services/cultivo";

export default function RegistrarCultivo() {
  const { setTitle } = useOutletContext<LayoutContext>();

  // ✅ evitar warning de React
  useEffect(() => {
    setTitle("Registrar cultivos");
  }, [setTitle]);

  const [preview, setPreview] = useState<string | null>(null);

  // Campos del formulario
  const [nombre, setNombre] = useState(""); // aún no se envía, pero se guarda
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState(""); // id_tipo_cultivo_fk
  const [estado, setEstado] = useState(""); // aún no se envía, pero se guarda
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [presentacion, setPresentacion] = useState("");
  const [precio, setPrecio] = useState("");
  const [sublote, setSublote] = useState(""); // id_sublote_fk

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        descripcion_cultivo: descripcion,
        precio_cultivo: Number(precio),
        presentacion_cultivo: presentacion,
        fecha_inicio_cultivo: fechaInicio,
        fecha_fin_cultivo: fechaFin,
        id_sublote_fk: Number(sublote),
        id_tipo_cultivo_fk: Number(tipo),
      };

      console.log("Enviando al backend:", payload);

      await createCultivo(payload);

      alert("✅ Cultivo registrado con éxito");

      // Reset
      setDescripcion("");
      setTipo("");
      setFechaInicio("");
      setFechaFin("");
      setPresentacion("");
      setPrecio("");
      setSublote("");
      setPreview(null);
      setNombre("");
      setEstado("");
    } catch (err: any) {
      console.error("❌ Error en el registro:", err);
      if (err.response) {
        console.error("Respuesta del backend:", err.response.data);

        // 👇 Mostrar detalle real de la validación
        if (Array.isArray(err.response.data.message)) {
          err.response.data.message.forEach((msg: string) =>
            console.error("Detalle:", msg)
          );
        }

        alert("Error: " + JSON.stringify(err.response.data.message));
      } else {
        alert("Error al registrar el cultivo");
      }
    }
  };

  // Estilos para la scrollbar
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
      className="
        bg-white p-8 rounded-xl shadow-md border border-gray-100 
        overflow-y-scroll h-[calc(100vh-10rem)] custom-scrollbar
      "
    >
      <style>{scrollbarStyles}</style>

      <Card className="p-8 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-8">
          <Leaf className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Registrar Cultivo
          </h2>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* Nombre (NO conectado aún) */}
          <Input
            label="Nombre del cultivo"
            placeholder="Ej. Cacao CCN51"
            variant="bordered"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          {/* Descripción */}
          <Input
            label="Descripción"
            placeholder="Escriba una breve descripción"
            variant="bordered"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          {/* Tipo */}
          <Select
            label="Tipo"
            placeholder="Seleccione un tipo"
            selectedKeys={tipo ? [tipo] : []}
            onSelectionChange={(keys) => setTipo(Array.from(keys)[0] as string)}
          >
            <SelectItem key="2">Cacao</SelectItem>
            <SelectItem key="1">Café</SelectItem>
            <SelectItem key="3">Plátano</SelectItem>
          </Select>

          {/* Estado (NO conectado aún) */}
          <Select
            label="Estado"
            placeholder="Seleccione un estado"
            selectedKeys={estado ? [estado] : []}
            onSelectionChange={(keys) =>
              setEstado(Array.from(keys)[0] as string)
            }
          >
            <SelectItem key="activo">Activo</SelectItem>
            <SelectItem key="inactivo">Inactivo</SelectItem>
          </Select>

          {/* Fecha inicio */}
          <Input
            label="Fecha inicio"
            type="date"
            startContent={<Calendar className="h-4 w-4 text-gray-500" />}
            variant="bordered"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />

          {/* Fecha fin */}
          <Input
            label="Fecha fin"
            type="date"
            startContent={<Calendar className="h-4 w-4 text-gray-500" />}
            variant="bordered"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />

          {/* Presentación */}
          <Input
            label="Presentación"
            placeholder="Ej. saco de 50kg"
            variant="bordered"
            value={presentacion}
            onChange={(e) => setPresentacion(e.target.value)}
          />

          {/* Precio */}
          <Input
            label="Precio"
            placeholder="Ej. 50000"
            type="number"
            variant="bordered"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />

          {/* Sublote */}
          <Input
            label="Sublote (ID)"
            placeholder="Ej. 3"
            type="number"
            variant="bordered"
            value={sublote}
            onChange={(e) => setSublote(e.target.value)}
          />

          {/* Imagen estilo dropzone (NO conectada aún) */}
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
                Arrastra y suelta una imagen aquí
              </span>
              <span className="text-gray-500 text-sm mt-1">
                o haz clic para seleccionar
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

          {/* Botón */}
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
