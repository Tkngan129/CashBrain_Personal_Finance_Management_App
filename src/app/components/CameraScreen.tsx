import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C4D8D',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#1C4D8D',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export function CameraScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.icon}>
          <Ionicons name="camera" size={64} color="#1C4D8D" />
        </View>
        <Text style={styles.title}>Scan Receipt</Text>
        <Text style={styles.subtitle}>
          Take a photo of your receipt to automatically extract expense details
        </Text>
        <Pressable style={styles.button}>
          <Ionicons name="camera-outline" size={18} color="#ffffff" />
          <Text style={styles.buttonText}>Open Camera</Text>
        </Pressable>
      </View>
    </View>
  );
}
