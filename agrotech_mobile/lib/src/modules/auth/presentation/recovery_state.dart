// lib/src/modules/auth/presentation/recovery_state.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

class RecoveryState {
  final String email;
  final String code;
  const RecoveryState({this.email = '', this.code = ''});

  RecoveryState copyWith({String? email, String? code}) =>
      RecoveryState(email: email ?? this.email, code: code ?? this.code);

  bool get isReady => email.isNotEmpty && code.isNotEmpty;
}

class RecoveryController extends Notifier<RecoveryState> {
  @override
  RecoveryState build() => const RecoveryState();

  void setEmail(String email) =>
      state = state.copyWith(email: email);

  void setCode(String code) =>
      state = state.copyWith(code: code);

  void clear() => state = const RecoveryState();
}

// Provider con Notifier (v3)
final recoveryProvider =
    NotifierProvider<RecoveryController, RecoveryState>(() {
  return RecoveryController();
});
