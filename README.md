# AppBlocker

Aplicación Expo (React Native + TypeScript) orientada a iOS que se integra con las Screen Time APIs de Apple (FamilyControls y DeviceActivity)
para crear rutinas de bloqueo de aplicaciones con funcionalidades avanzadas inspiradas en Opal y One Sec.

## Funcionalidades clave

### Bloqueo de Apps
- Selección guiada de aplicaciones mediante el picker nativo de Screen Time
- Rutinas inteligentes configurables por horario y días de la semana
- Bloqueos de foco instantáneos (15, 25, 45, 60 minutos)

### Fricción Intencional (One Sec)
- Pausas obligatorias con ejercicios de respiración antes de abrir apps bloqueadas
- Prompts de intención: "¿Por qué quieres abrir esta app?"
- Sugerencias de alternativas saludables
- Recordatorios de intención

### Analytics y Reportes (Opal)
- Gráficas de tiempo bloqueado (últimos 7 días)
- Métricas de racha actual de días consecutivos
- Estadísticas semanales y mensuales
- Conteo de intervenciones y bloqueos exitosos
- Progreso hacia metas diarias

### Bloqueo de Sitios Web
- Bloquear dominios específicos en Safari y otros navegadores
- Aplicar mismos horarios que apps bloqueadas
- Gestión de lista de sitios bloqueados

### Integración con Focus Modes
- Sincronización con Focus Modes nativos de iOS
- Activación automática de bloqueos según Focus Mode activo

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

### Navegación
- `src/App.tsx`: Navegación por tabs con 4 pantallas principales

### Pantallas
- `src/screens/DashboardScreen.tsx`: Configurar apps, rutinas y focos inmediatos
- `src/screens/AnalyticsScreen.tsx`: Métricas, gráficas y reportes de uso
- `src/screens/WebsiteBlockerScreen.tsx`: Gestión de sitios web bloqueados
- `src/screens/FocusModeScreen.tsx`: Integración con Focus Modes de iOS
- `src/screens/IntentionPromptScreen.tsx`: Modal de intervención con pausas

### Hooks
- `src/hooks/useAppBlocker.ts`: Gestión de bloqueos y rutinas
- `src/hooks/useAnalytics.ts`: Métricas y estadísticas de uso
- `src/hooks/useIntervention.ts`: Configuración de fricción intencional
- `src/hooks/useWebsiteBlocker.ts`: Bloqueo de sitios web
- `src/hooks/useFocusMode.ts`: Sincronización con Focus Modes

### Componentes
- `src/components/BreathingExercise.tsx`: Animación de respiración
- `src/components/IntentionInput.tsx`: Input de intención
- `src/components/AlternativeSuggestion.tsx`: Sugerencias de alternativas
- `src/components/UsageChart.tsx`: Gráfica de uso semanal
- `src/components/StatCard.tsx`: Tarjetas de métricas
- `src/components/ProgressRing.tsx`: Anillo de progreso

### Servicios
- `src/services/storage.ts`: Servicio centralizado de AsyncStorage
- `src/types/index.ts`: Tipos TypeScript compartidos

### Módulo Nativo iOS
- `ios/ScreenTimeManager.swift`: Implementación de FamilyControls y DeviceActivity
- `ios/ScreenTimeManager.m`: Bridge Objective-C

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
