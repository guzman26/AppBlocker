import 'package:flutter/cupertino.dart';

import '../../../models/block_session.dart';
import '../../../theme/typography.dart';

class BlockSessionCard extends StatelessWidget {
  const BlockSessionCard({super.key, required this.session});

  final BlockSession session;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            session.accentColor.withOpacity(0.9),
            session.accentColor.withOpacity(0.65),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(26),
        boxShadow: [
          BoxShadow(
            color: session.accentColor.withOpacity(0.32),
            offset: const Offset(0, 18),
            blurRadius: 36,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      session.name,
                      style: AppTypography.title.copyWith(
                        color: CupertinoColors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      session.description,
                      style: AppTypography.body.copyWith(
                        color: CupertinoColors.white.withOpacity(0.82),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 10,
                      runSpacing: 8,
                      children: [
                        _FocusLevelChip(label: session.focusLevel),
                        ...session.blockedApps.map(
                          (app) => _InfoChip(label: app),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              Container(
                height: 34,
                padding: const EdgeInsets.symmetric(horizontal: 14),
                decoration: BoxDecoration(
                  color: CupertinoColors.white.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(20),
                ),
                alignment: Alignment.center,
                child: Text(
                  session.timeRange,
                  style: AppTypography.footnote.copyWith(
                    color: CupertinoColors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: LinearProgressIndicator(
              value: session.progress,
              minHeight: 8,
              backgroundColor: CupertinoColors.white.withOpacity(0.16),
              valueColor: AlwaysStoppedAnimation<Color>(CupertinoColors.white),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    session.isActive ? 'En progreso' : 'Programado',
                    style: AppTypography.body.copyWith(
                      color: CupertinoColors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(
                        CupertinoIcons.hand_raised_fill,
                        size: 16,
                        color: CupertinoColors.white.withOpacity(0.75),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        '${session.overrideAttempts} intentos de desbloqueo',
                        style: AppTypography.footnote.copyWith(
                          color: CupertinoColors.white.withOpacity(0.8),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              DecoratedBox(
                decoration: BoxDecoration(
                  color: CupertinoColors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  child: Text(
                    '${(session.progress * 100).round()}% completado',
                    style: AppTypography.footnote.copyWith(
                      color: CupertinoColors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),
          if (session.automationNotes.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              height: 1,
              color: CupertinoColors.white.withOpacity(0.18),
            ),
            const SizedBox(height: 14),
            ...session.automationNotes.map(
              (note) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: _AutomationNote(text: note),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _FocusLevelChip extends StatelessWidget {
  const _FocusLevelChip({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        color: CupertinoColors.white.withOpacity(0.18),
        borderRadius: BorderRadius.circular(18),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              CupertinoIcons.waveform_path,
              size: 16,
              color: CupertinoColors.white,
            ),
            const SizedBox(width: 6),
            Text(
              label,
              style: AppTypography.footnote.copyWith(
                color: CupertinoColors.white,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  const _InfoChip({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        color: CupertinoColors.white.withOpacity(0.12),
        borderRadius: BorderRadius.circular(18),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        child: Text(
          label,
          style: AppTypography.footnote.copyWith(
            color: CupertinoColors.white.withOpacity(0.9),
          ),
        ),
      ),
    );
  }
}

class _AutomationNote extends StatelessWidget {
  const _AutomationNote({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Icon(
          CupertinoIcons.sparkles,
          size: 16,
          color: CupertinoColors.white,
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            text,
            style: AppTypography.footnote.copyWith(
              color: CupertinoColors.white.withOpacity(0.86),
              height: 1.35,
            ),
          ),
        ),
      ],
    );
  }
}
