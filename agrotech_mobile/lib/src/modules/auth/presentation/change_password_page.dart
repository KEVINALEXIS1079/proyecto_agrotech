import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../shared/widgets/ag_widgets.dart'; // 👈 AgButton
import '../../../shared/utils/mask_email.dart';
import 'providers.dart';
import 'recovery_state.dart';
import 'package:go_router/go_router.dart';

class ChangePasswordPage extends ConsumerStatefulWidget {
  const ChangePasswordPage({super.key});
  @override
  ConsumerState<ChangePasswordPage> createState() => _ChangePasswordPageState();
}

class _ChangePasswordPageState extends ConsumerState<ChangePasswordPage> {
  final _f = GlobalKey<FormState>();
  final _pw1 = TextEditingController();
  final _pw2 = TextEditingController();
  bool showPw1 = false;
  bool showPw2 = false;
  bool loading = false;
  String msg = '';

  @override
  void dispose() {
    _pw1.dispose();
    _pw2.dispose();
    super.dispose();
  }

  Future<void> _change() async {
    if (!(_f.currentState?.validate() ?? false)) return;

    final rec = ref.read(recoveryProvider);
    if (!rec.isReady) {
      setState(() => msg = 'Falta información de verificación. Vuelve a solicitar el código.');
      return;
    }

    setState(() { loading = true; msg = ''; });
    try {
      await ref.read(authRepoProvider).changePassword(
        correo: rec.email,
        codigo: rec.code,
        nueva: _pw1.text.trim(),
      );
      // Limpiar estado y volver a login
      ref.read(recoveryProvider.notifier).clear();
      if (mounted) context.replace('/login');
    } catch (_) {
      setState(() => msg = 'No se pudo cambiar la contraseña.');
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final rec = ref.watch(recoveryProvider);

    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Fondo
          Image.asset(
            'assets/image/FondoLogin.jpeg',
            fit: BoxFit.cover,
          ),
          // Overlay para contraste
          Container(color: Colors.black.withOpacity(0.50)),

          // Tarjeta centrada
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
                          Text(
                            'Actualizar contraseña',
                            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                  fontWeight: FontWeight.w700,
                                ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 6),
                          Text(
                            'Ingresa y confirma tu nueva contraseña para continuar gestionando tus cultivos de manera segura.',
                            style: Theme.of(context).textTheme.bodyMedium,
                            textAlign: TextAlign.center,
                          ),

                          if (rec.email.isNotEmpty) ...[
                            const SizedBox(height: 10),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.email_outlined, size: 18),
                                const SizedBox(width: 6),
                                Text(maskEmail(rec.email)),
                              ],
                            ),
                          ],

                          const SizedBox(height: 14),

                          // Nueva contraseña
                          TextFormField(
                            controller: _pw1,
                            obscureText: !showPw1,
                            validator: (v) =>
                                (v == null || v.length < 6) ? 'Mínimo 6 caracteres' : null,
                            decoration: InputDecoration(
                              labelText: 'Nueva contraseña',
                              border: const OutlineInputBorder(),
                              focusedBorder: const OutlineInputBorder(),
                              suffixIcon: IconButton(
                                icon: Icon(showPw1 ? Icons.visibility_off : Icons.visibility),
                                onPressed: () => setState(() => showPw1 = !showPw1),
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),

                          // Confirmar contraseña
                          TextFormField(
                            controller: _pw2,
                            obscureText: !showPw2,
                            validator: (v) =>
                                (v == null || v != _pw1.text) ? 'Las contraseñas no coinciden' : null,
                            decoration: InputDecoration(
                              labelText: 'Confirmar contraseña',
                              border: const OutlineInputBorder(),
                              focusedBorder: const OutlineInputBorder(),
                              suffixIcon: IconButton(
                                icon: Icon(showPw2 ? Icons.visibility_off : Icons.visibility),
                                onPressed: () => setState(() => showPw2 = !showPw2),
                              ),
                            ),
                          ),

                          const SizedBox(height: 16),

                          // Botón grande y consistente con el resto (≈52 px)
                          SizedBox(
                            height: 52,
                            child: AgButton(
                              text: 'Guardar',
                              onPressed: loading ? null : _change,
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
