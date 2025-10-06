import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../shared/widgets/ag_widgets.dart';
import 'providers.dart';
import 'recovery_state.dart';
import 'package:go_router/go_router.dart';

class VerifyEmailRequestPage extends ConsumerStatefulWidget {
  const VerifyEmailRequestPage({super.key});
  @override
  ConsumerState<VerifyEmailRequestPage> createState() => _VerifyEmailRequestPageState();
}

class _VerifyEmailRequestPageState extends ConsumerState<VerifyEmailRequestPage> {
  final _f = GlobalKey<FormState>();
  String correo = '';
  bool loading = false;
  String msg = '';

  Future<void> _send() async {
    if (!(_f.currentState?.validate() ?? false)) return;
    _f.currentState!.save();
    setState(() { loading = true; msg = ''; });

    try {
      await ref.read(authRepoProvider).recoverRequest(correo);
      ref.read(recoveryProvider.notifier).setEmail(correo);
      if (mounted) {
        context.push('/verify-email-code', extra: {'correo': correo});
      }
    } catch (_) {
      setState(() => msg = 'No se pudo enviar el código.');
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          Image.asset(
            'assets/image/FondoLogin.jpeg',
            fit: BoxFit.cover,
          ),
          Container(color: Colors.black.withOpacity(0.50)),
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 520),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.08),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    padding: const EdgeInsets.fromLTRB(20, 22, 20, 16),
                    child: Form(
                      key: _f,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          const AuthHeader(
                            title: 'Recupera tu acceso',
                            subtitle: 'Escribe tu correo y te enviaremos un código para restablecer tu contraseña.',
                          ),
                          AgInput(
                            label: 'Correo electrónico',
                            keyboardType: TextInputType.emailAddress,
                            validator: (v) {
                              final t = v?.trim() ?? '';
                              if (t.isEmpty) return 'El correo es requerido';
                              if (!t.contains('@')) return 'Correo inválido';
                              return null;
                            },
                            onSaved: (v) => correo = v!.trim(),
                          ),

                          const SizedBox(height: 16),
                          // Botón grande (≈52 px), usando _send
                          SizedBox(
                            height: 52,
                            child: AgButton(
                              text: 'Verificar',
                              onPressed: _send,
                              loading: loading,
                            ),
                          ),

                          if (msg.isNotEmpty) ...[
                            const SizedBox(height: 8),
                            Text(
                              msg,
                              textAlign: TextAlign.center,
                              style: const TextStyle(color: Colors.red),
                            ),
                          ],
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
