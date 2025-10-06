import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../shared/widgets/ag_widgets.dart'; // AgButton
import '../../../shared/utils/mask_email.dart';
import 'providers.dart';
import 'recovery_state.dart';
import 'package:go_router/go_router.dart';

class VerifyEmailCodePage extends ConsumerStatefulWidget {
  final String? correo;
  const VerifyEmailCodePage({super.key, this.correo});
  @override
  ConsumerState<VerifyEmailCodePage> createState() => _VerifyEmailCodePageState();
}

class _VerifyEmailCodePageState extends ConsumerState<VerifyEmailCodePage> {
  late String correo; // solo para mostrar
  bool loading = false;
  String msg = '';

  // 6 casillas para OTP
  final _nodes = List.generate(6, (_) => FocusNode());
  final _ctls  = List.generate(6, (_) => TextEditingController());

  @override
  void initState() {
    super.initState();
    // Solo leemos; NO mutamos provider aquí
    final saved = ref.read(recoveryProvider).email;
    correo = widget.correo ?? saved;
  }

  @override
  void dispose() {
    for (final n in _nodes) { n.dispose(); }
    for (final c in _ctls)  { c.dispose(); }
    super.dispose();
  }

  void _fillFromPaste(String text, int startIndex) {
    final digits = text.replaceAll(RegExp(r'\D'), ''); // solo números
    if (digits.isEmpty) return;
    var idx = startIndex;
    for (final ch in digits.characters) {
      if (idx > 5) break;
      _ctls[idx].text = ch;
      idx++;
    }
    // mover foco al siguiente vacío o al último
    final nextEmpty = _ctls.indexWhere((c) => c.text.isEmpty);
    if (nextEmpty == -1) {
      _nodes.last.requestFocus();
    } else {
      _nodes[nextEmpty].requestFocus();
    }
    setState(() {});
  }

  void _onDigitChanged(int i, String v) {
    if (v.length > 1) {
      // se pegó más de un carácter en esta casilla
      _fillFromPaste(v, i);
      return;
    }
    if (v.length == 1 && i < 5) {
      _nodes[i + 1].requestFocus();
    }
    if (v.isEmpty && i > 0) {
      _nodes[i - 1].requestFocus();
    }
    setState(() {}); // para refrescar estado de botón si quieres
  }

  String get _code => _ctls.map((c) => c.text).join();

  Future<void> _verify() async {
    final code = _code;
    if (code.length != 6) {
      setState(() => msg = 'Ingresa los 6 dígitos.');
      return;
    }

    setState(() { loading = true; msg = ''; });
    try {
      await ref.read(authRepoProvider).verifyCode(correo, code);

      // ESCRITURAS al provider en callback (válido)
      final rec = ref.read(recoveryProvider.notifier);
      rec.setEmail(correo);
      rec.setCode(code);

      if (mounted) context.go('/change-password'); // sin extras
    } catch (_) {
      setState(() => msg = 'Código inválido.');
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Fondo
          Image.asset('assets/image/FondoLogin.jpeg', fit: BoxFit.cover),
          // Overlay sutil
          Container(color: Colors.black.withOpacity(0.50)),

          // Tarjeta (glass/white)
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 520),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(24),
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.white, // blanco para máxima legibilidad
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
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            // Header
                            Text(
                              'Código de verificación',
                              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                    fontWeight: FontWeight.w700,
                                  ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 6),
                            Text(
                              'Ingresa el código que te enviamos al correo para continuar.',
                              style: Theme.of(context).textTheme.bodyMedium,
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 10),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.email_outlined, size: 18),
                                const SizedBox(width: 6),
                                Text(maskEmail(correo)),
                              ],
                            ),

                            const SizedBox(height: 18),

                            // OTP 6 dígitos
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: List.generate(6, (i) {
                                return _OtpBox(
                                  controller: _ctls[i],
                                  focusNode: _nodes[i],
                                  onChanged: (v) => _onDigitChanged(i, v),
                                );
                              }),
                            ),

                            const SizedBox(height: 16),

                            // 🔹 Botón grande (≈52 px) con AgButton
                            SizedBox(
                              height: 52,
                              child: AgButton(
                                text: 'Verificar',
                                onPressed: loading ? null : _verify,
                                loading: loading,
                              ),
                            ),

                            if (msg.isNotEmpty) ...[
                              const SizedBox(height: 8),
                              Text(msg, textAlign: TextAlign.center, style: const TextStyle(color: Colors.red)),
                            ],

                            const SizedBox(height: 8),
                            TextButton(
                              onPressed: loading
                                  ? null
                                  : () {
                                      // Aquí podrías re-enviar el código
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        const SnackBar(content: Text('Si no te llegó, revisa SPAM o reintenta.')),
                                      );
                                    },
                              child: const Text('Reenviar código'),
                            ),
                          ],
                        ),
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

// Widget caja individual del OTP
class _OtpBox extends StatelessWidget {
  final TextEditingController controller;
  final FocusNode focusNode;
  final ValueChanged<String> onChanged;
  const _OtpBox({
    required this.controller,
    required this.focusNode,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return SizedBox(
      width: 48,
      child: TextField(
        controller: controller,
        focusNode: focusNode,
        textAlign: TextAlign.center,
        style: Theme.of(context).textTheme.titleLarge,
        keyboardType: TextInputType.number,
        autofillHints: const [AutofillHints.oneTimeCode],
        inputFormatters: <TextInputFormatter>[
          LengthLimitingTextInputFormatter(1),
          FilteringTextInputFormatter.digitsOnly,
        ],
        decoration: InputDecoration(
          isDense: true,
          contentPadding: const EdgeInsets.symmetric(vertical: 12),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: scheme.primary, width: 2),
          ),
        ),
        onChanged: onChanged,
      ),
    );
  }
}
