import 'package:dio/dio.dart';
import '../../../core/network/dio_client.dart';
import 'auth_endpoints.dart';

class AuthApi {
  final Dio _dio;
  AuthApi(DioClient client) : _dio = client.dio;

  // LOGIN
  Future<Response> login(String email, String password) => _dio.post(
        AuthEndpoints.login,
        data: {"correo_usuario": email, "contrasena_usuario": password},
      );

  // REGISTRO (multipart)
  Future<Response> register(Map<String, dynamic> body) {
    final form = FormData.fromMap(body);
    return _dio.post(AuthEndpoints.register, data: form);
  }

  // RECUPERAR: enviar código al correo
  Future<Response> recoverRequest(String correo) =>
      _dio.post(AuthEndpoints.recoverRequest, data: {"correo_usuario": correo});

  // VERIFICAR código
  Future<Response> verifyCode(String correo, String codigo) =>
      _dio.post(AuthEndpoints.verifyCode, data: {
        "correo_usuario": correo,
        "codigo_recuperacion": codigo,
      });

  // CAMBIAR contraseña con código
  Future<Response> changePassword(String correo, String codigo, String nueva) =>
      _dio.post(AuthEndpoints.changePassword, data: {
        "correo_usuario": correo,
        "codigo_recuperacion": codigo,
        "contrasena_usuario": nueva,
      });
}
