import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AuthInput from '../components/AuthInput';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/theme';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  const theme = getTheme(isDarkMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const success = login(email, password);
    setLoading(false);
    if (!success) {
      Alert.alert('Đăng nhập thất bại', 'Thử: ngan@example.com / 123456');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={[theme.backgroundStart, theme.backgroundMid, theme.backgroundEnd]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.primary }]}>FinanceAI</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Quản lý tài chính thông minh</Text>
          </View>

          <GlassCard style={styles.formCard}>
            <Text style={[styles.formTitle, { color: theme.textPrimary }]}>Đăng nhập</Text>
            <AuthInput label="Email" placeholder="ngan@example.com" value={email} onChangeText={setEmail} />
            <AuthInput label="Mật khẩu" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginText}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</Text>
            </TouchableOpacity>
          </GlassCard>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.registerLink, { color: theme.primary }]}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  gradient: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 42, fontWeight: '700' },
  subtitle: { fontSize: 16, marginTop: 4 },
  formCard: { padding: 24 },
  formTitle: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 24 },
  loginButton: { backgroundColor: '#1C4D8D', paddingVertical: 16, borderRadius: 999, alignItems: 'center', marginTop: 8 },
  loginText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  footerText: {},
  registerLink: { fontWeight: '600' },
});

export default LoginScreen;