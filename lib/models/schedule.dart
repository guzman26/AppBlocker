class Schedule {
  const Schedule({
    required this.name,
    required this.days,
    required this.timeRange,
    required this.isEnabled,
  });

  final String name;
  final List<String> days;
  final String timeRange;
  final bool isEnabled;

  String get formattedDays => days.join(' · ');
}
