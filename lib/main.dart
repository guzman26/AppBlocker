import 'package:flutter/cupertino.dart';
import 'package:flutter/services.dart';

import 'app_blocker_app.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarBrightness: Brightness.light,
    statusBarIconBrightness: Brightness.dark,
  ));
  runApp(const AppBlockerApp());
}
