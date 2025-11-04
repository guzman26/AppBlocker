import 'package:flutter/cupertino.dart';

class BlockSession {
  const BlockSession({
    required this.name,
    required this.description,
    required this.timeRange,
    required this.progress,
    required this.isActive,
    required this.accentColor,
  });

  final String name;
  final String description;
  final String timeRange;
  final double progress;
  final bool isActive;
  final Color accentColor;
}
