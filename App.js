import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import RootNavigator from './navigation/RootNavigator';

function AppWrapper() {
  const { theme } = useTheme();

  return (
    <NavigationContainer theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FinanceProvider>
          <AppWrapper />
        </FinanceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}