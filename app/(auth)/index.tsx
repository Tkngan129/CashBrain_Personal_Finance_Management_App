import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        // Auth context will trigger navigation automatically
      } else {
        Alert.alert('Login Failed', 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>CashBrain</Text>
          <Text style={styles.subtitle}>Manage your finances smartly</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="test@test.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="123456"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.linkText}>Register here</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.hints}>
          <Text style={styles.hintTitle}>Demo Credentials:</Text>
          <Text style={styles.hint}>📧 test@test.com</Text>
          <Text style={styles.hint}>🔑 123456</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3EA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#122126',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#44565B',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E2C30',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D3C4A8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFDF8',
  },
  button: {
    backgroundColor: '#CD5D3D',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF8F1',
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#44565B',
    fontSize: 14,
  },
  linkText: {
    color: '#CD5D3D',
    fontWeight: '700',
    fontSize: 14,
  },
  hints: {
    backgroundColor: '#E8E0D1',
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  hintTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#44565B',
    marginBottom: 4,
  },
  hint: {
    fontSize: 13,
    color: '#1E2C30',
  },
});
