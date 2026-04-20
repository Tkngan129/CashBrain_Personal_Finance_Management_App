import { AuthProvider } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { ThemeProvider } from './context/ThemeContext';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <FinanceProvider>
          <RootNavigator />
        </FinanceProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}