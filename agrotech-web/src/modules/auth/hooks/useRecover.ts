// src/modules/auth/hooks/useRecover.ts
import { useMutation } from "@tanstack/react-query";
import { recoverRequest, recoverVerify, recoverChange } from "../api/auth";

// -------- Paso 1: solicitar código
type RecoverReqData = { message: string };
type RecoverReqVars = { email: string };
type RecoverErr = Error;

export function useRecoverRequest() {
  return useMutation<RecoverReqData, RecoverErr, RecoverReqVars>({
    mutationKey: ["auth", "recover", "request"],
    mutationFn: ({ email }) => recoverRequest(email),
  });
}

// -------- Paso 2: verificar código
type RecoverVerifyData = { message: string };
type RecoverVerifyVars = { email: string; codigo: string };

export function useRecoverVerify() {
  return useMutation<RecoverVerifyData, RecoverErr, RecoverVerifyVars>({
    mutationKey: ["auth", "recover", "verify"],
    mutationFn: ({ email, codigo }) => recoverVerify(email, codigo),
  });
}

// -------- Paso 3: cambiar contraseña con código
type RecoverChangeData = { message: string };
type RecoverChangeVars = { email: string; nuevaContrasena: string; codigo: string };

export function useRecoverChange() {
  return useMutation<RecoverChangeData, RecoverErr, RecoverChangeVars>({
    mutationKey: ["auth", "recover", "change"],
    mutationFn: ({ email, nuevaContrasena, codigo }) =>
      recoverChange(email, nuevaContrasena, codigo),
  });
}
