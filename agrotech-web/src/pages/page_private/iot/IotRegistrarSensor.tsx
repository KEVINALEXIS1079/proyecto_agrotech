import React, { useEffect, useState } from "react";
import { Input, Button } from "@heroui/react";
import { registrarSensor } from "../../../services/iot";
import { getCultivos, type Cultivo } from "../../../services/cultivo";
import { getTiposSensor, type TipoSensor } from "../../../services/tipoSensor";

export default function IotRegistrarSensor() {
  const [formData, setFormData] = useState({
    nombre_sensor: "",
    valor_minimo: "",
    valor_maximo: "",
    fecha_inicio_sensor: "",
    fecha_fin_sensor: "",
    id_cultivo_fk: "",
    id_tipo_sensor_fk: "",
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [tiposSensor, setTiposSensor] = useState<TipoSensor[]>([]);

  useEffect(() => {
    // Traer cultivos y tipos de sensor dinámicamente
    const fetchData = async () => {
      try {
        const [cults, tipos] = await Promise.all([getCultivos(), getTiposSensor()]);
        setCultivos(cults);
        setTiposSensor(tipos);
      } catch (err) {
        console.error("Error cargando opciones", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      const payload = {
        ...formData,
        valor_minimo: Number(formData.valor_minimo),
        valor_maximo: Number(formData.valor_maximo),
        id_cultivo_fk: Number(formData.id_cultivo_fk),
        id_tipo_sensor_fk: Number(formData.id_tipo_sensor_fk),
      };

      const res = await registrarSensor(payload);
      setMensaje(`✅ ${res}`);
      setFormData({
        nombre_sensor: "",
        valor_minimo: "",
        valor_maximo: "",
        fecha_inicio_sensor: "",
        fecha_fin_sensor: "",
        id_cultivo_fk: "",
        id_tipo_sensor_fk: "",
      });
    } catch (err: any) {
      setMensaje(`❌ Error: ${err.message || "No se pudo registrar"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-success">Registrar Sensor IoT</h2>
        <p className="text-sm text-gray-500">
          Complete los datos para agregar un nuevo sensor al sistema.
        </p>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Input
          label="Nombre del Sensor"
          name="nombre_sensor"
          value={formData.nombre_sensor}
          onChange={handleChange}
          placeholder="Ej. Sensor de Humedad"
          isRequired
        />

        <Input
          label="Valor Mínimo"
          name="valor_minimo"
          type="number"
          value={formData.valor_minimo}
          onChange={handleChange}
          placeholder="Ej. 20"
          isRequired
        />

        <Input
          label="Valor Máximo"
          name="valor_maximo"
          type="number"
          value={formData.valor_maximo}
          onChange={handleChange}
          placeholder="Ej. 80"
          isRequired
        />

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Fecha de Inicio
          </label>
          <input
            type="date"
            name="fecha_inicio_sensor"
            value={formData.fecha_inicio_sensor}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-success focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Fecha de Fin
          </label>
          <input
            type="date"
            name="fecha_fin_sensor"
            value={formData.fecha_fin_sensor}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-success focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Cultivo
          </label>
          <select
            name="id_cultivo_fk"
            value={formData.id_cultivo_fk}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-success focus:outline-none"
            required
          >
            <option value="">Seleccione un cultivo</option>
            {cultivos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre_cultivo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Tipo de Sensor
          </label>
          <select
            name="id_tipo_sensor_fk"
            value={formData.id_tipo_sensor_fk}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-success focus:outline-none"
            required
          >
            <option value="">Seleccione un tipo</option>
            {tiposSensor.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre_tipo_sensor}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
          <Button
            color="success"
            className="px-6 py-2 text-white"
            type="submit"
            isDisabled={loading}
          >
            {loading ? "Registrando..." : "Registrar Sensor"}
          </Button>
        </div>
      </form>

      {mensaje && (
        <p
          className={`mt-4 text-center font-semibold ${
            mensaje.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {mensaje}
        </p>
      )}
    </div>
  );
}
