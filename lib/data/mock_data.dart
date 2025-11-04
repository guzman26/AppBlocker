import 'package:flutter/cupertino.dart';

import '../models/app_usage.dart';
import '../models/block_session.dart';
import '../models/insight.dart';
import '../models/profile.dart';
import '../models/schedule.dart';
import '../theme/colors.dart';

class MockData {
  MockData({
    required this.sessions,
    required this.usage,
    required this.schedules,
    required this.insights,
    required this.profile,
  });

  final List<BlockSession> sessions;
  final List<AppUsage> usage;
  final List<Schedule> schedules;
  final List<Insight> insights;
  final Profile profile;

  factory MockData.today() {
    return MockData(
      sessions: const [
        BlockSession(
          name: 'Focus Inteligente',
          description: 'Bloquea redes sociales y notificaciones críticas',
          timeRange: '09:00 - 12:30',
          progress: 0.68,
          isActive: true,
          accentColor: AppColors.accentIndigo,
        ),
        BlockSession(
          name: 'Desconexión Nocturna',
          description: 'Preparación para dormir sin distracciones',
          timeRange: '22:00 - 07:00',
          progress: 0.15,
          isActive: false,
          accentColor: AppColors.accentPink,
        ),
      ],
      usage: const [
        AppUsage(
          name: 'TimeLine',
          category: 'Social',
          used: Duration(hours: 1, minutes: 12),
          limit: Duration(hours: 0, minutes: 45),
          changePercentage: -18,
          icon: CupertinoIcons.bubble_left_bubble_right_fill,
          tint: AppColors.accentTeal,
        ),
        AppUsage(
          name: 'FocusMail',
          category: 'Productividad',
          used: Duration(hours: 0, minutes: 54),
          limit: Duration(hours: 1, minutes: 30),
          changePercentage: 12,
          icon: CupertinoIcons.envelope_fill,
          tint: AppColors.accentIndigo,
        ),
        AppUsage(
          name: 'Mindful',
          category: 'Bienestar',
          used: Duration(hours: 0, minutes: 26),
          limit: Duration(hours: 1),
          changePercentage: -5,
          icon: CupertinoIcons.heart_circle_fill,
          tint: AppColors.accentPink,
        ),
      ],
      schedules: const [
        Schedule(
          name: 'Modo Trabajo',
          days: ['L', 'M', 'X', 'J'],
          timeRange: '08:30 - 17:30',
          isEnabled: true,
        ),
        Schedule(
          name: 'Foco Profundo',
          days: ['L', 'M', 'X', 'J', 'V'],
          timeRange: '11:00 - 13:00',
          isEnabled: true,
        ),
        Schedule(
          name: 'Descanso Digital',
          days: ['S', 'D'],
          timeRange: '21:00 - 09:00',
          isEnabled: false,
        ),
      ],
      insights: const [
        Insight(
          title: 'Tiempo Productivo',
          subtitle: 'Semana actual',
          deltaDescription: '+1 h 12 min vs. semana pasada',
          highlight: 5.3,
          trend: 0.22,
        ),
        Insight(
          title: 'Distracciones Bloqueadas',
          subtitle: 'Hoy',
          deltaDescription: '18 apps limitadas en background',
          highlight: 18,
          trend: 0.35,
        ),
        Insight(
          title: 'Tiempo en Redes Sociales',
          subtitle: 'Promedio diario',
          deltaDescription: '-24% respecto a la media',
          highlight: 0.9,
          trend: -0.24,
        ),
      ],
      profile: const Profile(
        name: 'Alex Rivera',
        role: 'Estratega UX',
        email: 'alex@focusstudio.com',
        avatarUrl: 'https://avatars.githubusercontent.com/u/000?v=4',
        notificationsEnabled: true,
        hapticFeedbackEnabled: true,
      ),
    );
  }
}
