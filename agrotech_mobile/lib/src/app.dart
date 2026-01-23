import 'package:flutter/material.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';

class AgroTechApp extends StatelessWidget {
  const AgroTechApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'AgroTech',
      debugShowCheckedModeBanner: false,
      // Tus temas
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      // Fuerza modo claro para evitar que el fondo/colores cambien con el sistema
      themeMode: ThemeMode.light,
      // GoRouter
      routerConfig: appRouter,
    );
  }
}
