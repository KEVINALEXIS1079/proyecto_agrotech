import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Input } from "@heroui/react";
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
  LogOut, // 👈 NUEVO
} from "lucide-react";

export type LayoutContext = { setTitle: (t: string) => void };

export default function ProtectedLayout() {
  const [title, setTitle] = useState("Inicio");

  const location = useLocation();
  const navigate = useNavigate(); // 👈 NUEVO
  const isCultivosContext =
    location.pathname === "/cultivos" || location.pathname.startsWith("/cultivos/");
  const [openCultivos, setOpenCultivos] = useState<boolean>(false);

  useEffect(() => {
    if (isCultivosContext) setOpenCultivos(true);
  }, [isCultivosContext]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/start", { replace: true });
  };

  return (
    <div className="min-h-dvh bg-white">
      <header className="h-16 px-4 md:px-6 flex items-center gap-3 bg-white sticky top-0 z-30">
        <img src="/LogoTic.png" alt="TIC" className="h-10 md:h-12 w-auto object-contain" />
        <h1 className="text-lg font-semibold hidden sm:block">{title}</h1>

        <div className="ml-auto flex items-center gap-3">
          <Input
            size="sm"
            className="w-48 sm:w-64 md:w-80"
            placeholder="Buscar"
            startContent={<Search className="h-4 w-4 text-default-500" />}
          />
          <button className="h-9 w-9 rounded-full grid place-items-center hover:bg-default-100">
            <Bell className="h-5 w-5" />
          </button>
          <button className="h-9 w-9 rounded-full bg-default-200 grid place-items-center font-medium">
            U
          </button>
        </div>
      </header>

      <aside
        className="
          peer group/sidebar fixed top-16 left-0 bottom-0 z-30
          bg-white overflow-hidden transition-all duration-200
          w-16 hover:w-64 flex flex-col
        "
      >
        <nav className="mt-4 px-2 py-2 flex flex-col gap-1 flex-1">
          <HoverItem to="/home"         icon={<HomeIcon className="h-5 w-5" />}     label="Inicio" />
          <HoverItem to="/actividades"  icon={<ListChecks className="h-5 w-5" />}   label="Actividades" />

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
          <HoverItem to="/iot"          icon={<Cpu className="h-5 w-5" />}          label="IoT" />
          <HoverItem to="/finanzas"     icon={<Wallet className="h-5 w-5" />}       label="Finanzas" />
          <HoverItem to="/inventario"   icon={<Boxes className="h-5 w-5" />}        label="Inventario" />
          <HoverItem to="/reportes"     icon={<FileBarChart className="h-5 w-5" />} label="Reportes" />
          <HoverItem to="/usuarios"     icon={<Users className="h-5 w-5" />}        label="Usuarios" />
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
