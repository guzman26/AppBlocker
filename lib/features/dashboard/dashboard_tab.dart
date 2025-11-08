import 'package:flutter/cupertino.dart';

import '../../data/mock_data.dart';
import '../../theme/colors.dart';
import '../../theme/typography.dart';
import 'widgets/app_usage_tile.dart';
import 'widgets/block_session_card.dart';
import 'widgets/focus_control_tile.dart';
import 'widgets/focus_mode_header.dart';

class DashboardTab extends StatefulWidget {
  const DashboardTab({super.key, required this.data});

  final MockData data;

  @override
  State<DashboardTab> createState() => _DashboardTabState();
}

class _DashboardTabState extends State<DashboardTab> {
  int _selectedPeriod = 0;
  bool _focusEnabled = true;
  bool _strictModeEnabled = true;
  bool _shieldNewInstalls = true;
  bool _guidedTransitions = true;

  @override
  Widget build(BuildContext context) {
    final sessions = widget.data.sessions;
    final activeSession = sessions.firstWhere(
      (session) => session.isActive,
      orElse: () => sessions.first,
    );
    final blockedAppsCount = sessions
        .where((session) => session.isActive)
        .fold<int>(0, (count, session) => count + session.blockedApps.length);
    final overrideAttempts = sessions
        .fold<int>(0, (count, session) => count + session.overrideAttempts);

    return CupertinoPageScaffold(
      backgroundColor: AppColors.background,
      child: CustomScrollView(
        slivers: [
          const CupertinoSliverNavigationBar(
            largeTitle: Text('Focus'),
            trailing: _ProfileAvatar(),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  FocusModeHeader(
                    isEnabled: _focusEnabled,
                    onChanged: (value) {
                      setState(() => _focusEnabled = value);
                    },
                    strictModeEnabled: _strictModeEnabled,
                    onStrictModeChanged: (value) {
                      setState(() => _strictModeEnabled = value);
                    },
                    activeSessionName: activeSession.name,
                    focusLevel: activeSession.focusLevel,
                    blockedAppsCount: blockedAppsCount,
                    overrideAttempts: overrideAttempts,
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Controles avanzados',
                    style: AppTypography.title.copyWith(
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 14),
                  FocusControlTile(
                    icon: CupertinoIcons.lock_fill,
                    accentColor: AppColors.accentPurple,
                    title: 'Blindaje para apps nuevas',
                    subtitle:
                        'Bloquea automáticamente las apps instaladas durante un turno SHIFT hasta revisarlas.',
                    value: _shieldNewInstalls,
                    enabled: _focusEnabled,
                    onChanged: (value) {
                      setState(() => _shieldNewInstalls = value);
                    },
                  ),
                  FocusControlTile(
                    icon: CupertinoIcons.timer,
                    accentColor: AppColors.accentTeal,
                    title: 'Transiciones guiadas',
                    subtitle:
                        'Avisa con respiraciones y vibración antes de cambiar de bloque para evitar cortes bruscos.',
                    value: _guidedTransitions,
                    enabled: _focusEnabled,
                    onChanged: (value) {
                      setState(() => _guidedTransitions = value);
                    },
                  ),
                  FocusControlTile(
                    icon: CupertinoIcons.person_crop_square,
                    accentColor: AppColors.accentIndigo,
                    title: 'Supervisor de confianza',
                    subtitle:
                        'Envía un resumen de intentos de desbloqueo a tu accountability partner.',
                    value: _strictModeEnabled,
                    enabled: _focusEnabled,
                    onChanged: (value) {
                      setState(() => _strictModeEnabled = value);
                    },
                  ),
                  const SizedBox(height: 22),
                  _buildSegmentedControl(),
                  const SizedBox(height: 24),
                  ...sessions.map((session) => Padding(
                        padding: const EdgeInsets.only(bottom: 18),
                        child: BlockSessionCard(session: session),
                      )),
                  const SizedBox(height: 16),
                  Text(
                    'Apps destacadas',
                    style: AppTypography.title.copyWith(
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 12),
                  ...widget.data.usage.map((usage) => Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: AppUsageTile(usage: usage),
                      )),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSegmentedControl() {
    final labels = <int, Widget>{
      0: _SegmentLabel(title: 'Hoy', isSelected: _selectedPeriod == 0),
      1: _SegmentLabel(title: '7 días', isSelected: _selectedPeriod == 1),
      2: _SegmentLabel(title: '30 días', isSelected: _selectedPeriod == 2),
    };

    return DecoratedBox(
      decoration: BoxDecoration(
        color: AppColors.secondaryBackground,
        borderRadius: BorderRadius.circular(20),
      ),
      child: CupertinoSlidingSegmentedControl<int>(
        groupValue: _selectedPeriod,
        backgroundColor: AppColors.secondaryBackground,
        thumbColor: CupertinoColors.systemBackground,
        children: labels,
        onValueChanged: (value) {
          if (value != null) {
            setState(() => _selectedPeriod = value);
          }
        },
      ),
    );
  }
}

class _SegmentLabel extends StatelessWidget {
  const _SegmentLabel({required this.title, required this.isSelected});

  final String title;
  final bool isSelected;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
      child: Text(
        title,
        style: AppTypography.body.copyWith(
          color: isSelected ? AppColors.textPrimary : AppColors.textSecondary,
          fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
        ),
      ),
    );
  }
}

class _ProfileAvatar extends StatelessWidget {
  const _ProfileAvatar();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 36,
      width: 36,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        image: const DecorationImage(
          image: NetworkImage('https://images.unsplash.com/photo-1531895861208-8504b98fe814?auto=format&fit=crop&w=200&q=60'),
          fit: BoxFit.cover,
        ),
      ),
      foregroundDecoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: CupertinoColors.separator.withOpacity(0.4)),
      ),
    );
  }
}
