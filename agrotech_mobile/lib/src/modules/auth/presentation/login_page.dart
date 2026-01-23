import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../shared/widgets/ag_widgets.dart';
import 'providers.dart';
import 'package:go_router/go_router.dart';

class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});
  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  final _f = GlobalKey<FormState>();
  String email = '', pw = '';
  bool loading = false;
  String error = '';

  Future<void> _onSubmit() async {
    if (!(_f.currentState?.validate() ?? false)) return;
    _f.currentState!.save();
    setState(() { loading = true; error = ''; });
    try {
      await ref.read(authRepoProvider).login(email, pw);
      if (mounted) context.replace('/home');
    } catch (_) {
      setState(() => error = 'Credenciales inválidas o error de red.');
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold( // usamos Scaffold base para poder apilar el fondo
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Fondo con imagen
          Image.asset(
            'assets/image/FondoLogin.jpeg', // <-- tu imagen
            fit: BoxFit.cover,
          ),
          // Overlay sutil para contraste
          Container(color: Colors.black.withOpacity(0.50)),

          // Contenido
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 520),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white, // tarjeta blanca
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.08),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        )
                      ],
                    ),
                    padding: const EdgeInsets.fromLTRB(20, 22, 20, 16),
                    child: Form(
                      key: _f,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          const AuthHeader(
                            title: 'Inicia sesión',
                            subtitle: 'Conéctate de nuevo con tus cultivos',
                          ),
                          AgInput(
                            label: 'Correo',
                            keyboardType: TextInputType.emailAddress,
                            onSaved: (v) => email = v!.trim(),
                          ),
                          const SizedBox(height: 12),
                          AgInput(
                            label: 'Contraseña',
                            obscure: true,
                            onSaved: (v) => pw = v!.trim(),
                          ),

                          if (error.isNotEmpty) ...[
                            const SizedBox(height: 10),
                            Text(
                              error,
                              textAlign: TextAlign.center,
                              style: const TextStyle(color: Colors.red),
                            ),
                          ],

                          const SizedBox(height: 16),
                          // Botón más grande (≈52 px)
                          SizedBox(
                            height: 52,
                            child: AgButton(
                              text: 'Entrar',
                              onPressed: _onSubmit,
                              loading: loading,
                            ),
                          ),

                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              AgLinkButton(
                                text: 'Registrar',
                                onTap: () => context.push('/register'),
                              ),
                              AgLinkButton(
                                text: '¿Olvidaste tu contraseña?',
                                onTap: () => context.push('/recover'),
                              ),
                            ],
                          ),
                        ],
                      ),
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
