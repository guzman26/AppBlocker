import 'package:flutter/cupertino.dart';

class AppUsage {
  const AppUsage({
    required this.name,
    required this.category,
    required this.used,
    required this.limit,
    required this.changePercentage,
    required this.icon,
    required this.tint,
  });

  final String name;
  final String category;
  final Duration used;
  final Duration limit;
  final double changePercentage;
  final IconData icon;
  final Color tint;

  String get formattedUsage => _format(used);
  String get formattedLimit => _format(limit);

  String _format(Duration value) {
    final hours = value.inHours;
    final minutes = value.inMinutes % 60;
    if (hours == 0) {
      return '${minutes} min';
    }
    return '${hours} h ${minutes.toString().padLeft(2, '0')} min';
  }
}
