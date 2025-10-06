// lib/src/shared/utils/mask_email.dart
String maskEmail(String email) {
  final parts = email.split('@');
  if (parts.length != 2) return email;

  final name = parts[0];
  final domain = parts[1];

  if (name.isEmpty) return email;
  if (name.length <= 2) return '${name[0]}*@$domain';

  final masked = name[0] + '*' * (name.length - 2) + name[name.length - 1];
  return '$masked@$domain';
}
