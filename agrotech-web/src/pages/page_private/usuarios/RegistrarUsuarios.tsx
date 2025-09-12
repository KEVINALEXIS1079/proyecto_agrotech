
import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  type Selection,
} from "@heroui/react";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import { Save, Upload, ArrowLeft } from "lucide-react";
import type { LayoutContext } from "../../../layouts/ProtectedLayout";
import { createUsuario } from "../../../services/usuario";

type FormState = {
  cedula_usuario: string;
  nombre_usuario: string;
  apellido_usuario: string;
  telefono_usuario: string;
  correo_usuario: string;
  contrasena_usuario: string;
  estado_usuario: "activo" | "inactivo";
  id_rol_fk: number;                    
  img_file: File | null;
};

export default function RegistrarUsuarios() {
  const { setTitle } = useOutletContext<LayoutContext>();
  const navigate = useNavigate();
  useEffect(() => setTitle("Registrar usuario"), [setTitle]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [form, setForm] = useState<FormState>({
    cedula_usuario: "",
    nombre_usuario: "",
    apellido_usuario: "",
    telefono_usuario: "",
    correo_usuario: "",
    contrasena_usuario: "",
    estado_usuario: "activo", 
    id_rol_fk: 1,              
    img_file: null,
  });

  const [preview, setPreview] = useState<string>("");

  const [rolSel, setRolSel] = useState<Set<string>>(new Set(["1"]));
  const [estadoSel, setEstadoSel] = useState<Set<string>>(new Set(["activo"]));

  useEffect(() => setRolSel(new Set([String(form.id_rol_fk)])), [form.id_rol_fk]);
  useEffect(() => setEstadoSel(new Set([form.estado_usuario])), [form.estado_usuario]);

  const canSubmit = useMemo(() => {
    const f = form;
    return (
      f.cedula_usuario.trim() &&
      f.nombre_usuario.trim() &&
      f.apellido_usuario.trim() &&
      f.telefono_usuario.trim() &&
      f.correo_usuario.trim() &&
      f.contrasena_usuario.trim() &&
      (f.estado_usuario === "activo" || f.estado_usuario === "inactivo") &&
      Number.isFinite(Number(f.id_rol_fk))
    );
  }, [form]);

  const onFile = (file?: File) => {
    if (!file) return;
    setForm((s) => ({ ...s, img_file: file }));
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const fd = new FormData();
      fd.append("cedula_usuario", form.cedula_usuario.trim());
      fd.append("nombre_usuario", form.nombre_usuario.trim());
      fd.append("apellido_usuario", form.apellido_usuario.trim());
      fd.append("telefono_usuario", form.telefono_usuario.trim());
      fd.append("correo_usuario", form.correo_usuario.trim().toLowerCase());
      fd.append("contrasena_usuario", form.contrasena_usuario);


      fd.append("estado_usuario", form.estado_usuario);        
      fd.append("id_rol_fk", String(form.id_rol_fk));          

      if (form.img_file) fd.append("img_usuario", form.img_file);

      await createUsuario(fd);  
      navigate("/lista-usuarios");
    } catch (e: any) {
      const apiMsg =
        e?.response?.data?.message ??
        e?.response?.data?.error ??
        e?.message ??
        "No se pudo registrar el usuario.";
      setErrorMsg(Array.isArray(apiMsg) ? apiMsg.join(", ") : String(apiMsg));
      console.error("Registro usuario:", e?.response?.status, e?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="flex items-center justify-between">
        <Button as={Link} to="/lista-usuarios" variant="flat" startContent={<ArrowLeft className="h-4 w-4" />}>
          Volver al listado
        </Button>
      </div>

      <Card shadow="sm" className="border border-default-200">
        <CardBody className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
          <div className="flex flex-col items-center gap-3">
            <Avatar radius="full" src={preview || undefined} className="h-28 w-28 text-2xl" />
            <label className="cursor-pointer text-sm inline-flex items-center gap-2">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
              <Upload className="h-4 w-4" /> Subir imagen
            </label>
            {preview && (
              <button
                type="button"
                className="text-xs text-foreground-500 underline"
                onClick={() => {
                  setPreview("");
                  setForm((s) => ({ ...s, img_file: null }));
                }}
              >
                Quitar imagen
              </button>
            )}
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Cédula" value={form.cedula_usuario}
              onChange={(e) => setForm((s) => ({ ...s, cedula_usuario: e.target.value }))} variant="bordered" isRequired />
            <Input label="Nombre" value={form.nombre_usuario}
              onChange={(e) => setForm((s) => ({ ...s, nombre_usuario: e.target.value }))} variant="bordered" isRequired />
            <Input label="Apellido" value={form.apellido_usuario}
              onChange={(e) => setForm((s) => ({ ...s, apellido_usuario: e.target.value }))} variant="bordered" isRequired />
            <Input label="Teléfono" value={form.telefono_usuario}
              onChange={(e) => setForm((s) => ({ ...s, telefono_usuario: e.target.value }))} variant="bordered" isRequired />
            <Input type="email" label="Correo" value={form.correo_usuario}
              onChange={(e) => setForm((s) => ({ ...s, correo_usuario: e.target.value }))} variant="bordered" isRequired />
            <Input type="password" label="Contraseña" value={form.contrasena_usuario}
              onChange={(e) => setForm((s) => ({ ...s, contrasena_usuario: e.target.value }))} variant="bordered" isRequired />


            <Select
              label="Estado"
              selectedKeys={estadoSel}
              onSelectionChange={(keys: Selection) => {
                if (keys === "all") return;
                const next = new Set(Array.from(keys).map(String));
                setEstadoSel(next);
                const k = Array.from(next)[0] as "activo" | "inactivo";
                setForm((s) => ({ ...s, estado_usuario: k }));
              }}
              variant="bordered"
            >
              <SelectItem key="activo">Activo</SelectItem>
              <SelectItem key="inactivo">Inactivo</SelectItem>
            </Select>

            <Select
              label="Rol"
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={rolSel}
              onSelectionChange={(keys: Selection) => {
                if (keys === "all") return;
                const next = new Set(Array.from(keys).map(String));
                setRolSel(next);
                const k = Array.from(next)[0];
                setForm((s) => ({ ...s, id_rol_fk: Number(k) }));
              }}
              variant="bordered"
            >
              <SelectItem key="1">Administrador</SelectItem>
              <SelectItem key="2">Instructor</SelectItem>
              <SelectItem key="3">Aprendiz</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {errorMsg && <div className="text-danger text-sm">{errorMsg}</div>}

      <div className="flex justify-end">
        <Button type="submit" color="success" isLoading={loading} startContent={<Save className="h-4 w-4" />} isDisabled={!canSubmit}>
          Registrar usuario
        </Button>
      </div>
    </form>
  );
}
