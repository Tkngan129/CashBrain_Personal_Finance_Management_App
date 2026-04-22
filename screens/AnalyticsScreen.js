import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/theme';

const ScreenName = () => {
  const { isDarkMode } = useTheme();
  const theme = getTheme(isDarkMode);