import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProtectedHeader from "./components/ProtectedHeader";

export type LayoutContext = { setTitle: (t: string) => void };

function getCurrentUser() {
  const email = localStorage.getItem("recoveryEmail") ?? "sin-correo@example.com";
  const name = localStorage.getItem("fullName") ?? "Usuario";
  const avatarUrl = localStorage.getItem("avatarUrl") ?? "";
  const role = localStorage.getItem("role") ?? "Invitado";
  return { name, email, avatarUrl, role };
}

export default function ProtectedLayout() {
  const [title, setTitle] = useState("Inicio");
  const navigate = useNavigate();
  const user = getCurrentUser();

  const notifs = [
    { id: "n1", title: "Alerta de pH bajo", body: "El cultivo de cacao presenta bajos niveles de pH.", unread: true, time: "hace 2 min" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("fullName");
    localStorage.removeItem("avatarUrl");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-dvh bg-white">
      {/* Barra superior (vuelve a aparecer) */}
      <ProtectedHeader
        title={title}
        user={user}
        notifications={notifs}
        onLogout={handleLogout}
      />

      {/* Menú lateral (queda debajo de la barra; nota el top-16 en Sidebar) */}
      <Sidebar onLogout={handleLogout} />

      {/* Contenido */}
      <main className="relative p-4 md:p-6 transition-[margin] duration-200 ml-16 peer-hover:ml-64">
        <Outlet context={{ setTitle } satisfies LayoutContext} />
      </main>
    </div>
  );
}
