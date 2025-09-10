// src/components/Menu.tsx
import { NavLink } from "react-router-dom";
import { Home as HomeIcon, Sprout, Boxes, FileBarChart, Users } from "lucide-react";

type Item = {
  to: string;
  label: string;
  icon?: React.ComponentType<any>;
};

const items: Item[] = [
  { to: "/", label: "Inicio", icon: HomeIcon },
  { to: "/cultivos", label: "Cultivos", icon: Sprout },
  { to: "/insumos", label: "Insumos", icon: Boxes },
  { to: "/reportes", label: "Reportes", icon: FileBarChart },
  { to: "/usuarios", label: "Usuarios", icon: Users },
];

const baseBtn =
  "flex items-center gap-2 h-9 px-4 text-sm font-medium rounded-full transition";
const activeBtn =
  "bg-emerald-600 text-white";
const inactiveBtn =
  "text-emerald-700 hover:bg-emerald-50 data-[hover=true]:bg-emerald-50";

export default function Menu() {
  return (
    <nav className="flex flex-wrap gap-2">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${baseBtn} ${isActive ? activeBtn : inactiveBtn}`
          }
        >
          {Icon ? <Icon className="h-4 w-4" /> : null}
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
