// src/routes/guards.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const isAuthenticated = () => Boolean(localStorage.getItem("token"));
const getRecoveryEmail = () => localStorage.getItem("recoveryEmail");
const getRecoveryCode  = () => localStorage.getItem("recoveryCode");

// Rutas privadas: requieren login (/home, /cultivos, etc.)
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
}

// Públicas solo si NO estás logueado (/login, /register, /start, opcional /recover)
export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <Navigate to="/home" replace /> : <>{children}</>;
}

/** /code requiere email (lo setea /recover) */
export function RequireRecoveryEmail({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const fromStateEmail = ((location.state as { email?: string } | null)?.email) || "";
  if (fromStateEmail) localStorage.setItem("recoveryEmail", fromStateEmail);

  const email = getRecoveryEmail();
  if (!email) return <Navigate to="/recover" replace />;
  return <>{children}</>;
}

/** /change-password (o /recovery) requiere email + código (los setea /code) */
export function RequireRecoveryCode({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const fromState = (location.state as { email?: string; codigo?: string } | null) || {};
  const stateEmail = fromState.email || "";
  const stateCode  = fromState.codigo || "";

  if (stateEmail) localStorage.setItem("recoveryEmail", stateEmail);
  if (stateCode)  localStorage.setItem("recoveryCode",  stateCode);

  const email = getRecoveryEmail();
  const code  = getRecoveryCode();

  if (!email) return <Navigate to="/recover" replace />;
  if (!code)  return <Navigate to="/code" replace />;
  return <>{children}</>;
}
