
import { useEffect, useMemo, useState } from "react";
import { Button, Card, CardBody, Chip, Input } from "@heroui/react";
import { Link, useOutletContext } from "react-router-dom";
import { Users, UserPlus, Search, Shield, Phone, Mail } from "lucide-react";
import type { LayoutContext } from "../../../layouts/ProtectedLayout";
import { getUsuarios, type Usuario } from "../../../services/usuario";

export default function UsuariosHome() {
  const { setTitle } = useOutletContext<LayoutContext>();
  useEffect(() => setTitle("Usuarios"), [setTitle]);

  const [list, setList] = useState<Usuario[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getUsuarios();
        setList(Array.isArray(data) ? data : []);
      } catch {
        setList([]);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return list;
    return list.filter((u) =>
      [
        u.nombre_usuario,
        u.apellido_usuario,
        u.cedula_usuario,
        u.correo_usuario,
        String(u.id_rol_fk),
      ]
        .join(" ")
        .toLowerCase()
        .includes(t)
    );
  }, [list, q]);

  const metrics = useMemo(() => {
    const total = list.length;
    const admin = list.filter((u) => u.id_rol_fk === 1).length;
    const instructores = list.filter((u) => u.id_rol_fk === 2).length;
    const aprendices = list.filter((u) => u.id_rol_fk === 3).length;
    return { total, admin, instructores, aprendices };
  }, [list]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl font-bold">Usuarios</h1>
        </div>
        <Button
          as={Link}
          to="/Usuario-From"
          color="success"
          startContent={<UserPlus className="h-4 w-4" />}
        >
          Nuevo usuario
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Metric title="Total" value={metrics.total} />
        <Metric title="Administradores" value={metrics.admin} />
        <Metric title="Instructores" value={metrics.instructores} />
        <Metric title="Aprendices" value={metrics.aprendices} />
      </div>

      <Card shadow="sm" className="border border-default-200">
        <CardBody className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
          <Input
            startContent={<Search className="h-4 w-4 text-foreground-500" />}
            placeholder="Buscar por nombre, cédula o correo…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            variant="bordered"
          />
          <Button as={Link} to="/lista-usuarios" variant="flat">
            Ver listado detallado
          </Button>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.slice(0, 6).map((u) => (
          <Card key={u.id_usuario} shadow="sm" className="border border-default-200">
            <CardBody className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {u.nombre_usuario} {u.apellido_usuario}
                </h3>
                <RolChip rol={u.id_rol_fk} />
              </div>
              <p className="text-sm text-foreground-500">CC: {u.cedula_usuario}</p>
              <div className="text-sm flex flex-col gap-1">
                <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> {u.correo_usuario}</span>
                <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4" /> {u.telefono_usuario}</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: number | string }) {
  return (
    <Card shadow="sm" className="border border-default-200">
      <CardBody className="py-4">
        <p className="text-xs text-foreground-500">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </CardBody>
    </Card>
  );
}

function RolChip({ rol }: { rol: number }) {
  const map: Record<number, { label: string; color: "primary" | "success" | "warning" }> = {
    1: { label: "Admin", color: "primary" },
    2: { label: "Instructor", color: "success" },
    3: { label: "Aprendiz", color: "warning" },
  };
  const cfg = map[rol] ?? { label: `Rol ${rol}`, color: "primary" as const };
  return (
    <Chip size="sm" variant="flat" color={cfg.color} startContent={<Shield className="h-3 w-3" />}>
      {cfg.label}
    </Chip>
  );
}
