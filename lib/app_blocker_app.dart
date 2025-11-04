import 'package:flutter/cupertino.dart';

import 'data/mock_data.dart';
import 'features/dashboard/dashboard_tab.dart';
import 'features/insights/insights_tab.dart';
import 'features/schedule/schedule_tab.dart';
import 'features/settings/settings_tab.dart';
import 'theme/colors.dart';

class AppBlockerApp extends StatelessWidget {
  const AppBlockerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return CupertinoApp(
      debugShowCheckedModeBanner: false,
      theme: const CupertinoThemeData(
        brightness: Brightness.light,
        primaryColor: AppColors.primary,
        scaffoldBackgroundColor: AppColors.background,
        barBackgroundColor: CupertinoColors.systemBackground,
        textTheme: CupertinoTextThemeData(
          textStyle: TextStyle(
            fontFamily: '.SF Pro Display',
            fontSize: 17,
            letterSpacing: -0.1,
          ),
          navTitleTextStyle: TextStyle(
            fontFamily: '.SF Pro Display',
            fontSize: 17,
            fontWeight: FontWeight.w600,
            letterSpacing: -0.24,
          ),
          navLargeTitleTextStyle: TextStyle(
            fontFamily: '.SF Pro Display',
            fontSize: 34,
            fontWeight: FontWeight.bold,
            letterSpacing: 0,
          ),
        ),
      ),
      home: const _AppShell(),
    );
  }
}

class _AppShell extends StatefulWidget {
  const _AppShell();

  @override
  State<_AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<_AppShell> {
  final _mockData = MockData.today();

  @override
  Widget build(BuildContext context) {
    return CupertinoTabScaffold(
      tabBar: CupertinoTabBar(
        activeColor: AppColors.primary,
        inactiveColor: CupertinoColors.inactiveGray,
        border: const Border(top: BorderSide(color: CupertinoColors.separator)),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(CupertinoIcons.square_grid_2x2),
            label: 'Resumen',
          ),
          BottomNavigationBarItem(
            icon: Icon(CupertinoIcons.calendar),
            label: 'Horarios',
          ),
          BottomNavigationBarItem(
            icon: Icon(CupertinoIcons.chart_bar_alt_fill),
            label: 'Insights',
          ),
          BottomNavigationBarItem(
            icon: Icon(CupertinoIcons.gear_alt_fill),
            label: 'Ajustes',
          ),
        ],
      ),
      tabBuilder: (context, index) {
        switch (index) {
          case 0:
            return CupertinoTabView(
              builder: (context) => DashboardTab(data: _mockData),
            );
          case 1:
            return CupertinoTabView(
              builder: (context) => ScheduleTab(schedules: _mockData.schedules),
            );
          case 2:
            return CupertinoTabView(
              builder: (context) => InsightsTab(insights: _mockData.insights),
            );
          default:
            return CupertinoTabView(
              builder: (context) => SettingsTab(profile: _mockData.profile),
            );
        }
      },
    );
  }
}
