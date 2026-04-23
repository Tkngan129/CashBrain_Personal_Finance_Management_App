import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TypingIndicator = () => {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.text}>AI đang suy nghĩ{dots}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignSelf: 'flex-start', marginVertical: 6, marginLeft: 16 },
  bubble: { backgroundColor: '#fff', padding: 12, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  text: { color: '#64748B', fontStyle: 'italic' },
});

export default TypingIndicator;