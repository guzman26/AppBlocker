# AppBlocker

Aplicación Expo (React Native + TypeScript) orientada a iOS que se integra con las Screen Time APIs de Apple (FamilyControls y DeviceActivity)
para crear rutinas de bloqueo de aplicaciones.

## Funcionalidades clave

- Selección guiada de aplicaciones a bloquear mediante el picker nativo de Screen Time.
- Rutinas inteligentes configurables por horario y días de la semana.
- Bloqueos de foco instantáneos con duración personalizable para momentos de concentración.
- Sincronización de los planes con el módulo nativo y persistencia local para restaurar el estado.

## Requisitos

- macOS con Xcode 15 o superior.
- CocoaPods instalado (`sudo gem install cocoapods`).
- Node.js 18+ y Yarn o npm.
- Expo CLI (`npm install -g expo-cli`) o uso de `npx expo`.
- Un dispositivo o simulador con iOS 16+.
- Acceso a las Screen Time APIs requiere activar la capability "Family Controls" en el proyecto Xcode y habilitar el Signing adecuado.

## Instalación

```bash
yarn install
```

> **Nota:** al tratarse de un módulo nativo personalizado, es necesario ejecutar una prebuild para sincronizar los cambios con el proyecto iOS de Expo Dev Client.

```bash
npx expo prebuild --platform ios
(cd ios && pod install)
```

## Ejecución

Durante el desarrollo puedes ejecutar el bundle Metro con Expo y lanzar el cliente de iOS:

```bash
yarn start # expo start
yarn ios   # expo run:ios
```

Si ya tienes el proyecto iOS precompilado, también puedes abrir `ios/AppBlocker.xcworkspace` en Xcode y ejecutar desde allí.

## Estructura destacada

- `src/App.tsx`: Configura la navegación y el contenedor principal.
- `src/screens/DashboardScreen.tsx`: Pantalla principal para configurar apps bloqueadas, rutina semanal y focos inmediatos.
- `src/hooks/useAppBlocker.ts`: Hook que coordina la interacción con el módulo nativo y gestiona planes semanales.
- `ios/ScreenTimeManager.swift`: Implementación del módulo nativo que consume FamilyControls y DeviceActivity.

## Notas sobre Screen Time

- Al iniciar la app se solicita autorización a `AuthorizationCenter` para controlar Screen Time.
- Se utiliza `FamilyActivityPickerViewController` para que la persona elija las apps a bloquear.
- Las rutinas se programan vía `DeviceActivityCenter`, aplicando restricciones mediante `ManagedSettingsStore`.
- Las APIs de Screen Time requieren que la app forme parte del programa Apple Developer y se distribuya mediante TestFlight para
  pruebas reales.

## Lint y chequeo de tipos

```bash
yarn lint
yarn eslint
yarn typecheck # usando tsc --noEmit si se desea ejecutar manualmente
```
