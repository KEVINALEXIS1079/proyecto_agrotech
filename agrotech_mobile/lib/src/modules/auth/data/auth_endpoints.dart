class AuthEndpoints {
  static const login = '/auth/login';

  // Registro público (multipart/form-data)
  static const register = '/usuarios/public';

  // Recuperación & verificación
  static const recoverRequest = '/usuarios/recuperar-contrasena';
  static const verifyCode     = '/usuarios/verificar-codigo';
  static const changePassword = '/usuarios/cambiar-contrasena';
}
