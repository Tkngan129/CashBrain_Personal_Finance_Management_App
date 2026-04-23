import React from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import GlassCard from './GlassCard';

const AuthInput = ({ label, value, onChangeText, placeholder, secureTextEntry = false }) => {
  return (
    <GlassCard style={styles.inputCard}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#94A3B8"
      />
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  inputCard: {
    marginBottom: 16,
    padding: 4,
  },
  label: {
    fontSize: 14,
    color: '#1C4D8D',
    fontWeight: '600',
    marginBottom: 6,
    paddingHorizontal: 8,
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#1C4D8D',
  },
});

export default AuthInput;