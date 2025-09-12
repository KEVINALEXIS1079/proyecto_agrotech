// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth_page/login";
import Register from "./pages/auth_page/register";
import Recover from "./pages/auth_page/recover";
import Code from "./pages/auth_page/code";
import RecoveryPassword from "./pages/auth_page/ChangePassword";
import Start from "./pages/start";

import Home from "./pages/page_private/home";

import Cultivos from "./pages/page_private/cultivo/cultivos";
import HistorialCultivo from "./pages/page_private/cultivo/historialCultivo";
import RegistrarCultivo from "./pages/page_private/cultivo/registrarCultivo";

import Actividades from "./pages/page_private/actividad/actividades";
import ActividadesRegistrar from "./pages/page_private/actividad/registarActividad";
import ActividadesEditar from "./pages/page_private/actividad/EditarActividad";

import ProtectedLayout from "./layouts/ProtectedLayout";

import Iot from "./pages/page_private/iot/iot";
import IotRegistrarSensor from "./pages/page_private/iot/IotRegistrarSensor";
import IotParametro from "./pages/page_private/iot/iotParametros"
;
import Usuario from "./pages/page_private/usuarios/usuarios";
import ListarUsuario from "./pages/page_private/usuarios/ListarUsuarios";
import RegistrarUsuario from "./pages/page_private/usuarios/RegistrarUsuarios";
import EditarUsuario from "./pages/page_private/usuarios/EditarUsuario";

import Permisos from "./pages/page_private/permisos/permisis"

import {
  ProtectedRoute,
  PublicOnlyRoute,
  RequireRecoveryEmail,
  RequireRecoveryCode,
} from "./routes/guards";

const isAuthenticated = () => Boolean(localStorage.getItem("token"));

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated() ? "/home" : "/start"} replace />
        }
      />

      {/* Públicas solo si NO hay sesión */}
      <Route
        path="/start"
        element={
          <PublicOnlyRoute>
            <Start />
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

      {/* Flujo de recuperación encadenado */}
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
          <RequireRecoveryEmail>
            <Code />
          </RequireRecoveryEmail>
        }
      />
      <Route
        path="/recovery"
        element={
          <RequireRecoveryCode>
            <RecoveryPassword />
          </RequireRecoveryCode>
        }
      />

      {/* Privadas con layout */}
      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/cultivos" element={<Cultivos />} />
        <Route path="/historial-cultivo" element={<HistorialCultivo />} />
        <Route path="/registrar-cultivo" element={<RegistrarCultivo />} />

        <Route path="/actividades" element={<Actividades />} />
        <Route path="/registrar-actividad" element={<ActividadesRegistrar />} />
        <Route path="/actividades-editar/:id" element={<ActividadesEditar />} />

        <Route path="/iot" element={<Iot />} />
        <Route path="/iot-registar" element={<IotRegistrarSensor />} />
        <Route path="/iot-parametro" element={<IotParametro />} />

        <Route path="/usuarios" element={<Usuario />} />
        <Route path="/lista-usuarios" element={<ListarUsuario />} />
        <Route path="/usuario-registrar" element={<RegistrarUsuario />} />
        <Route path="/usuarios-editar/:id" element={<EditarUsuario />} />

        <Route path="/permisos" element={<Permisos />} />

      </Route>

      <Route path="*" element={<Navigate to="/start" replace />} />
    </Routes>
  );
}
