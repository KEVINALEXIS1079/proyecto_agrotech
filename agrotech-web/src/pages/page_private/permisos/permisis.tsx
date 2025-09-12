
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { LayoutContext } from "../../../layouts/ProtectedLayout";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Divider,
  Input,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Checkbox,
  Tooltip,
  Switch,
} from "@heroui/react";
import {
  ShieldCheck,
  Settings2,
  Search,
  Info,
  LockKeyhole,
  UserCog,
  Users,
  Sprout,
  Boxes,
  Cpu,
  FileBarChart,
} from "lucide-react";
import type { JSX } from "react";



export default function PermisosCheckPage() {
  const { setTitle } = useOutletContext<LayoutContext>();

  useEffect(() => {
    setTitle("Permisos");
    document.title = "AgroTech — Permisos";
  }, [setTitle]);

  const ROLES = [
    { key: "1", label: "Administrador" },
    { key: "2", label: "Instructor" },
    { key: "3", label: "Aprendiz" },
    { key: "4", label: "Auditor" },
  ];

  const MODULES: Array<{
    key: string;
    name: string;
    icon: JSX.Element;
    color: string;
  }> = [
    { key: "usuarios", name: "Usuarios", icon: <Users className="h-4 w-4" />, color: "bg-blue-600" },
    { key: "cultivos", name: "Cultivos", icon: <Sprout className="h-4 w-4" />, color: "bg-emerald-600" },
    { key: "insumos", name: "Insumos", icon: <Boxes className="h-4 w-4" />, color: "bg-amber-600" },
    { key: "sensores", name: "Sensores", icon: <Cpu className="h-4 w-4" />, color: "bg-purple-600" },
    { key: "reportes", name: "Reportes", icon: <FileBarChart className="h-4 w-4" />, color: "bg-rose-600" },
  ];

  const PERMS = [
    { key: "read", label: "Ver" },
    { key: "create", label: "Crear" },
    { key: "update", label: "Editar" },
    { key: "delete", label: "Eliminar" },
    { key: "export", label: "Exportar" },
  ];

  return (
    <div className="min-h-dvh bg-content1/40">
 
      <div className="sticky top-0 z-30 border-b border-divider/60 backdrop-blur-md bg-background/70">
        <div className="mx-auto w-full max-w-7xl px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 text-foreground">
            <ShieldCheck className="h-5 w-5" />
            <h1 className="text-lg font-semibold tracking-tight">Check de Permisos</h1>
            <Chip
              size="sm"
              startContent={<LockKeyhole className="h-3.5 w-3.5" />}
              className="bg-foreground text-background"
            >
              Solo vista
            </Chip>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Input
              aria-label="Buscar"
              placeholder="Buscar módulo o permiso..."
              classNames={{
                inputWrapper:
                  "bg-content2/60 data-[hover=true]:bg-content2/80 data-[focus=true]:bg-content2/80",
              }}
              startContent={<Search className="h-4 w-4" />}
              variant="bordered"
              size="sm"
            />

            <Select
              aria-label="Rol"
              size="sm"
              className="w-52"
              startContent={<UserCog className="h-4 w-4" />}
              defaultSelectedKeys={new Set(["2"])}
            >
              {ROLES.map((r) => (
                <SelectItem key={r.key}>{r.label}</SelectItem>
              ))}
            </Select>

            <Tooltip content="Opciones de visualización">
              <Button isIconOnly variant="flat" size="sm">
                <Settings2 className="h-4 w-4" />
              </Button>
            </Tooltip>

            <Button color="primary" className="hidden sm:flex" isDisabled>
              Guardar cambios
            </Button>
          </div>
        </div>
      </div>


      <main className="mx-auto max-w-7xl px-4 py-6 grid gap-6">
        <Card shadow="sm">
          <CardHeader className="flex gap-2 items-start">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-default-500" />
              <div>
                <p className="text-small text-default-500">
                  Esta es una demo visual. Los checks no guardan cambios.
                </p>
                <p className="text-tiny text-default-400">
                  Tip: usa el selector de rol para ver estados pre-marcados (solo visual).
                </p>
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="grid gap-6">
            <Tabs aria-label="Agrupación de permisos" color="primary" variant="underlined">
              <Tab key="basicos" title="Básicos">
                <SectionGrid modules={MODULES.slice(0, 3)} perms={PERMS} />
              </Tab>
              <Tab key="avanzados" title="Avanzados">
                <SectionGrid modules={MODULES.slice(3)} perms={PERMS} />
              </Tab>
            </Tabs>
          </CardBody>
          <CardFooter className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-tiny text-default-500">
              <span>Estado:</span>
              <Chip size="sm" variant="flat" color="success">
                Sin cambios
              </Chip>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="flat">Reiniciar</Button>
              <Button color="primary" isDisabled>
                Guardar
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}

function SectionGrid({
  modules,
  perms,
}: {
  modules: Array<{ key: string; name: string; icon: JSX.Element; color: string }>;
  perms: Array<{ key: string; label: string }>;
}) {
  return (
    <div className="grid gap-4">
      {modules.map((m) => (
        <ModuleCard key={m.key} module={m} perms={perms} />
      ))}
    </div>
  );
}

function ModuleCard({
  module,
  perms,
}: {
  module: { key: string; name: string; icon: JSX.Element; color: string };
  perms: Array<{ key: string; label: string }>;
}) {
  return (
    <Card shadow="sm" className="border border-divider/60">
      <CardHeader className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`h-9 w-9 rounded-xl grid place-items-center ${module.color} text-white shadow`}>
            {module.icon}
          </div>
          <div>
            <h3 className="text-medium font-semibold leading-none">{module.name}</h3>
            <p className="text-tiny text-default-500">Permisos por acciones comunes</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-tiny text-default-500">Todo</span>
            <Switch size="sm" isDisabled aria-label="Activar todos" />
          </div>
          <Button size="sm" variant="flat">
            Predeterminado
          </Button>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {perms.map((p, idx) => (
            <Checkbox
              key={`${module.key}-${p.key}`}
              defaultSelected={idx < 2}
              classNames={{
                base:
                  "px-3 py-2 rounded-xl border border-divider/60 bg-content2/40 hover:bg-content2/60 transition-colors",
              }}
            >
              <span className="font-medium">{p.label}</span>
            </Checkbox>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
