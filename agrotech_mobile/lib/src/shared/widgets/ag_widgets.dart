import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class AgScaffold extends StatelessWidget {
  final Widget child;
  final String? title;
  final List<Widget>? actions;
  const AgScaffold({super.key, required this.child, this.title, this.actions});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFFEFFAF3), Color(0xFFF8FAFF)],
          begin: Alignment.topLeft, end: Alignment.bottomRight),
      ),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: title == null ? null : AppBar(title: Text(title!), actions: actions),
        body: Center(child: child),
      ),
    );
  }
}

class AgCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final double maxWidth;
  const AgCard({super.key, required this.child, this.padding = const EdgeInsets.all(18), this.maxWidth = 520});

  @override
  Widget build(BuildContext context) {
    return ConstrainedBox(
      constraints: BoxConstraints(maxWidth: maxWidth),
      child: Card(child: Padding(padding: padding, child: child)),
    );
  }
}

class AgInput extends StatelessWidget {
  final String label;
  final TextEditingController? controller;
  final bool obscure;
  final TextInputType? keyboardType;
  final String? initialValue;
  final String? Function(String?)? validator;
  final void Function(String?)? onSaved;

  const AgInput({
    super.key,
    required this.label,
    this.controller,
    this.obscure = false,
    this.keyboardType,
    this.initialValue,
    this.validator,
    this.onSaved,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      initialValue: controller == null ? initialValue : null,
      obscureText: obscure,
      keyboardType: keyboardType,
      validator: validator ?? (v) => (v == null || v.isEmpty) ? 'Requerido' : null,
      onSaved: onSaved,
      decoration: InputDecoration(labelText: label),
    );
  }
}

class AgButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool loading;
  const AgButton({super.key, required this.text, required this.onPressed, this.loading = false});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: loading ? null : onPressed,
        child: loading
            ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2))
            : Text(text),
      ),
    );
  }
}

class AgLinkButton extends StatelessWidget {
  final String text;
  final VoidCallback onTap;
  const AgLinkButton({super.key, required this.text, required this.onTap});
  @override
  Widget build(BuildContext context) {
    return TextButton(onPressed: onTap, child: Text(text, style: const TextStyle(color: AppTheme.primary)));
  }
}
class AgAuthShell extends StatelessWidget {
  final String title;
  final String? subtitle;
  final Widget child;
  final String? heroImage;     // ej: 'assets/image/FondoLogin.jpeg'
  final String? logoImage;     // ej: 'assets/image/LogoTic.png'
  final IconData? leadingIcon; // ej: Icons.arrow_back_ios_new_rounded
  final VoidCallback? onLeadingTap;

  const AgAuthShell({
    super.key,
    required this.title,
    required this.child,
    this.subtitle,
    this.heroImage,
    this.logoImage,
    this.leadingIcon,
    this.onLeadingTap,
  });

  @override
  Widget build(BuildContext context) {
    final isWide = MediaQuery.of(context).size.width >= 900;

    final left = heroImage == null
        ? const SizedBox.shrink()
        : Stack(
            fit: StackFit.expand,
            children: [
              Image.asset(heroImage!, fit: BoxFit.cover),
              Container(color: Colors.black.withOpacity(0.35)),
              Padding(
                padding: const EdgeInsets.all(24),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: DefaultTextStyle(
                    style: const TextStyle(color: Colors.white),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Bienvenido', style: Theme.of(context).textTheme.displaySmall?.copyWith(
                          color: Colors.white, fontWeight: FontWeight.w800)),
                        const SizedBox(height: 8),
                        Text(subtitle ?? 'Conéctate de nuevo con tus cultivos',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(color: Colors.white70)),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          );

    final right = Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 520),
        child: AgCard(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (leadingIcon != null)
                Align(
                  alignment: Alignment.centerLeft,
                  child: IconButton(
                    icon: Icon(leadingIcon, size: 18),
                    onPressed: onLeadingTap,
                  ),
                ),
              if (logoImage != null) ...[
                Image.asset(logoImage!, height: 54),
                const SizedBox(height: 12),
              ],
              Text(title, style: Theme.of(context).textTheme.headlineSmall),
              const SizedBox(height: 16),
              child,
            ],
          ),
        ),
      ),
    );

    if (isWide) {
      return Row(
        children: [
          Expanded(flex: 5, child: left),
          const VerticalDivider(width: 1),
          Expanded(flex: 5, child: right),
        ],
      );
    }
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        SizedBox(height: 220, child: left),
        const SizedBox(height: 16),
        right,
      ],
    );
  }
}

class AuthHeader extends StatelessWidget {
  final String title;
  final String? subtitle; // texto pequeño informativo
  final EdgeInsetsGeometry padding;
  const AuthHeader({
    super.key,
    required this.title,
    this.subtitle,
    this.padding = const EdgeInsets.only(bottom: 16),
  });

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;
    return Padding(
      padding: padding,
      child: Column(
        children: [
          Image.asset('assets/image/LogoTic.png', height: 68),
          const SizedBox(height: 12),
          Text(title, style: t.headlineSmall?.copyWith(fontWeight: FontWeight.w700)),
          if (subtitle != null && subtitle!.isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(
              subtitle!,
              textAlign: TextAlign.center,
              style: t.bodyMedium?.copyWith(color: Colors.black54),
            ),
          ],
        ],
      ),
    );
  }
}

