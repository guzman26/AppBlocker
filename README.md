# AppBlocker

A minimalist iOS app for mindful app blocking, inspired by OneSec. Instead of rigid restrictions, AppBlocker adds intentional friction through breathing exercises and reflection prompts when you try to open distracting apps.

## Philosophy

Traditional app blockers use hard restrictions that can be frustrating. AppBlocker takes a different approach inspired by OneSec:

- **Mindful Interventions**: Brief pauses with breathing exercises create moments of reflection
- **Intentional Design**: Ask yourself "why?" before opening an app
- **Gentle Friction**: Reduce impulsive behavior without harsh blocks
- **iOS Native**: Uses Apple's Screen Time API for system-level blocking

## Features

### Simple App Blocking
- Select apps to block using iOS's native picker
- Toggle blocking ON/OFF with a simple switch
- No complex scheduling or timers - just focused simplicity

### Mindful Interventions
- **Breathing Exercise**: Guided breathing pause (5-30 seconds)
- **Intention Prompt**: Reflect on why you want to open the app
- **Alternative Suggestions**: Consider healthier activities
- All interventions are fully customizable

### Clean Interface
- 3 tabs: Home, Interventions, Settings
- Minimal, distraction-free design
- Focus on what matters

## Requirements

- **iOS 16+** - Required for Screen Time API
- **Screen Time Permission** - Grant access to block apps
- **Device or Simulator** - Not available on web

## Installation

```bash
# Install dependencies
npm install

# Prebuild iOS native modules
npx expo prebuild --platform ios

# Install iOS pods
cd ios && pod install && cd ..
```

## Running the App

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios
```

You can also open `ios/AppBlocker.xcworkspace` in Xcode and run from there.

## Project Structure

```
src/
├── screens/
│   ├── HomeScreen.tsx                    # Select apps and toggle blocking
│   ├── InterventionSettingsScreen.tsx    # Configure interventions
│   ├── SettingsScreen.tsx                # App info and settings
│   └── IntentionPromptScreen.tsx         # Intervention flow modal
├── components/
│   ├── BreathingExercise.tsx            # Breathing animation
│   ├── IntentionInput.tsx               # Intention prompt
│   ├── AlternativeSuggestion.tsx        # Alternative activities
│   ├── PrimaryButton.tsx                # Button component
│   ├── Card.tsx                         # Card component
│   └── CupertinoTabBar.tsx              # Custom tab bar
├── hooks/
│   ├── useAppBlocker.ts                 # App blocking logic
│   └── useIntervention.ts               # Intervention configuration
├── native/
│   └── ScreenTimeManager.ts             # React Native bridge
└── theme/
    ├── colors.ts                        # Color palette
    ├── spacing.ts                       # Spacing system
    └── typography.ts                    # Typography styles

ios/
└── AppBlocker/
    ├── ScreenTimeManager.swift          # Native iOS implementation
    └── ScreenTimeManagerBridge.m        # Objective-C bridge
```

## How It Works

### The iOS Screen Time API

AppBlocker uses Apple's FamilyControls and ManagedSettings frameworks:

1. **Authorization**: Request permission to manage Screen Time settings
2. **App Selection**: Use `FamilyActivityPicker` to let users choose apps
3. **Blocking**: Apply shields using `ManagedSettingsStore`
4. **Toggle**: Enable/disable blocking with a simple switch

### The OneSec Approach

When blocking is active and you try to open a blocked app:

1. **iOS Shield**: iOS shows its native "app blocked" screen
2. **Future**: Shortcut integration to trigger interventions before unblocking
3. **Mindful Pause**: Optional breathing exercise and intention prompt
4. **Conscious Choice**: Decide if you really want to proceed

## Limitations

The iOS Screen Time API has some restrictions:

- **iOS 16+ only** - Older versions don't have the API
- **No direct intervention trigger** - iOS shows shield first, interventions can be added via Shortcuts
- **TestFlight/App Store required** - For distribution and full testing
- **No web or Android** - iOS-only API

## Development Notes

### TypeScript & Linting

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run prettier:fix
```

### Native Module Updates

If you modify `ScreenTimeManager.swift`:

```bash
# Rebuild native modules
npx expo prebuild --platform ios --clean
cd ios && pod install
```

## Inspiration

This app is inspired by:

- **[OneSec](https://one-sec.app)**: Mindful interventions for app usage
- **Apple Screen Time API**: Native iOS blocking capabilities
- **Minimalist Design**: Focus on simplicity and effectiveness

## License

This is a personal project. Use at your own discretion.

## Contributing

This is a simplified, focused implementation. The goal is to keep it simple and effective rather than feature-rich.
