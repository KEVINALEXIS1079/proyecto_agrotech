import { Routes, Route, Navigate } from "react-router-dom";

// Públicas
import LandingPage from "#/modules/landing/pages/LandingPage";
import { Login, Register, Recover, Code, ChangePassword } from "@/modules/auth";

// Layout privado
import ProtectedLayout from "@/app/layout/ProtectedLayout";

// Páginas privadas
import Home from "@/modules/landing/pages/HomePage";

import { ListaPage, CrearPage, EditarPage } from "@/modules/actividad/pages/indePageActividad";

import { Usuarios, ListarUsuario, CrearPageUsuario, EditarPageUsuario } from "@/modules/usuarios/pages/indexPageUsuario";

import { Cultivo, ListaPageCultivo, CrearPageCultivo, EditarPageCultivo } from "@/modules/cultivo/pages/indexPageCultivo";

import { ListaPageFito, CrearPageFito, EditarPageFito,FitoPage } from "@/modules/fitosanitario/pages/indexPageFito";

import { FinanzasPage, ListaPageFinanzas, CrearPageFinanzas, EditarPageFinanzas } from "@/modules/finanzas/pages/indexPageFinanzas";

import { InventarioPage, ListaPageInventario, CrearPageInventario, EditarPageInventario } from "@/modules/inventario/pages/indexPageInventario";

import { PageReportes, ListaPageReporte, CrearPageReporte, EditarPageReporte } from "@/modules/reportes/pages/indexPageReportes";

import { PagePermisos, ListaPagePermisos, CrearPagePermisos, EditarPagePermisos } from "@/modules/permisos/pages/indexPagePermisos";

import { ListaPage as ListaPageIot, CrearPageIot, EditarPageIot, IotPage } from "@/modules/iot/pages/indexPageIot";

// Guards
import {
  ProtectedRoute,
  PublicOnlyRoute,
  RequireRecoveryEmail,
  RequireRecoveryCode,
} from "@/app/guards";

export default function AppRoutes() {
  const isAuthenticated = () => Boolean(localStorage.getItem("token"));

  return (
    <Routes>
      {/* Raíz */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated() ? "/home" : "/start"} replace />}
      />

      {/* ===== Públicas ===== */}
      <Route
        path="/start"
        element={
          <PublicOnlyRoute>
            <LandingPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/recover"
        element={
          <PublicOnlyRoute>
            <Recover />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/code"
        element={
          <PublicOnlyRoute>
            <RequireRecoveryEmail>
              <Code />
            </RequireRecoveryEmail>
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <PublicOnlyRoute>
            <RequireRecoveryCode>
              <ChangePassword />
            </RequireRecoveryCode>
          </PublicOnlyRoute>
        }
      />

      {/* ===== Privadas ===== */}
      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        {/* Home */}
        <Route path="/home" element={<Home />} />

        {/* Actividades */}
        <Route path="/actividades" element={<ListaPage />} />
        <Route path="/actividades/crear" element={<CrearPage />} />
        <Route path="/actividades/editar/:id" element={<EditarPage />} />

        {/* Usuarios */}
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/lista-usuarios" element={<ListarUsuario />} />
        <Route path="/usuario-registrar" element={<CrearPageUsuario />} />
        <Route path="/usuarios/editar/:id" element={<EditarPageUsuario />} />

        {/* Cultivos */}
        <Route path="/cultivos" element={<Cultivo />} />
        <Route path="/registrar-cultivo" element={<CrearPageCultivo />} />
        <Route path="/editar-cultivo" element={<EditarPageCultivo />} />
        <Route path="/listar-cultivo" element={<ListaPageCultivo />} />

        {/* Fitosanitario */}
        <Route path="/fitos" element={<FitoPage />} />
        <Route path="/listar-fitos" element={<ListaPageFito />} />
        <Route path="/registrar-fitos" element={<CrearPageFito />} />
        <Route path="/editar-fito" element={<EditarPageFito />} />

        {/* Finanzas */}
        <Route path="/finanzas" element={<FinanzasPage />} />
        <Route path="/lista-finanzas" element={<ListaPageFinanzas />} />
        <Route path="/crear-finanzas" element={<CrearPageFinanzas />} />
        <Route path="/editar-finanzas" element={<EditarPageFinanzas />} />

        {/* Inventario */}
        <Route path="/inventario" element={<InventarioPage />} />
        <Route path="/lista-inventario" element={<ListaPageInventario />} />
        <Route path="/inventario-registrar" element={<CrearPageInventario />} />
        <Route path="/editar-inventario" element={<EditarPageInventario />} />

        {/* Reportes */}
        <Route path="/reportes" element={<PageReportes />} />
        <Route path="/lista-reportes" element={<ListaPageReporte />} />
        <Route path="/crear-reporte" element={<CrearPageReporte />} />
        <Route path="/editar-reporte" element={<EditarPageReporte />} />

        {/* Permisos */}
        <Route path="/permisos" element={<PagePermisos />} />
        <Route path="/lista-permisos" element={<ListaPagePermisos />} />
        <Route path="/crear-permiso" element={<CrearPagePermisos />} />
        <Route path="/editar-permiso" element={<EditarPagePermisos />} />

        {/* IoT */}
        <Route path="/iot" element={<IotPage />} />
        <Route path="/lista-iot" element={<ListaPageIot />} />
        <Route path="/iot-registrar" element={<CrearPageIot />} />
        <Route path="/Parámetro Sensor" element={<EditarPageIot />} />

      </Route>
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/start" replace />} />
    </Routes>
  );
}