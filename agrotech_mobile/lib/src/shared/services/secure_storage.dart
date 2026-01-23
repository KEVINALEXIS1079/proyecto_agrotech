import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class Secure {
  static final _s = const FlutterSecureStorage();
  static final store = Secure();

  Future<void> saveToken(String token, {String key = 'token'}) =>
      _s.write(key: key, value: token);

  Future<String?> readToken({String key = 'token'}) =>
      _s.read(key: key);

  Future<void> clearToken({String key = 'token'}) =>
      _s.delete(key: key);
}
