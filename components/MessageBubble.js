import { StyleSheet, Text, View } from 'react-native';

const MessageBubble = ({ message }) => (
  <View style={[styles.bubble, message.isUser ? styles.userBubble : styles.aiBubble]}>
    <Text style={[styles.text, message.isUser ? styles.userText : styles.aiText]}>
      {message.text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%',
    padding: 14,
    borderRadius: 20,
    marginVertical: 6,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#1C4D8D',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    shadowColor: '#1C4D8D',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderBottomLeftRadius: 4,
  },
  text: { fontSize: 16 },
  userText: { color: '#fff' },
  aiText: { color: '#1C4D8D' },
});

export default MessageBubble;