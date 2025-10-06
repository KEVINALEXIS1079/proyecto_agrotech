import '../domain/repo.dart';
import 'auth_api.dart';
import '../../../shared/services/secure_storage.dart';
import '../domain/entities.dart';
import 'package:dio/dio.dart';

class AuthRepoImpl implements AuthRepo {
  final AuthApi api;
  AuthRepoImpl(this.api);

  @override
  Future<void> login(String email, String password) async {
    final res = await api.login(email, password);
    final data = res.data as Map<String, dynamic>;
    final tokens = AuthTokens.fromJson(data);
    await Secure.store.saveToken(tokens.accessToken); // guarda JWT
  }

  @override
  Future<void> register(Map<String, dynamic> data) async {
    await api.register(data);
  }

  @override
  Future<void> recoverRequest(String correo) => api.recoverRequest(correo).then((_) {});

  @override
  Future<void> verifyCode(String correo, String codigo) => api.verifyCode(correo, codigo).then((_) {});

  @override
  Future<void> changePassword({required String correo, required String codigo, required String nueva}) =>
      api.changePassword(correo, codigo, nueva).then((_) {});
}
