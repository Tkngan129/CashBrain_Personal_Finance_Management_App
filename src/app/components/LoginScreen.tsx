import { useAuth } from '@/src/context/authContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useColors } from '../../context/ThemeContext';

interface LoginScreenProps {
  onLogin: (result: boolean) => void;
  onNavigateSignup: () => void;
}

export function LoginScreen({ onLogin, onNavigateSignup }: LoginScreenProps) {
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const shakeAnim = React.useRef(new Animated.Value(0)).current;

  const { fetchUserLogin, accessToken, refreshToken, error } = useAuth();

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const loginPress = async () => {
    setIsLoading(true);
    setLoginFailed(false);
    await fetchUserLogin(email, password);
    setIsLoading(false);
  };

  useEffect(() => {
    if (accessToken !== '' && refreshToken !== '') {
      onLogin(true);
    }
  }, [accessToken, refreshToken]);

  useEffect(() => {
    if (error) {
      setLoginFailed(true);
      setIsLoading(false);
      triggerShake();
    }
  }, [error]);

  const buttonBg = loginFailed ? '#C0392B' : '#1C4D8D';
  const buttonShadow = loginFailed ? '#C0392B' : '#1C4D8D';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <Ionicons name="wallet" size={48} color="#ffffff" />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>CashBrain</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Master your personal finances
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Username</Text>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: colors.inputBg, borderColor: loginFailed ? '#C0392B' : colors.border },
                ]}
              >
                <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your username"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={(text) => { setEmail(text); setLoginFailed(false); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: colors.inputBg, borderColor: loginFailed ? '#C0392B' : colors.border },
                ]}
              >
                <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={(text) => { setPassword(text); setLoginFailed(false); }}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={colors.textMuted}
                  />
                </Pressable>
              </View>
            </View>

            {/* Error message */}
            {loginFailed && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={16} color="#C0392B" />
                <Text style={styles.errorText}>
                  {error || 'Incorrect username or password. Please try again.'}
                </Text>
              </View>
            )}

            <Pressable style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </Pressable>

            <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
              <Pressable
                style={[
                  styles.loginButton,
                  {
                    backgroundColor: buttonBg,
                    shadowColor: buttonShadow,
                    opacity: isLoading ? 0.85 : 1,
                  },
                ]}
                onPress={loginPress}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color="#ffffff" style={styles.spinner} />
                    <Text style={styles.loginButtonText}>Logging in...</Text>
                  </View>
                ) : loginFailed ? (
                  <View style={styles.loadingRow}>
                    <Ionicons name="close-circle-outline" size={20} color="#ffffff" style={styles.spinner} />
                    <Text style={styles.loginButtonText}>Login Failed</Text>
                  </View>
                ) : (
                  <Text style={styles.loginButtonText}>Login</Text>
                )}
              </Pressable>
            </Animated.View>

            <View style={styles.signupContainer}>
              <Text style={[styles.signupText, { color: colors.textSecondary }]}>
                Don&apos;t have an account?{' '}
              </Text>
              <Pressable onPress={onNavigateSignup}>
                <Text style={styles.signupLink}>Sign up</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#1C4D8D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#1C4D8D',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    height: '100%',
  },
  eyeButton: {
    padding: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: -8,
    paddingHorizontal: 4,
    gap: 6,
  },
  errorText: {
    color: '#C0392B',
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: '#1C4D8D',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    marginRight: 8,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    fontWeight: '500',
  },
  signupLink: {
    color: '#1C4D8D',
    fontSize: 14,
    fontWeight: '700',
  },
});