import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
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
import { Search, Bell, LogOut, Settings, UserRound, Mail } from "lucide-react";

/** Lee el usuario guardado tras el login */
function getCurrentUser() {
  try {
    const raw = localStorage.getItem("user"); // { name, email, role?, avatarUrl? }
    if (!raw) return null;
    const u = JSON.parse(raw);
    return {
      name: u?.name ?? "Usuario",
      email: u?.email ?? "sin-correo@example.com",
      role: u?.role ?? "Invitado",
      avatarUrl: u?.avatarUrl ?? "",
    };
  } catch {
    return null;
  }
}

export default function AppLayout() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Mock de notificaciones; reemplázalo por tu data del backend
  const notifs = [
    { id: "1", title: "Nueva actividad", body: "Riego - Lote 3", unread: true, time: "hoy" },
    { id: "2", title: "Sensor fuera de umbral", body: "Humedad < 25%", unread: true, time: "10 min" },
  ];
  const unreadCount = notifs.filter((n) => n.unread).length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/start", { replace: true });
  };

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto w-full p-3 flex items-center gap-3">
          {/* Logo / título */}
          <div className="font-semibold mr-auto">AgroTech</div>

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
                content={unreadCount || null}
                shape="circle"
                color="danger"
                isInvisible={!unreadCount}
              >
                <Button isIconOnly variant="light" aria-label="Notificaciones">
                  <Bell className="h-5 w-5" />
                </Button>
              </Badge>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[300px]">
              <div className="p-3 flex items-center justify-between">
                <h4 className="text-base font-semibold">Notificaciones</h4>
                <Chip size="sm" variant="flat" color="primary">
                  {unreadCount} sin leer
                </Chip>
              </div>
              <Divider />
              <div className="max-h-[240px] overflow-y-auto">
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
                        {n.body && <p className="text-xs text-default-500">{n.body}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Perfil */}
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                variant="light"
                className="px-2"
                startContent={
                  <Avatar
                    size="sm"
                    src={user?.avatarUrl}
                    name={user?.name ?? "U"}
                    className="ring-1 ring-default-200"
                  />
                }
              >
                <span className="hidden sm:inline text-sm">
                  {user?.name ?? "Usuario"}
                </span>
              </Button>
            </DropdownTrigger>

            <DropdownMenu aria-label="Menú de usuario" className="w-[260px]">
              <DropdownItem key="profile" isReadOnly className="h-auto cursor-default">
                <UserCard
                  name={user?.name ?? "Usuario"}
                  description={
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Mail className="h-3 w-3" />
                      {user?.email ?? "sin-correo@example.com"}
                    </span>
                  }
                  avatarProps={{ src: user?.avatarUrl, name: user?.name ?? "U" }}
                />
                <Chip size="sm" variant="flat" className="mt-2">
                  {user?.role ?? "Invitado"}
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

      {/* Contenido */}
      <main className="max-w-6xl mx-auto w-full p-6">
        <Outlet />
      </main>
    </div>
  );
}
