class AuthTokens {
  final String accessToken;
  AuthTokens(this.accessToken);

  factory AuthTokens.fromJson(Map<String, dynamic> j) =>
      AuthTokens((j['accessToken'] ?? j['token'] ?? '').toString());
}
