import 'package:flutter/cupertino.dart';

import '../../../models/app_usage.dart';
import '../../../theme/colors.dart';
import '../../../theme/typography.dart';

class AppUsageTile extends StatelessWidget {
  const AppUsageTile({super.key, required this.usage});

  final AppUsage usage;

  @override
  Widget build(BuildContext context) {
    final isOverLimit = usage.used > usage.limit;
    final changeColor = usage.changePercentage <= 0
        ? AppColors.success
        : AppColors.caution;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      decoration: BoxDecoration(
        color: CupertinoColors.systemBackground,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: CupertinoColors.separator.withOpacity(0.4)),
      ),
      child: Row(
        children: [
          Container(
            height: 44,
            width: 44,
            decoration: BoxDecoration(
              color: usage.tint.withOpacity(0.18),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(usage.icon, color: usage.tint, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  usage.name,
                  style: AppTypography.callout.copyWith(
                    color: AppColors.textPrimary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '${usage.category} · límite ${usage.formattedLimit}',
                  style: AppTypography.footnote.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                usage.formattedUsage,
                style: AppTypography.callout.copyWith(
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                '${usage.changePercentage > 0 ? '+' : ''}${usage.changePercentage.toStringAsFixed(0)}%',
                style: AppTypography.footnote.copyWith(
                  color: usage.changePercentage == 0 ? AppColors.textSecondary : changeColor,
                ),
              ),
            ],
          ),
          const SizedBox(width: 4),
          Container(
            height: 12,
            width: 12,
            decoration: BoxDecoration(
              color: isOverLimit ? AppColors.caution : AppColors.success,
              shape: BoxShape.circle,
            ),
          ),
        ],
      ),
    );
  }
}
