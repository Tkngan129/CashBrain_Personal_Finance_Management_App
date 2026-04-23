import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/theme';

const GlassCard = ({ children, style }) => {
  const { isDarkMode } = useTheme();
  const theme = getTheme(isDarkMode);

  return (
    <View style={[styles.card, { 
      backgroundColor: theme.glassBg,
      shadowColor: theme.primary,
    }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
  },
});

export default GlassCard;