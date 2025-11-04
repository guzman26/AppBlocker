import 'package:flutter/cupertino.dart';

import '../../../models/insight.dart';
import '../../../theme/colors.dart';
import '../../../theme/typography.dart';

class InsightCard extends StatelessWidget {
  const InsightCard({super.key, required this.insight});

  final Insight insight;

  @override
  Widget build(BuildContext context) {
    final trendColor = insight.isPositive ? AppColors.success : AppColors.caution;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: CupertinoColors.systemBackground,
        borderRadius: BorderRadius.circular(26),
        border: Border.all(color: CupertinoColors.separator.withOpacity(0.35)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            insight.title,
            style: AppTypography.callout.copyWith(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            insight.subtitle,
            style: AppTypography.footnote.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 20),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                insight.highlight.toStringAsFixed(1),
                style: AppTypography.largeTitle.copyWith(
                  fontSize: 42,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(width: 6),
              Icon(
                insight.isPositive
                    ? CupertinoIcons.arrow_up_right_circle_fill
                    : CupertinoIcons.arrow_down_right_circle,
                color: trendColor,
                size: 22,
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            insight.deltaDescription,
            style: AppTypography.footnote.copyWith(
              color: trendColor,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 18),
          _TrendMeter(value: (insight.trend.abs()).clamp(0, 1)),
        ],
      ),
    );
  }
}

class _TrendMeter extends StatelessWidget {
  const _TrendMeter({required this.value});

  final double value;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(14),
      child: Container(
        height: 44,
        decoration: BoxDecoration(
          color: AppColors.secondaryBackground,
        ),
        child: Stack(
          alignment: Alignment.centerLeft,
          children: [
            FractionallySizedBox(
              widthFactor: value,
              child: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      AppColors.primary,
                      AppColors.accentIndigo,
                    ],
                  ),
                ),
              ),
            ),
            Align(
              alignment: Alignment.center,
              child: Text(
                '${(value * 100).round()}% de tendencia positiva',
                style: AppTypography.footnote.copyWith(
                  color: AppColors.textPrimary,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
