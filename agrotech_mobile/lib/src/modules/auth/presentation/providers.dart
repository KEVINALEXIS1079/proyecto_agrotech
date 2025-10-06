import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/dio_client.dart';
import '../data/auth_api.dart';
import '../data/auth_repo_impl.dart';
import '../domain/repo.dart';

final dioProvider = Provider<DioClient>((ref) => DioClient());

final authRepoProvider = Provider<AuthRepo>((ref) {
  final dio = ref.watch(dioProvider);
  return AuthRepoImpl(AuthApi(dio));
});
