class Profile {
  const Profile({
    required this.name,
    required this.role,
    required this.email,
    required this.avatarUrl,
    required this.notificationsEnabled,
    required this.hapticFeedbackEnabled,
  });

  final String name;
  final String role;
  final String email;
  final String avatarUrl;
  final bool notificationsEnabled;
  final bool hapticFeedbackEnabled;

  Profile copyWith({
    String? name,
    String? role,
    String? email,
    String? avatarUrl,
    bool? notificationsEnabled,
    bool? hapticFeedbackEnabled,
  }) {
    return Profile(
      name: name ?? this.name,
      role: role ?? this.role,
      email: email ?? this.email,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      notificationsEnabled: notificationsEnabled ?? this.notificationsEnabled,
      hapticFeedbackEnabled: hapticFeedbackEnabled ?? this.hapticFeedbackEnabled,
    );
  }
}
