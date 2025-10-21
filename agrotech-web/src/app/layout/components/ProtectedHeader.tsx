// src/app/layout/components/ProtectedHeader.tsx
import { useNavigate } from "react-router-dom";
import {
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  User as UserCard,
  Avatar,
} from "@heroui/react";
import { Search, Settings, UserRound, LogOut, Mail } from "lucide-react";
import HeaderNotifications from "./HeaderNotifications";

type Notification = { id: string; title: string; body?: string; unread?: boolean; time?: string };
type UserInfo = { name: string; email: string; avatarUrl?: string; role?: string };

export default function ProtectedHeader({
  title,
  user,
  notifications = [],
  onLogout,
}: {
  title: string;
  user: UserInfo;
  notifications?: Notification[];
  onLogout: () => void;
}) {
  const navigate = useNavigate();

  return (
    <header className="h-16 px-4 md:px-6 flex items-center gap-3 bg-white sticky top-0 z-30 shadow-sm">
      <img src="/LogoTic.png" alt="TIC" className="h-10 md:h-12 w-auto object-contain" />
      <h1 className="text-lg font-semibold hidden sm:block">{title}</h1>

      <div className="ml-auto flex items-center gap-3">
        <Input
          size="sm"
          className="w-48 sm:w-64 md:w-80"
          placeholder="Buscar"
          startContent={<Search className="h-4 w-4 text-default-500" />}
        />

        <HeaderNotifications items={notifications} />

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <button aria-label="Usuario">
              <Avatar
                size="sm"
                src={user.avatarUrl || undefined}
                name={user.name || "U"}
                className="ring-1 ring-default-200"
              />
            </button>
          </DropdownTrigger>

          <DropdownMenu aria-label="Menú de usuario" className="w-[280px]">
            <DropdownItem key="profile" isReadOnly className="h-auto cursor-default">
              <UserCard
                name={user.name || "Usuario"}
                description={
                  <span className="inline-flex items-center gap-1 text-xs">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </span>
                }
                avatarProps={{ src: user.avatarUrl || undefined, name: user.name || "U" }}
              />
              <Chip size="sm" variant="flat" className="mt-2">
                {user.role ?? "Invitado"}
              </Chip>
            </DropdownItem>

            <DropdownItem
              key="settings"
              startContent={<Settings className="h-4 w-4" />}
              onPress={() => navigate("/perfil/ajustes")}
            >
              Configuración
            </DropdownItem>

            <DropdownItem
              key="profile-btn"
              startContent={<UserRound className="h-4 w-4" />}
              onPress={() => navigate("/perfil")}
            >
              Mi perfil
            </DropdownItem>

            <DropdownItem
              key="logout"
              className="text-danger"
              color="danger"
              startContent={<LogOut className="h-4 w-4" />}
              onPress={onLogout}
            >
              Cerrar sesión
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
}
