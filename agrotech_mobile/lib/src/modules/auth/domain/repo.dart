abstract class AuthRepo {
  Future<void> login(String email, String password);
  Future<void> register(Map<String, dynamic> data);

  Future<void> recoverRequest(String correo);
  Future<void> verifyCode(String correo, String codigo);
  Future<void> changePassword({
    required String correo,
    required String codigo,
    required String nueva,
  });
}
