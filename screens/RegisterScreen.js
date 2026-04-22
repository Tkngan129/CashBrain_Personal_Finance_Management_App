import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/theme';

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const { isDarkMode } = useTheme();
  const theme = getTheme(isDarkMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    setLoading(true);
    const success = register(email, password, name);
    setLoading(false);
    if (success) {
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={[theme.backgroundStart, theme.backgroundMid, theme.backgroundEnd]} style={styles.gradient}>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default RegisterScreen;