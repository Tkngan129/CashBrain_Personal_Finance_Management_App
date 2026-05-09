# Project File Functions

This document summarizes the purpose of the source files currently in the repo. Generated folders such as `node_modules`, build output, and binary assets are excluded.

## Active Runtime Files

- `App.tsx` - Root entry that re-exports the current app shell from `src/app/index.tsx`.
- `src/app/App.tsx` - Compatibility export that points to `src/app/index.tsx`.
- `src/app/_layout.tsx` - Expo Router stack layout for the current mobile app shell.
- `src/app/index.tsx` - Main app shell with bottom navigation and screen switching.

## Current Screen Components

- `src/app/components/DashboardScreen.tsx` - Home tab UI with balance, budget, quick actions, and recent transactions.
- `src/app/components/AnalyticsScreen.tsx` - Analytics tab UI with expenses, calendar, and overview layouts.
- `src/app/components/AddExpenseScreen.tsx` - Form for adding an expense or income entry.
- `src/app/components/AIChatScreen.tsx` - Chat-style UI for AI spending advice and insights.
- `src/app/components/ProfileScreen.tsx` - Profile and settings screen for the current mobile UI.
- `src/app/components/CameraScreen.tsx` - Receipt scanning placeholder screen.

## Legacy App Router Files

These files belong to the older Expo Router structure and remain in the repo as legacy code.

- `app/_layout.tsx` - Old Expo Router root layout with auth, theme, and finance providers.
- `app/index.tsx` - Old router index that returned `null` while auth loading completed.
- `app/(auth)/_layout.tsx` - Auth stack layout for login and registration routes.
- `app/(auth)/index.tsx` - Login route entry.
- `app/(auth)/register.tsx` - Registration route entry.
- `app/(tabs)/_layout.tsx` - Old tab navigator layout for home, analytics, and profile.
- `app/(tabs)/index.tsx` - Old home tab route.
- `app/(tabs)/analytics.tsx` - Old analytics tab route.
- `app/(tabs)/profile.tsx` - Old profile tab route.

## Legacy Navigation and Screens

These files are part of the older React Navigation version of the app.

- `App.js` - Older app bootstrap that wrapped the app in context providers and the navigation container.
- `navigation/AppNavigation.js` - Old application navigation setup.
- `navigation/RootNavigation.js` - Root navigator used by the legacy app structure.
- `screens/HomeScreen.js` - Legacy home screen implementation.
- `screens/AnalyticsScreen.js` - Legacy analytics screen implementation.
- `screens/AIChartScreen.js` - Legacy AI chat / chart screen implementation.
- `screens/LoginScreen.js` - Legacy login screen implementation.
- `screens/RegisterScreen.js` - Legacy registration screen implementation.
- `screens/ProfileScreen.js` - Legacy profile screen implementation.

## Legacy Shared Components

These components support the older web-first UI and are no longer part of the active `src/app` screens.

- `components/AuthInput.js` - Reusable authentication input field.
- `components/CategoryModal.js` - Category picker modal for transactions.
- `components/ExpenseCard.js` - Expense summary card component.
- `components/GlassCard.js` - Glass-style card wrapper used by the old UI.
- `components/MessageBubble.js` - Chat bubble component for AI conversations.
- `components/TransactionConfirmationCard.js` - Confirmation card shown after adding a transaction.
- `components/TypingIndicator.js` - Chat typing animation / indicator.

## Legacy State, Context, and Hooks

- `context/AuthContext.js` - Authentication state and helper actions for the legacy app.
- `context/FinanceContext.js` - Transaction and finance state for the legacy app.
- `context/ThemeContext.js` - Theme state and theme switching helpers.
- `hooks/use-color-scheme.ts` - Color scheme hook for native platforms.
- `hooks/use-color-scheme.web.ts` - Web-specific color scheme hook.
- `hooks/use-theme-color.ts` - Theme color helper hook.
- `store/useStore.js` - Legacy store hook for app state and transactions.

## Legacy Services and Utilities

- `services/api.js` - API helper layer for the older architecture.
- `services/aiService.js` - AI parsing / analysis helper service.
- `services/transactionService.js` - Transaction CRUD helper service.
- `utils/formatCurrency.js` - Currency formatting helper used by the older UI.
- `utils/mockData.js` - Mock finance and transaction data.
- `utils/parseExpenseMessage.js` - Parser for extracting expense details from chat text.
- `styles/theme.js` - Legacy theme tokens and styling helpers.
- `constants/theme.ts` - TypeScript theme constants for the old UI.

## Configuration and Project Docs

- `app.json` - Expo configuration, plugins, and platform settings.
- `package.json` - Project scripts and dependency list.
- `package-lock.json` - Locked dependency tree created by npm.
- `tsconfig.json` - TypeScript compiler configuration.
- `eslint.config.js` - ESLint configuration.
- `expo-env.d.ts` - Expo TypeScript environment declarations.
- `README.md` - Project overview and usage notes.
- `EXPO_ROUTER_ARCHITECTURE.md` - Architecture notes for the Expo Router setup.
- `scripts/reset-project.js` - Reset script for restoring the project template.

## Editor and Workspace Files

- `.vscode/settings.json` - Workspace editor settings.
- `.vscode/extensions.json` - Recommended extensions for the project.

## Notes

- The active mobile UI is now driven from `src/app/index.tsx` and the screen components under `src/app/components/`.
- The legacy files are still present for reference, but they are not part of the current screen flow.
