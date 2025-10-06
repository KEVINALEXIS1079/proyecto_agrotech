import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import '../../../shared/widgets/ag_widgets.dart';
import 'providers.dart';
import 'package:dio/dio.dart';
import 'package:go_router/go_router.dart';

class RegisterPage extends ConsumerStatefulWidget {
  const RegisterPage({super.key});
  @override
  ConsumerState<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends ConsumerState<RegisterPage> {
  final _f = GlobalKey<FormState>();
  String cedula = '', nombre = '', apellido = '', telefono = '', correo = '', pw = '', estado = 'activo';
  File? img;
  bool loading = false;
  String msg = '';

  Future<void> _pickImage() async {
    final picked = await ImagePicker().pickImage(source: ImageSource.gallery);
    if (picked != null) setState(() => img = File(picked.path));
  }

  Future<void> _onSubmit() async {
    if (!(_f.currentState?.validate() ?? false)) return;
    _f.currentState!.save();
    setState(() { loading = true; msg = ''; });
    try {
      final body = {
        "cedula_usuario": cedula,
        "nombre_usuario": nombre,
        "apellido_usuario": apellido,
        "telefono_usuario": telefono,
        "correo_usuario": correo,
        "contrasena_usuario": pw,
        "estado_usuario": estado,
        if (img != null) "img_usuario": await MultipartFile.fromFile(img!.path),
      };
      await ref.read(authRepoProvider).register(body);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Registro exitoso. Revisa tu correo.')),
        );
        context.replace('/login');
      }
    } catch (_) {
      setState(() => msg = 'No se pudo registrar el usuario.');
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand, // fondo a pantalla completa
        children: [
          // Fondo
          Image.asset(
            'assets/image/FondoLogin.jpeg', // cambia a tu imagen si quieres
            fit: BoxFit.cover,
          ),
          // Overlay para contraste
          Container(color: Colors.black.withOpacity(0.50)),

          // Tarjeta
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
                            title: 'Registro',
                            subtitle: 'Empieza a gestionar tus cultivos',
                          ),
                          AgInput(
                            label: 'Número de documento',
                            keyboardType: TextInputType.number,
                            onSaved: (v) => cedula = v!.trim(),
                          ),
                          const SizedBox(height: 12),
                          AgInput(label: 'Nombre', onSaved: (v) => nombre = v!.trim()),
                          const SizedBox(height: 12),
                          AgInput(label: 'Apellido', onSaved: (v) => apellido = v!.trim()),
                          const SizedBox(height: 12),
                          AgInput(
                            label: 'Correo electrónico',
                            keyboardType: TextInputType.emailAddress,
                            onSaved: (v) => correo = v!.trim(),
                          ),
                          const SizedBox(height: 12),
                          AgInput(
                            label: 'Teléfono',
                            keyboardType: TextInputType.phone,
                            onSaved: (v) => telefono = v!.trim(),
                          ),
                          const SizedBox(height: 12),
                          AgInput(
                            label: 'Contraseña',
                            obscure: true,
                            onSaved: (v) => pw = v!.trim(),
                          ),
                          const SizedBox(height: 12),

                          // Botón subir foto + nombre de archivo
                          Row(
                            children: [
                              Flexible(
                                fit: FlexFit.loose,
                                child: ElevatedButton.icon(
                                  style: ElevatedButton.styleFrom(
                                    minimumSize: const Size(0, 48), // evita ancho infinito en Row
                                    padding: const EdgeInsets.symmetric(horizontal: 12),
                                  ),
                                  onPressed: _pickImage,
                                  icon: const Icon(Icons.upload),
                                  label: const Text('Foto de perfil (opcional)'),
                                ),
                              ),
                              const SizedBox(width: 12),
                              if (img != null)
                                Expanded(
                                  child: Text(
                                    img!.path.split(Platform.pathSeparator).last,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                            ],
                          ),

                          const SizedBox(height: 20),
                          // Botón un poquito más grande
                          SizedBox(
                            height: 52,
                            child: AgButton(
                              text: 'Registrarse',
                              onPressed: _onSubmit,
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
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Text('¿Ya tienes cuenta? '),
                              TextButton(
                                onPressed: () => context.replace('/login'),
                                child: const Text('Inicia sesión'),
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
