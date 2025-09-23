// lib/src/modules/start.dart
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// >>> Cambia este valor al HEX exacto de tu verde de marca (segunda imagen).
const kBrandGreen = Color(0xFF16A34A);

Color _darken(Color c, [double amount = .10]) {
  final hsl = HSLColor.fromColor(c);
  final adj = hsl.withLightness((hsl.lightness - amount).clamp(0.0, 1.0));
  return adj.toColor();
}

class StartPage extends StatefulWidget {
  const StartPage({super.key});
  @override
  State<StartPage> createState() => _StartPageState();
}

class _StartPageState extends State<StartPage> {
  final _featuresKey = GlobalKey();
  final _scrollController = ScrollController();

  Future<void> _scrollToFeatures() async {
    final ctx = _featuresKey.currentContext;
    if (ctx != null) {
      await Scrollable.ensureVisible(
        ctx,
        duration: const Duration(milliseconds: 500),
        curve: Curves.easeInOut,
        alignment: 0.05,
      );
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.sizeOf(context);
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: Colors.white,
      body: CustomScrollView(
        controller: _scrollController,
        slivers: [
          // HEADER
          SliverToBoxAdapter(
            child: SafeArea(
              bottom: false,
              child: Container(
                height: 56,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.85),
                  border: const Border(
                    bottom: BorderSide(color: Color(0xFFE5E7EB)),
                  ),
                ),
                child: Row(
                  children: [
                    Row(
                      children: [
                        Image.asset('assets/image/LogoTic.png', height: 32, fit: BoxFit.contain),
                        const SizedBox(width: 8),
                        Text(
                          'AgroTech',
                          style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                    const Spacer(),
                    TextButton(
                      onPressed: () => context.go('/login'),
                      style: TextButton.styleFrom(
                        foregroundColor: Colors.white,
                        backgroundColor: kBrandGreen,
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        shape: const StadiumBorder(),
                      ),
                      child: const Text('Iniciar sesión'),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // HERO
          SliverToBoxAdapter(
            child: SizedBox(
              height: max(420, size.height * 0.68),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  Image.asset('assets/image/FondoLogin.jpeg', fit: BoxFit.cover),
                  // Radial overlay
                  Container(
                    decoration: const BoxDecoration(
                      gradient: RadialGradient(
                        center: Alignment(0, -0.2),
                        radius: 1.2,
                        colors: [
                          Color.fromARGB(170, 0, 0, 0),
                          Color.fromARGB(220, 0, 0, 0),
                        ],
                      ),
                    ),
                  ),
                  // Linear overlay
                  Container(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Color(0x26000000), Color(0x00000000), Color(0x66000000)],
                      ),
                    ),
                  ),
                  // Contenido
                  Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: ConstrainedBox(
                        constraints: const BoxConstraints(maxWidth: 560),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(999),
                                border: Border.all(color: Colors.white.withOpacity(0.2)),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    width: 6, height: 6,
                                    decoration: const BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: kBrandGreen, // punto verde
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  const Text(
                                    'Plataforma para productores y empresas',
                                    style: TextStyle(color: Colors.white, fontSize: 11),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 14),
                            Text(
                              'Gestiona tus Cultivos\ncon Inteligencia',
                              textAlign: TextAlign.center,
                              style: theme.textTheme.displaySmall?.copyWith(
                                color: Colors.white,
                                fontWeight: FontWeight.w800,
                                height: 1.1,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Text(
                              'Optimiza, planifica y analiza cada etapa de tu producción.',
                              textAlign: TextAlign.center,
                              style: theme.textTheme.bodyMedium?.copyWith(
                                color: Colors.white.withOpacity(0.9),
                              ),
                            ),
                            const SizedBox(height: 18),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                // Comenzar
                                FilledButton(
                                  style: FilledButton.styleFrom(
                                    backgroundColor: Colors.white,
                                    foregroundColor: kBrandGreen,
                                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                                    textStyle: const TextStyle(fontWeight: FontWeight.w600),
                                    shape: const StadiumBorder(),
                                  ),
                                  onPressed: () => context.go('/register'),
                                  child: const Text('Comenzar'),
                                ),
                                const SizedBox(width: 10),
                                // Más info
                                OutlinedButton(
                                  style: OutlinedButton.styleFrom(
                                    side: const BorderSide(color: Colors.white70),
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                    shape: const StadiumBorder(),
                                  ),
                                  onPressed: _scrollToFeatures,
                                  child: const Text('Más info'),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  // decor blobs con verde
                  Positioned(
                    left: -80,
                    top: -80,
                    child: _Blob(size: 160, color: kBrandGreen.withOpacity(0.22)),
                  ),
                  Positioned(
                    right: -80,
                    bottom: -80,
                    child: _Blob(size: 160, color: kBrandGreen.withOpacity(0.28)),
                  ),
                ],
              ),
            ),
          ),

          // CARACTERÍSTICAS
          SliverToBoxAdapter(
            key: _featuresKey,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 560),
                child: Center(
                  child: Column(
                    children: const [
                      _FeatureCard(
                        title: 'Monitoreo inteligente',
                        text: 'Métricas y alertas en tiempo real para la salud de tus cultivos.',
                        icon: Icons.monitor_heart,
                      ),
                      SizedBox(height: 10),
                      _FeatureCard(
                        title: 'Gestión de recursos',
                        text: 'Controla insumos, mano de obra y costos con flujos simples.',
                        icon: Icons.inventory_2_outlined,
                      ),
                      SizedBox(height: 10),
                      _FeatureCard(
                        title: 'Análisis de datos',
                        text: 'Paneles e históricos para decisiones más rápidas.',
                        icon: Icons.insights,
                      ),
                      SizedBox(height: 18),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // ACERCA
          SliverToBoxAdapter(
            child: Container(
              color: const Color(0xFFF9FAFB),
              padding: const EdgeInsets.fromLTRB(16, 18, 16, 18),
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 560),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Acerca de AgroTech',
                        style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Conectamos innovación y sostenibilidad para gestionar tus cultivos con monitoreo, análisis y digitalización.',
                        style: theme.textTheme.bodyMedium?.copyWith(color: Colors.black87),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: const [
                          Expanded(child: _MetricTile(label: 'Ahorro en costos', value: 'hasta 25%')),
                          SizedBox(width: 10),
                          Expanded(child: _MetricTile(label: 'Procesos digitales', value: '+40')),
                        ],
                      ),
                      const SizedBox(height: 12),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          decoration: BoxDecoration(
                            border: Border.all(color: const Color(0xFFE5E7EB)),
                            boxShadow: const [BoxShadow(blurRadius: 8, color: Color(0x11000000))],
                          ),
                          child: AspectRatio(
                            aspectRatio: 4 / 3,
                            child: Image.asset('assets/image/FondoLogin.jpeg', fit: BoxFit.cover),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // CTA FINAL
          SliverToBoxAdapter(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [_darken(kBrandGreen, .08), kBrandGreen],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              padding: const EdgeInsets.fromLTRB(16, 20, 16, 24),
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 560),
                  child: Column(
                    children: [
                      Text(
                        '¿Listo para transformar tu cultivo?',
                        textAlign: TextAlign.center,
                        style: theme.textTheme.titleLarge?.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Empieza hoy a digitalizar tu producción agrícola con AgroTech.',
                        textAlign: TextAlign.center,
                        style: theme.textTheme.bodyMedium?.copyWith(color: Colors.white.withOpacity(0.9)),
                      ),
                      const SizedBox(height: 12),
                      FilledButton(
                        style: FilledButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: kBrandGreen,
                          padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 12),
                          shape: const StadiumBorder(),
                        ),
                        onPressed: () => context.go('/register'),
                        child: const Text('Crear cuenta gratis'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // FOOTER
          SliverToBoxAdapter(
            child: Container(
              height: 52,
              decoration: const BoxDecoration(
                border: Border(top: BorderSide(color: Color(0xFFE5E7EB))),
                color: Colors.white,
              ),
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 560),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Row(
                      children: [
                        Text(
                          '© ${DateTime.now().year} AgroTech',
                          style: theme.textTheme.bodySmall?.copyWith(color: Colors.black54),
                        ),
                        const Spacer(),
                        TextButton(onPressed: _scrollToFeatures, child: const Text('Características')),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/* ====== Widgets auxiliares ====== */

class _FeatureCard extends StatelessWidget {
  final String title;
  final String text;
  final IconData icon;
  const _FeatureCard({required this.title, required this.text, required this.icon});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.92),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE5E7EB)),
        boxShadow: const [BoxShadow(blurRadius: 10, spreadRadius: 0, color: Color(0x11000000))],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 40, width: 40,
            decoration: BoxDecoration(
              color: kBrandGreen.withOpacity(0.12),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: kBrandGreen.withOpacity(0.3)),
            ),
            child: const Icon(Icons.circle, color: kBrandGreen), // el icon real se pinta abajo
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600)),
                const SizedBox(height: 4),
                Text(text, style: theme.textTheme.bodySmall?.copyWith(color: Colors.black87)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _MetricTile extends StatelessWidget {
  final String label;
  final String value;
  const _MetricTile({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: const Color(0xFFE5E7EB)),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        children: [
          Text(label, style: theme.textTheme.bodySmall?.copyWith(color: Colors.black54)),
          const SizedBox(height: 4),
          Text(value, style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w700)),
        ],
      ),
    );
  }
}

class _Blob extends StatelessWidget {
  final double size;
  final Color color;
  const _Blob({required this.size, required this.color});
  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: Container(
        height: size,
        width: size,
        decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(size)),
      ),
    );
  }
}
