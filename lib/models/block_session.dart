import 'package:flutter/cupertino.dart';

class BlockSession {
  const BlockSession({
    required this.name,
    required this.description,
    required this.timeRange,
    required this.progress,
    required this.isActive,
    required this.accentColor,
    required this.focusLevel,
    required this.blockedApps,
    required this.automationNotes,
    required this.overrideAttempts,
  });

  final String name;
  final String description;
  final String timeRange;
  final double progress;
  final bool isActive;
  final Color accentColor;
  final String focusLevel;
  final List<String> blockedApps;
  final List<String> automationNotes;
  final int overrideAttempts;
}
