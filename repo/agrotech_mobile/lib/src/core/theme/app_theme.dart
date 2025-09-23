import 'package:flutter/material.dart';

class AppTheme {
  static const Color primary = Color(0xFF16A34A);
  static const Color surface = Color(0xFFF7F8FA);

  /// Tema claro de la aplicación
  static ThemeData get light {
    final base = ThemeData(useMaterial3: true, colorSchemeSeed: primary);
    return base.copyWith(
      scaffoldBackgroundColor: const Color.fromARGB(255, 255, 255, 255),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        border: _border(),
        enabledBorder: _border(),
        focusedBorder: _border(color: primary),
        errorBorder: _border(color: Colors.red),
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
  style: ElevatedButton.styleFrom(
    backgroundColor: primary, // Verde sólido
    foregroundColor: Colors.white,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    minimumSize: const Size(double.infinity, 48),
    textStyle: const TextStyle(fontWeight: FontWeight.bold),
  ),
),
      cardTheme: CardThemeData(
        color: const Color.fromARGB(255, 0, 132, 66).withOpacity(.9),
        elevation: 8,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        shadowColor: Colors.black12,
        margin: const EdgeInsets.all(0),
      ),
    );
  }

  /// Tema oscuro de la aplicación
  static ThemeData get dark {
    final base = ThemeData(
      useMaterial3: true,
      colorSchemeSeed: primary,
      brightness: Brightness.dark,
    );
    return base.copyWith(
      scaffoldBackgroundColor: const Color(0xFF181A20), // Fondo oscuro personalizado
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white.withOpacity(0.06),
        border: _borderDark(),
        enabledBorder: _borderDark(),
        focusedBorder: _borderDark(color: primary),
        errorBorder: _borderDark(color: Colors.red),
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      ),
      cardTheme: CardThemeData(
        color: Colors.white.withOpacity(.08),
        elevation: 10,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        shadowColor: Colors.black26,
      ),
    );
  }

  static OutlineInputBorder _border({Color color = const Color(0xFFE5E7EB)}) =>
      OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: BorderSide(color: color, width: 1),
      );

  static OutlineInputBorder _borderDark({Color color = const Color(0x22FFFFFF)}) =>
      OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: BorderSide(color: color, width: 1),
      );
}