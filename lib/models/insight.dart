class Insight {
  const Insight({
    required this.title,
    required this.subtitle,
    required this.deltaDescription,
    required this.highlight,
    required this.trend,
  });

  final String title;
  final String subtitle;
  final String deltaDescription;
  final double highlight;
  final double trend;

  bool get isPositive => trend >= 0;
}
