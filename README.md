# AppBlocker

Aplicación React Native (TypeScript) para iOS que se integra con las Screen Time APIs de Apple (FamilyControls y DeviceActivity) para crear rutinas de bloqueo de aplicaciones.

## Requisitos

- macOS con Xcode 15 o superior.
- CocoaPods instalado (`sudo gem install cocoapods`).
- Node.js 18+ y Yarn o npm.
- Un dispositivo o simulador con iOS 16+.
- Acceso a las Screen Time APIs requiere activar la capability "Family Controls" en el proyecto Xcode y habilitar el Signing adecuado.

## Instalación

```bash
yarn install
(cd ios && pod install)
```

## Ejecución en iOS

```bash
yarn ios
```

## Estructura destacada

- `src/App.tsx`: Configura la navegación y el contenedor principal.
- `src/screens/DashboardScreen.tsx`: Pantalla principal para configurar apps bloqueadas y horarios.
- `src/hooks/useAppBlocker.ts`: Hook que coordina la interacción con el módulo nativo.
- `ios/ScreenTimeManager.swift`: Implementación del módulo nativo que consume FamilyControls y DeviceActivity.

## Notas sobre Screen Time

- Al iniciar la app se solicita autorización a `AuthorizationCenter` para controlar Screen Time.
- Se utiliza `FamilyActivityPickerViewController` para que la persona elija las apps a bloquear.
- Las rutinas se programan vía `DeviceActivityCenter`, aplicando restricciones mediante `ManagedSettingsStore`.
- Las APIs de Screen Time requieren que la app forme parte del programa Apple Developer y se distribuya mediante TestFlight para pruebas reales.

## Lint y chequeo de tipos

```bash
yarn lint
yarn typecheck
```
