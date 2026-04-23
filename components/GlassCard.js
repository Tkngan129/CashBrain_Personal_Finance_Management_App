import React from 'react';
import { StyleSheet, View } from 'react-native';

const GlassCard = ({ children, style }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#1C4D8D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 8,
    backdropFilter: 'blur(8px)',
  },
});

export default GlassCard;