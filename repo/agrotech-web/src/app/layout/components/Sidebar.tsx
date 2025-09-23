import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home as HomeIcon,
  Sprout,
  Bug,
  Cpu,
  Wallet,
  Boxes,
  FileBarChart,
  Users,
  ListChecks,
  ChevronRight,
  LogOut,
  ToggleRight,
} from "lucide-react";

/** Props opcionales */
export type SidebarProps = {
  className?: string;
  onLogout?: () => void; // para enganchar tu lógica de cierre de sesión
};

export default function Sidebar({ className = "", onLogout }: SidebarProps) {
  const location = useLocation();

  // Estado de secciones abiertas (submenús)
  const [openCultivos, setOpenCultivos] = useState(false);
  const [openIot, setOpenIot] = useState(location.pathname.startsWith("/iot"));
  const [openActividad, setOpenActividad] = useState(location.pathname.startsWith("/actividades"));
  const [openUsuario, setOpenUsuario] = useState(location.pathname.startsWith("/usuarios"));
  const [openFito, setOpenFito] = useState(location.pathname.startsWith("/fitos"));
  const [openFinanzas, setOpenFinanzas] = useState(location.pathname.startsWith("/finanzas"));
  const [openInventario, setOpenInventario] = useState(location.pathname.startsWith("/inventario"));
  const [openReportes, setOpenReportes] = useState(location.pathname.startsWith("/reportes"));
  const [openPermisos, setOpenPermisos] = useState(location.pathname.startsWith("/permisos"));

  // Abrir "Cultivos" si la ruta actual pertenece a ese contexto
  useEffect(() => {
    const isCultivos = location.pathname === "/cultivos" || location.pathname.startsWith("/cultivos/");
    if (isCultivos) setOpenCultivos(true);
  }, [location.pathname]);

  return (
    <aside
      className={
        `
        peer group/sidebar fixed top-16 left-0 bottom-0 z-30
        bg-white overflow-hidden transition-all duration-200
        w-16 hover:w-64 flex flex-col shadow-sm
        ` + className
      }
    >
      <nav className="mt-4 px-2 py-2 flex flex-col gap-1 flex-1">
        <HoverItem to="/home" icon={<HomeIcon className="h-5 w-5" />} label="Inicio" />

        <SidebarItemWithChildren
          to="/actividades"
          icon={<ListChecks className="h-5 w-5" />}
          label="Actividades"
          childrenLinks={[
           { to: "/actividades/crear", label: "Registrar actividad" },
          ]}
          open={openActividad}
          onToggle={() => setOpenActividad(v => !v)}
        />

        <SidebarItemWithChildren
          to="/cultivos"
          icon={<Sprout className="h-5 w-5" />}
          label="Cultivos"
          childrenLinks={[
            { to: "/listar-cultivo", label: "Historial de cultivo" },
            { to: "/registrar-cultivo", label: "Registrar cultivo" },
            { to: "/editar-cultivo", label: "Editar cultivo" },
          ]}
          open={openCultivos}
          onToggle={() => setOpenCultivos(v => !v)}
        />

        <SidebarItemWithChildren
          to="/fitos"
          icon={<Bug className="h-5 w-5" />}
          label="Fitosanitario"
          childrenLinks={[
            { to: "/listar-fitos", label: "Historial de fitosanitario" },
            { to: "/registrar-fitos", label: "Registrar fitosanitario" },
            { to: "/editar-fito", label: "Editar fitosanitario" },
          ]}
          open={openFito}
          onToggle={() => setOpenFito(v => !v)}
        />

        <SidebarItemWithChildren
          to="/iot"
          icon={<Cpu className="h-5 w-5" />}
          label="IoT"
          childrenLinks={[
            { to: "/iot-registrar", label: "Registrar IoT" },      // corregido
            { to: "/iot-parametro", label: "Parámetro Sensor" },
          ]}
          open={openIot}
          onToggle={() => setOpenIot(v => !v)}
        />

        <SidebarItemWithChildren
          to="/finanzas"
          icon={<Wallet className="h-5 w-5" />}
          label="Finanzas"
          childrenLinks={[
            { to: "/lista-finanzas", label: "Historial de finanzas" },
            { to: "/crear-finanzas", label: "Registrar finanzas" },
            { to: "/editar-finanzas", label: "Editar finanzas" },
          ]}
          open={openFinanzas}
          onToggle={() => setOpenFinanzas(v => !v)}
        />

          <SidebarItemWithChildren
          to="/inventario"
          icon={<Boxes className="h-5 w-5" />}
          label="Inventario"
          childrenLinks={[
            { to: "/lista-inventario", label: "Historial de inventario" },
            { to: "/inventario-registrar", label: "Registrar inventario" },
            { to: "/editar-inventario", label: "Editar inventario" },
          ]}
          open={openInventario}
          onToggle={() => setOpenInventario(v => !v)}
        />
        
        <SidebarItemWithChildren
          to="/reportes"
          icon={<FileBarChart className="h-5 w-5" />}
          label="Reportes"
          childrenLinks={[
            { to: "/lista-reportes", label: "Lista de reportes" },
            { to: "/crear-reporte", label: "Crear reporte" },
            { to: "/editar-reporte", label: "Editar reporte" },
          ]}
          open={openReportes}
          onToggle={() => setOpenReportes(v => !v)}
        />
        
        <SidebarItemWithChildren
          to="/permisos"
          icon={<ToggleRight className="h-5 w-5" />}
          label="Permisos"
          childrenLinks={[
            { to: "/lista-permisos", label: "Lista de permisos" },
            { to: "/crear-permiso", label: "Crear permiso" },
            { to: "/editar-permiso", label: "Editar permiso" },
          ]}
          open={openPermisos}
          onToggle={() => setOpenPermisos(v => !v)}
        />

        <SidebarItemWithChildren
          to="/usuarios"
          icon={<Users className="h-5 w-5" />}
          label="Usuarios"
          childrenLinks={[
            { to: "/lista-usuarios", label: "Lista de usuarios" },
            { to: "/usuario-registrar", label: "Registrar usuario" },
          ]}
          open={openUsuario}
          onToggle={() => setOpenUsuario(v => !v)}
        />
      </nav>

      {/* Botón Cerrar sesión al fondo */}
      <button
        onClick={onLogout}
        className="flex items-center h-10 px-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
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
  );
}

/* =================== Items de navegación (internos) =================== */

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
