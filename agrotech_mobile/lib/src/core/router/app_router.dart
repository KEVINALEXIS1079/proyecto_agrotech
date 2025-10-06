import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';

import '../../modules/auth/presentation/login_page.dart';
import '../../modules/auth/presentation/register_page.dart';
import '../../modules/auth/presentation/verify_email_request_page.dart';
import '../../modules/auth/presentation/verify_email_code_page.dart';
import '../../modules/auth/presentation/change_password_page.dart';


import '../../modules/start.dart';

final appRouter = GoRouter(
  initialLocation: '/start', 
  routes: [
    GoRoute(
      path: '/start',
      builder: (_, __) => const StartPage(),
    ),

    GoRoute(
      path: '/login',
      builder: (_, __) => const LoginPage(),
    ),
    GoRoute(
      path: '/register',
      builder: (_, __) => const RegisterPage(),
    ),
    GoRoute(
      path: '/recover',
      builder: (_, __) => const VerifyEmailRequestPage(),
    ),
    GoRoute(
      path: '/verify-email',
      builder: (_, __) => const VerifyEmailRequestPage(),
    ),
    GoRoute(
      path: '/verify-email-code',
      builder: (context, state) {
        final correo = (state.extra as Map?)?['correo'] as String?;
        return VerifyEmailCodePage(correo: correo);
      },
    ),
    GoRoute(
      path: '/change-password',
      builder: (context, state) => const ChangePasswordPage(),
    ),
    GoRoute(
      path: '/home',
      builder: (_, __) => const _Home(),
    ),
  ],
);

class _Home extends StatelessWidget {
  const _Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home')),
      body: Center(
        child: ElevatedButton(
          onPressed: () => context.replace('/login'),
          child: const Text('Cerrar sesión (demo)'),
        ),
      ),
    );
  }
}
