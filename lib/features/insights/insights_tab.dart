import 'package:flutter/cupertino.dart';

import '../../models/insight.dart';
import '../../theme/colors.dart';
import '../../theme/typography.dart';
import 'widgets/insight_card.dart';

class InsightsTab extends StatefulWidget {
  const InsightsTab({super.key, required this.insights});

  final List<Insight> insights;

  @override
  State<InsightsTab> createState() => _InsightsTabState();
}

class _InsightsTabState extends State<InsightsTab> {
  int _selectedScope = 1;

  @override
  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      backgroundColor: AppColors.background,
      child: CustomScrollView(
        slivers: [
          const CupertinoSliverNavigationBar(
            largeTitle: Text('Insights'),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildHeroBanner(),
                  const SizedBox(height: 24),
                  _buildScopeSelector(),
                  const SizedBox(height: 20),
                  ...widget.insights.map(
                    (insight) => Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: InsightCard(insight: insight),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeroBanner() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [
            Color(0xFF0A84FF),
            Color(0xFF5E5CE6),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(30),
        boxShadow: const [
          BoxShadow(
            color: Color(0x330A84FF),
            blurRadius: 28,
            offset: Offset(0, 18),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Focus Score',
                style: AppTypography.footnote.copyWith(
                  color: CupertinoColors.white.withOpacity(0.8),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: CupertinoColors.white.withOpacity(0.18),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: const [
                    Icon(CupertinoIcons.sparkles, color: CupertinoColors.white, size: 16),
                    SizedBox(width: 6),
                    Text(
                      'Modo flujo',
                      style: TextStyle(
                        fontFamily: '.SF Pro Text',
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: CupertinoColors.white,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Text(
            '8.7',
            style: AppTypography.largeTitle.copyWith(
              color: CupertinoColors.white,
              fontSize: 54,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Tu foco es sobresaliente, mantén este ritmo durante 2 días más para desbloquear recomendaciones avanzadas.',
            style: AppTypography.body.copyWith(
              color: CupertinoColors.white.withOpacity(0.88),
            ),
          ),
          const SizedBox(height: 18),
          Row(
            children: [
              _HeroMetric(
                label: 'Bloqueos',
                value: '26',
                description: '+6 vs. semana pasada',
              ),
              const SizedBox(width: 18),
              _HeroMetric(
                label: 'Apps críticas',
                value: '4',
                description: 'Sin alertas',
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildScopeSelector() {
    final labels = <int, Widget>{
      0: _ScopeLabel('24 h', isSelected: _selectedScope == 0),
      1: _ScopeLabel('Semana', isSelected: _selectedScope == 1),
      2: _ScopeLabel('Mes', isSelected: _selectedScope == 2),
    };

    return CupertinoSlidingSegmentedControl<int>(
      groupValue: _selectedScope,
      backgroundColor: AppColors.secondaryBackground,
      thumbColor: CupertinoColors.systemBackground,
      children: labels,
      onValueChanged: (value) {
        if (value != null) {
          setState(() => _selectedScope = value);
        }
      },
    );
  }
}

class _HeroMetric extends StatelessWidget {
  const _HeroMetric({
    required this.label,
    required this.value,
    required this.description,
  });

  final String label;
  final String value;
  final String description;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: CupertinoColors.white.withOpacity(0.12),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: AppTypography.footnote.copyWith(
                color: CupertinoColors.white.withOpacity(0.72),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              value,
              style: AppTypography.title.copyWith(
                color: CupertinoColors.white,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              description,
              style: AppTypography.footnote.copyWith(
                color: CupertinoColors.white.withOpacity(0.72),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ScopeLabel extends StatelessWidget {
  const _ScopeLabel(this.title, {required this.isSelected});

  final String title;
  final bool isSelected;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
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
