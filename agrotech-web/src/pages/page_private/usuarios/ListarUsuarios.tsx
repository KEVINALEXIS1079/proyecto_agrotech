
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Avatar,
} from "@heroui/react";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import { Edit3, Trash2, Search, UserPlus } from "lucide-react";
import type { LayoutContext } from "../../../layouts/ProtectedLayout";
import { deleteUsuario, getUsuarios, type Usuario } from "../../../services/usuario";

export default function ListaUsuarios() {
  const { setTitle } = useOutletContext<LayoutContext>();
  const navigate = useNavigate();
  useEffect(() => setTitle("Listado de usuarios"), [setTitle]);

  const [list, setList] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [rol, setRol] = useState<string>("");

  const [openDelete, setOpenDelete] = useState(false);
  const [rowDelete, setRowDelete] = useState<Usuario | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errorDelete, setErrorDelete] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getUsuarios();
        setList(Array.isArray(data) ? data : []);
      } catch {
        setList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return list.filter((u) => {
      const matchQ = t
        ? [u.nombre_usuario, u.apellido_usuario, u.cedula_usuario, u.correo_usuario].join(" ").toLowerCase().includes(t)
        : true;
      const matchRol = rol ? String(u.id_rol_fk ?? 0) === rol : true;
      return matchQ && matchRol;
    });
  }, [list, q, rol]);

  const openDeleteConfirm = (row: Usuario) => {
    setRowDelete(row);
    setErrorDelete("");
    setOpenDelete(true);
  };

  const submitDelete = async () => {
    if (!rowDelete?.id_usuario) return;
    try {
      setDeleting(true);
      await deleteUsuario(rowDelete.id_usuario);
      setList((prev) => prev.filter((x) => x.id_usuario !== rowDelete.id_usuario));
      setOpenDelete(false);
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? "No se pudo eliminar el usuario.";
      setErrorDelete(Array.isArray(msg) ? msg.join(", ") : String(msg));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Usuarios</h2>
        <Button as={Link} to="/usuario-registrar" color="success" startContent={<UserPlus className="h-4 w-4" />}>
          Nuevo usuario
        </Button>
      </div>

      <Card shadow="sm" className="border border-default-200">
        <CardBody className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            startContent={<Search className="h-4 w-4 text-foreground-500" />}
            placeholder="Buscar por nombre, cédula o correo…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            variant="bordered"
          />
          <Select
            selectedKeys={new Set(rol ? [rol] : [""])}
            onSelectionChange={(keys) => {
              const k = (keys as Set<string>).values().next().value as string;
              setRol(k === "" ? "" : k);
            }}
            variant="bordered"
            placeholder="Rol"
          >
            <SelectItem key="">Todos</SelectItem>
            <SelectItem key="1">Administrador</SelectItem>
            <SelectItem key="2">Instructor</SelectItem>
            <SelectItem key="3">Aprendiz</SelectItem>
          </Select>
        </CardBody>
      </Card>

      {loading ? (
        <p className="text-sm text-foreground-500">Cargando…</p>
      ) : filtered.length === 0 ? (
        <Card shadow="sm" className="border border-default-200">
          <CardBody className="p-10 text-center">
            <p className="font-medium">No se encontraron usuarios</p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((u) => {
            const id = String(u.id_usuario);
            return (
              <Card key={id} shadow="sm" className="border border-default-200 hover:shadow-md transition">
                <CardBody className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      radius="full"
                      src={u.img_usuario || undefined}
                      name={`${u.nombre_usuario?.[0] ?? ""}${u.apellido_usuario?.[0] ?? ""}`}
                      className="h-12 w-12"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">
                          {u.nombre_usuario} {u.apellido_usuario}
                        </h3>
                        <RolChip rolId={u.id_rol_fk} nombre={u.nombre_rol} />
                      </div>
                      <p className="text-sm text-foreground-500">{u.correo_usuario}</p>
                      <p className="text-xs text-foreground-500">CC: {u.cedula_usuario} • Tel: {u.telefono_usuario}</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="flat"
                      className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20"
                      startContent={<Edit3 className="h-4 w-4" />}
                      onPress={() => navigate(`/usuarios-editar/${u.id_usuario} `)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      className="bg-red-500/10 text-red-600 hover:bg-red-500/20"
                      startContent={<Trash2 className="h-4 w-4" />}
                      onPress={() => openDeleteConfirm(u)}
                    >
                      Borrar
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

 
      <Modal isOpen={openDelete} onOpenChange={setOpenDelete} placement="center">
        <ModalContent>
          <ModalHeader>Eliminar usuario</ModalHeader>
          <ModalBody>
            <p>
              ¿Seguro que deseas eliminar{" "}
              <span className="font-semibold">
                {rowDelete ? `${rowDelete.nombre_usuario} ${rowDelete.apellido_usuario}` : "este usuario"}
              </span>
              ?
            </p>
            {errorDelete && <p className="text-danger text-xs">{errorDelete}</p>}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setOpenDelete(false)}>
              Cancelar
            </Button>
            <Button color="danger" isLoading={deleting} onPress={submitDelete}>
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

function RolChip({ rolId, nombre }: { rolId?: number; nombre?: string }) {
  const label =
    nombre ?? (rolId === 1 ? "Administrador" : rolId === 2 ? "Instructor" : rolId === 3 ? "Aprendiz" : "Sin rol");

  const color: "primary" | "success" | "warning" | "default" =
    label === "Administrador" ? "primary" : label === "Instructor" ? "success" : label === "Aprendiz" ? "warning" : "default";

  return (
    <Chip size="sm" variant="flat" color={color}>
      {`Rol ${label}`}
    </Chip>
  );
}
