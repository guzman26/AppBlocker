import 'package:flutter/cupertino.dart';

import '../../models/profile.dart';
import '../../theme/colors.dart';
import '../../theme/typography.dart';

class SettingsTab extends StatefulWidget {
  const SettingsTab({super.key, required this.profile});

  final Profile profile;

  @override
  State<SettingsTab> createState() => _SettingsTabState();
}

class _SettingsTabState extends State<SettingsTab> {
  late Profile _profile;

  @override
  void initState() {
    super.initState();
    _profile = widget.profile;
  }

  @override
  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      backgroundColor: AppColors.background,
      child: CustomScrollView(
        slivers: [
          const CupertinoSliverNavigationBar(
            largeTitle: Text('Ajustes'),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildProfileHeader(),
                  const SizedBox(height: 24),
                  _buildSectionTitle('Preferencias'),
                  const SizedBox(height: 12),
                  _buildToggleTile(
                    label: 'Notificaciones inteligentes',
                    subtitle: 'Solo interrupciones relevantes cuando el foco está activo.',
                    value: _profile.notificationsEnabled,
                    onChanged: (value) => setState(
                      () => _profile = _profile.copyWith(notificationsEnabled: value),
                    ),
                  ),
                  _buildToggleTile(
                    label: 'Respuesta háptica',
                    subtitle: 'Recibe confirmaciones sutiles al bloquear apps.',
                    value: _profile.hapticFeedbackEnabled,
                    onChanged: (value) => setState(
                      () => _profile = _profile.copyWith(hapticFeedbackEnabled: value),
                    ),
                  ),
                  const SizedBox(height: 24),
                  _buildSectionTitle('Integraciones'),
                  const SizedBox(height: 12),
                  _buildLinkTile(
                    icon: CupertinoIcons.graph_square_fill,
                    label: 'Sincronizar con Salud',
                    subtitle: 'Ajusta tu enfoque según tu recuperación y sueño.',
                  ),
                  _buildLinkTile(
                    icon: CupertinoIcons.app_badge_fill,
                    label: 'Control parental',
                    subtitle: 'Gestiona límites y reportes para tu familia.',
                  ),
                  const SizedBox(height: 24),
                  _buildSectionTitle('Cuenta'),
                  const SizedBox(height: 12),
                  _buildLinkTile(
                    icon: CupertinoIcons.person_crop_circle_badge_checkmark,
                    label: 'Suscripción Pro',
                    subtitle: 'Gestión avanzada de hábitos digitales.',
                    trailing: const _Badge(label: 'Activo'),
                  ),
                  _buildLinkTile(
                    icon: CupertinoIcons.lock_circle_fill,
                    label: 'Privacidad y datos',
                    subtitle: 'Controla qué información compartes.',
                  ),
                  const SizedBox(height: 32),
                  CupertinoButton(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    color: CupertinoColors.systemBackground,
                    borderRadius: BorderRadius.circular(16),
                    onPressed: () {},
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Icon(CupertinoIcons.square_arrow_left, color: AppColors.destructive, size: 20),
                        SizedBox(width: 8),
                        Text(
                          'Cerrar sesión',
                          style: TextStyle(color: AppColors.destructive),
                        ),
                      ],
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

  Widget _buildProfileHeader() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: CupertinoColors.systemBackground,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: CupertinoColors.separator.withOpacity(0.25)),
      ),
      child: Row(
        children: [
          Container(
            height: 64,
            width: 64,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              image: DecorationImage(
                image: NetworkImage(_profile.avatarUrl),
                fit: BoxFit.cover,
              ),
            ),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _profile.name,
                  style: AppTypography.title.copyWith(
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  _profile.role,
                  style: AppTypography.body.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  _profile.email,
                  style: AppTypography.footnote.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          const Icon(CupertinoIcons.qrcode, color: AppColors.primary, size: 26),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: AppTypography.callout.copyWith(
        color: AppColors.textSecondary,
        fontWeight: FontWeight.w600,
      ),
    );
  }

  Widget _buildToggleTile({
    required String label,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),
      decoration: BoxDecoration(
        color: CupertinoColors.systemBackground,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: CupertinoColors.separator.withOpacity(0.35)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: AppTypography.callout.copyWith(
                    color: AppColors.textPrimary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: AppTypography.footnote.copyWith(
                    color: AppColors.textSecondary,
                    height: 1.3,
                  ),
                ),
              ],
            ),
          ),
          CupertinoSwitch(
            value: value,
            onChanged: onChanged,
            activeColor: AppColors.primary,
          ),
        ],
      ),
    );
  }

  Widget _buildLinkTile({
    required IconData icon,
    required String label,
    required String subtitle,
    Widget? trailing,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),
      decoration: BoxDecoration(
        color: CupertinoColors.systemBackground,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: CupertinoColors.separator.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Container(
            height: 44,
            width: 44,
            decoration: BoxDecoration(
              color: AppColors.accentTeal.withOpacity(0.18),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(icon, color: AppColors.accentTeal, size: 22),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: AppTypography.callout.copyWith(
                    color: AppColors.textPrimary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: AppTypography.footnote.copyWith(
                    color: AppColors.textSecondary,
                    height: 1.3,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          trailing ?? const Icon(CupertinoIcons.right_chevron, color: AppColors.textSecondary, size: 18),
        ],
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  const _Badge({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.success.withOpacity(0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        label,
        style: AppTypography.footnote.copyWith(
          color: AppColors.success,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
