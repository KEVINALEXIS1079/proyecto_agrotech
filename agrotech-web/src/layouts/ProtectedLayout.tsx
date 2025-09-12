import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Input,
  Button,
  Badge,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  User as UserCard,
  Divider,
} from "@heroui/react";
import {
  Home as HomeIcon,
  Sprout,
  Bug,
  Cpu,
  Wallet,
  Boxes,
  FileBarChart,
  Users,
  Search,
  Bell,
  ListChecks,
  ChevronRight,
  LogOut,
  Settings,
  UserRound,
  Mail,
} from "lucide-react";

export type LayoutContext = { setTitle: (t: string) => void };

/** ========= Usuario desde localStorage =========
 *  Email: guardado en localStorage.recoveryEmail (como mostraste)
 *  TODO: cuando tengas el endpoint, reemplaza el 'name' por el real del API y guárdalo en localStorage (por ej. 'fullName').
 */
function getCurrentUser() {
  const email = localStorage.getItem("recoveryEmail") ?? "sin-correo@example.com";
  const name = localStorage.getItem("fullName") ?? "Usuario"; // TODO: traer del API y guardar en localStorage
  const avatarUrl = localStorage.getItem("avatarUrl") ?? "";
  const role = localStorage.getItem("role") ?? "Invitado";
  return { name, email, avatarUrl, role };
}

export default function ProtectedLayout() {
  const [title, setTitle] = useState("Inicio");

  const location = useLocation();
  const navigate = useNavigate();

  const isCultivosContext =
    location.pathname === "/cultivos" || location.pathname.startsWith("/cultivos/");
  const [openCultivos, setOpenCultivos] = useState<boolean>(false);
  const [openIot, setOpenIot] = useState<boolean>(location.pathname.startsWith("/iot"));
  const [openActividad, setOpenActividad] = useState<boolean>(location.pathname.startsWith("/actividades"));
  const [openUsuario, setOpenUsuario] = useState<boolean>(location.pathname.startsWith("/usuarios"));

  useEffect(() => {
    if (isCultivosContext) setOpenCultivos(true);
  }, [isCultivosContext]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("fullName");
    localStorage.removeItem("avatarUrl");
    localStorage.removeItem("role");
    navigate("/start", { replace: true });
  };

  const user = getCurrentUser();

  /** ========= Notificaciones (prueba) =========
   *  Badge debe mostrar "1" y el popover listar el mensaje.
   */
  const notifs = [
    {
      id: "n1",
      title: "Alerta de pH bajo",
      body: "El cultivo de cacao presenta bajos niveles de pH.",
      unread: true,
      time: "hace 2 min",
    },
  ];
  const unreadCount = 1; // 👈 Forzado a 1 como pediste (si quieres automático: notifs.filter(n=>n.unread).length)

  return (
    <div className="min-h-dvh bg-white">
      {/* ======================== HEADER ======================== */}
      <header className="h-16 px-4 md:px-6 flex items-center gap-3 bg-white sticky top-0 z-30">
        <img src="/LogoTic.png" alt="TIC" className="h-10 md:h-12 w-auto object-contain" />
        <h1 className="text-lg font-semibold hidden sm:block">{title}</h1>

        <div className="ml-auto flex items-center gap-3">
          {/* Buscar */}
          <Input
            size="sm"
            className="w-48 sm:w-64 md:w-80"
            placeholder="Buscar"
            startContent={<Search className="h-4 w-4 text-default-500" />}
          />

          {/* Notificaciones */}
          <Popover placement="bottom-end" showArrow offset={8}>
            <PopoverTrigger>
              <Badge
                content={String(unreadCount)} // 👈 muestra "1"
                shape="circle"
                color="danger"
              >
                <Button isIconOnly variant="light" radius="full" className="h-9 w-9" aria-label="Notificaciones">
                  <Bell className="h-5 w-5" />
                </Button>
              </Badge>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[320px]">
              <div className="p-3 flex items-center justify-between">
                <h4 className="text-base font-semibold">Notificaciones</h4>
                <Chip size="sm" variant="flat" color="primary">
                  {unreadCount} sin leer
                </Chip>
              </div>
              <Divider />
              <div className="max-h-[260px] overflow-y-auto">
                {notifs.length === 0 ? (
                  <div className="p-4 text-center text-sm text-default-500">
                    No tienes notificaciones.
                  </div>
                ) : (
                  <ul className="divide-y">
                    {notifs.map((n) => (
                      <li key={n.id} className="p-3 hover:bg-default-50 cursor-pointer">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium">{n.title}</p>
                          <span className="text-[11px] text-default-500">{n.time}</span>
                        </div>
                        {n.body && <p className="text-xs text-default-500 mt-0.5">{n.body}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Perfil / Usuario */}
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly variant="light" radius="full" className="h-9 w-9" aria-label="Usuario">
                <Avatar
                  size="sm"
                  src={user.avatarUrl}
                  name={user.name ?? "U"}
                  className="ring-1 ring-default-200"
                />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Menú de usuario" className="w-[280px]">
              <DropdownItem key="profile" isReadOnly className="h-auto cursor-default">
                <UserCard
                  name={user.name ?? "Usuario"}
                  description={
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </span>
                  }
                  avatarProps={{ src: user.avatarUrl, name: user.name ?? "K" }}
                />
                <Chip size="sm" variant="flat" className="mt-2">
                  {user.role}
                </Chip>
              </DropdownItem>

              <DropdownItem key="settings" startContent={<Settings className="h-4 w-4" />}>
                Configuración
              </DropdownItem>
              <DropdownItem key="profile-btn" startContent={<UserRound className="h-4 w-4" />}>
                Mi perfil
              </DropdownItem>

              <DropdownItem
                key="logout"
                className="text-danger"
                color="danger"
                startContent={<LogOut className="h-4 w-4" />}
                onPress={handleLogout}
              >
                Cerrar sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </header>

      {/* ======================== SIDEBAR ======================== */}
      <aside
        className="
          peer group/sidebar fixed top-16 left-0 bottom-0 z-30
          bg-white overflow-hidden transition-all duration-200
          w-16 hover:w-64 flex flex-col
        "
      >
        <nav className="mt-4 px-2 py-2 flex flex-col gap-1 flex-1">
          <HoverItem to="/home"         icon={<HomeIcon className="h-5 w-5" />}     label="Inicio" />
          <SidebarItemWithChildren
            to="/actividades"
            icon={<ListChecks className="h-5 w-5" />}
            label="actividades"
            childrenLinks={[
              { to: "/registrar-actividad", label: "Registrar actividad" },
            ]}
            open={openActividad}
            onToggle={() => setOpenActividad(v => !v)}
          />

          <SidebarItemWithChildren
            to="/cultivos"
            icon={<Sprout className="h-5 w-5" />}
            label="Cultivos"
            childrenLinks={[
              { to: "/historial-cultivo", label: "Historial de cultivo" },
              { to: "/registrar-cultivo", label: "Registrar cultivo" },
            ]}
            open={openCultivos}
            onToggle={() => setOpenCultivos(v => !v)}
          />

          <HoverItem to="/fitos"        icon={<Bug className="h-5 w-5" />}          label="Fitosanitario" />
          <SidebarItemWithChildren
            to="/iot"
            icon={<Cpu className="h-5 w-5" />}
            label="IoT"
            childrenLinks={[
              { to: "/iot-registar", label: "Registrar IoT" },
              { to: "/iot-parametro", label: "Parámetro Sensor" },
            ]}
            open={openIot}
            onToggle={() => setOpenIot(v => !v)}
          />
          <HoverItem to="/finanzas"     icon={<Wallet className="h-5 w-5" />}       label="Finanzas" />
          <HoverItem to="/inventario"   icon={<Boxes className="h-5 w-5" />}        label="Inventario" />
          <HoverItem to="/reportes"     icon={<FileBarChart className="h-5 w-5" />} label="Reportes" />
          <HoverItem to="/permisos"     icon={<FileBarChart className="h-5 w-5" />} label="permisos" />
          <SidebarItemWithChildren
            to="/usuarios"
            icon={<Users   className="h-5 w-5" />}
            label="Usuarios"
            childrenLinks={[
              { to: "/lista-usuarios", label: "lista de usuarios" },
              { to: "/usuario-registrar", label: "Registrar usuario" },
            ]}
            open={openUsuario}
            onToggle={() => setOpenUsuario(v => !v)}
          />
        </nav>

        {/* Botón Cerrar sesión al fondo */}
        <button
          onClick={handleLogout}
          className="flex items-center h-10 px-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <span className="grid place-items-center h-10 w-10 shrink-0">
            <LogOut className="h-5 w-5" />
          </span>
          <span
            className="
              ml-0 whitespace-nowrap overflow-hidden
              w-0 opacity-0 transition-all duration-200
              group-hover/sidebar:ml-2 group-hover/sidebar:w-40 group-hover/sidebar:opacity-100
            "
          >
            Cerrar sesión
          </span>
        </button>
      </aside>

      {/* ======================== CONTENIDO ======================== */}
      <main
        className="
          relative p-4 md:p-6 transition-[margin] duration-200
          ml-16 peer-hover:ml-64
        "
      >
        <Outlet context={{ setTitle } satisfies LayoutContext} />
      </main>
    </div>
  );
}


function HoverItem({
  icon,
  label,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
}) {
  const base =
    "flex items-center rounded-md transition-colors h-10 px-2 hover:bg-default-100 text-foreground-600";
  const active = "bg-success/10 text-success hover:bg-success/10";

  return (
    <NavLink to={to} className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
      <span className="grid place-items-center h-10 w-10 shrink-0">{icon}</span>
      <span
        className="
          ml-0 text-sm whitespace-nowrap overflow-hidden
          w-0 opacity-0 transition-all duration-200
          group-hover/sidebar:ml-2 group-hover/sidebar:w-40 group-hover/sidebar:opacity-100
        "
      >
        {label}
      </span>
    </NavLink>
  );
}

function SidebarItemWithChildren({
  icon,
  label,
  to,
  childrenLinks,
  open,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
  childrenLinks: Array<{ to: string; label: string }>;
  open: boolean;
  onToggle: () => void;
}) {
  const location = useLocation();
  const isParentActive =
    location.pathname === to || location.pathname.startsWith(to + "/");

  const base =
    "group/item flex items-center rounded-md transition-colors h-10 px-2 hover:bg-default-100 text-foreground-600";
  const active = "bg-success/10 text-success hover:bg-success/10";

  return (
    <div className="relative">
      <NavLink to={to} className={({ isActive }) => `${base} ${isActive || isParentActive ? active : ""}`}>
        <span className="grid place-items-center h-10 w-10 shrink-0">{icon}</span>
        <span
          className="
            ml-0 text-sm whitespace-nowrap overflow-hidden
            w-0 opacity-0 transition-all duration-200
            group-hover/sidebar:ml-2 group-hover/sidebar:w-40 group-hover/sidebar:opacity-100
          "
        >
          {label}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle();
          }}
          className="
            ml-auto hidden items-center justify-center w-6 h-6 rounded
            hover:bg-default-100
            group-hover/sidebar:flex
          "
          aria-expanded={open}
          aria-label={open ? "Ocultar submenú" : "Mostrar submenú"}
          title={open ? "Ocultar submenú" : "Mostrar submenú"}
        >
          <ChevronRight className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`} />
        </button>
      </NavLink>

      <div className={`pl-10 pr-2 ${open ? "block" : "hidden"}`}>
        <ul className="mt-1 mb-2 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
          {childrenLinks.map((child) => (
            <li key={child.to}>
              <SubItem to={child.to} label={child.label} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SubItem({ to, label }: { to: string; label: string }) {
  const base =
    "flex items-center h-9 rounded-md text-sm px-2 hover:bg-default-100 text-foreground-600";
  const active = "bg-success/10 text-success hover:bg-success/10";

  return (
    <NavLink to={to} className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-default-400" />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}
