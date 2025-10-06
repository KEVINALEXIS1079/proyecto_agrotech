import { Routes, Route, Navigate } from "react-router-dom";

// Públicas
import LandingPage from "#/modules/landing/pages/LandingPage";
import { Login, Register, Recover, Code, ChangePassword } from "@/modules/auth";

// Layout privado
import ProtectedLayout from "@/app/layout/ProtectedLayout";

// Páginas privadas
import Home from "@/modules/landing/pages/HomePage";

import { ListaPage, CrearPage, EditarPage } from "@/modules/actividad/pages/indePageActividad";

import { Usuarios, ListarUsuario, CrearPageUsuario, EditarPageUsuario } from "@/modules/usuarios/usuarios/pages/indexPageUsuario";

import { Cultivo, ListaPageCultivo, CrearPageCultivo, EditarPageCultivo } from "@/modules/cultivo/cultivo/pages/indexPageCultivo";

import { ListaPageFito, CrearPageFito, EditarPageFito,FitoPage } from "@/modules/fitosanitario/pages/indexPageFito";

import { FinanzasPage, ListaPageFinanzas, CrearPageFinanzas, EditarPageFinanzas } from "@/modules/finanzas/pages/indexPageFinanzas";

import { InventarioPage, ListaPageInventario, CrearPageInventario, EditarPageInventario } from "@/modules/inventario/Almacen/pages/indexPageInventario";

import { PageReportes, ListaPageReporte, CrearPageReporte, EditarPageReporte } from "@/modules/reportes/pages/indexPageReportes";

import {AsignarPermisosRolPage, AsignarPermisosUsuarioPage, CrearPermisoPage, ListaPermisosPage, QuitarPermisosUsuarioPage} from "@/modules/permisos/permisos/pages/indexPagePermisos";

import { ListaPage as ListaPageIot, CrearPageIot, EditarPageIot, IotPage } from "@/modules/iot/Sensor/pages/indexPageIot";

import  {CrearPageTipoIot, ListaPageTipoIot, EditarPageTipoIot}  from "@/modules/iot/TipoSensor/pages/indexPageTipoSensor";

import  CrearPageTipoCultivo  from "@/modules/cultivo/tipoCultivo/pages/crearPage";

import  PerfilPage  from "@/modules/usuarios/perfil/pages/PerfilPage";
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

        {/* Perfil */}
        <Route path="/perfil" element={<PerfilPage />} />
        {/* Cultivos */}
        <Route path="/cultivos" element={<Cultivo />} />
        <Route path="/registrar-cultivo" element={<CrearPageCultivo />} />
        <Route path="/editar-cultivo" element={<EditarPageCultivo />} />
        <Route path="/listar-cultivo" element={<ListaPageCultivo />} />
        <Route path="/tipo-cultivo/crear" element={<CrearPageTipoCultivo />} />

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
        <Route path="/permisos-asignar-rol" element={<AsignarPermisosRolPage />} />
        <Route path="/permisos-asignar-usuario" element={<AsignarPermisosUsuarioPage />} />
        <Route path="/lista-permisos" element={<ListaPermisosPage />} />
        <Route path="/crear-permiso" element={<CrearPermisoPage />} />
        <Route path="/quitar-permisos-usuario" element={<QuitarPermisosUsuarioPage />} />
          


        {/* IoT */}
       <Route path="/iot" element={<IotPage />} />
        <Route path="/iot-registrar" element={<CrearPageIot />} />
       <Route path="/iot/editar/:id" element={<EditarPageIot />} />
        <Route path="/tipo-sensor/crear" element={<CrearPageTipoIot />} />
        <Route path="/tipo-sensor" element={<ListaPageTipoIot />} />
        <Route path="/tipo-sensor/editar/:id" element={<EditarPageTipoIot />} />


      </Route>
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/start" replace />} />
    </Routes>
  );
}