import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginVertical: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(28,77,141,0.08)',
    shadowColor: '#1C4D8D',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 12,
  },
  message: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  messageBubbleUser: {
    backgroundColor: '#1C4D8D',
    marginLeft: 40,
  },
  messageBubbleAI: {
    backgroundColor: '#f1f5f9',
    marginRight: 40,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  messageTextUser: {
    color: '#ffffff',
  },
  messageTextAI: {
    color: '#1a202c',
  },
  timestamp: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1a202c',
    backgroundColor: '#f8fafc',
    maxHeight: 80,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1C4D8D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionCard: {
    backgroundColor: '#EEF4FF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#1C4D8D',
  },
  suggestionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 2,
  },
  suggestionText: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
});

export function AIChatScreen() {
  const [message, setMessage] = useState('');

  const chatHistory = [
    { id: 1, role: 'user', text: 'How can I reduce my spending?' },
    { id: 2, role: 'ai', text: 'Based on your transaction history, I\'d recommend: (1) Reduce food & drink spending - consider meal prep, (2) Set weekly shopping limits, (3) Use public transport more often.' },
    { id: 3, role: 'user', text: 'What\'s my average daily expense?' },
    { id: 4, role: 'ai', text: 'Your average daily expense is ~23,967 VND based on this month\'s data. This is 18% of your 4M budget, leaving you with 82% remaining.' },
  ];

  const suggestions = [
    { title: 'Budget Alert', text: 'You\'re on track! Only 18% spent.' },
    { title: 'Saving Tip', text: 'Your education spending is high. Consider online courses.' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Chat</Text>
      </View>

      <ScrollView style={styles.content}>
        {chatHistory.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.message,
              msg.role === 'user' ? styles.messageBubbleUser : styles.messageBubbleAI,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                msg.role === 'user' ? styles.messageTextUser : styles.messageTextAI,
              ]}
            >
              {msg.text}
            </Text>
            <Text style={[styles.timestamp, { color: msg.role === 'user' ? 'rgba(255,255,255,0.6)' : '#94a3b8' }]}>
              just now
            </Text>
          </View>
        ))}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Smart Suggestions</Text>
          {suggestions.map((sug, idx) => (
            <View key={idx} style={styles.suggestionCard}>
              <Text style={styles.suggestionTitle}>{sug.title}</Text>
              <Text style={styles.suggestionText}>{sug.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#ffffff' }}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything..."
            placeholderTextColor="#cbd5e1"
            value={message}
            onChangeText={setMessage}
          />
          <Pressable style={styles.sendButton}>
            <Ionicons name="send" size={16} color="#ffffff" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
