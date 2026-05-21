import { useAIChatbot } from '@/src/context/aiChatbotContext';
import { useAuth } from '@/src/context/authContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useColors } from '../../context/ThemeContext';

type Message = {
  id: number;
  role: 'user' | 'ai';
  text: string;
  time: string;
};

const initialMessages: Message[] = [
  { id: 1, role: 'ai', text: 'Hi! 👋 I\'m your CashBrain AI assistant. I can help you analyze your spending, suggest savings strategies, and answer any questions about your finances. How can I help you today?', time: '9:00 AM' },
];

const quickPrompts = [
  { label: '📊 Monthly Summary', text: 'Give me a summary of this month' },
  { label: '💰 Save More', text: 'How can I save more money?' },
  { label: '⚠️ Unusual Spend', text: 'Any unusual spending this month?' },
  { label: '🎯 Budget Tips', text: 'Give me budget tips' },
];

function formatText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={i} style={{ fontWeight: '800' }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return <Text key={i}>{part}</Text>;
  });
}

export function AIChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const { userProfile } = useAuth()
  
  // Lấy hàm fetch và trạng thái loading từ hook
  const { fetchAIChatbotPromptPreview, loading } = useAIChatbot();
  const scrollRef = useRef<ScrollView>(null);
  const colors = useColors();

  const now = () => {
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    return `${h % 12 || 12}:${m} ${h < 12 ? 'AM' : 'PM'}`;
  };

  // Chuyển đổi thành hàm async để đợi kết quả từ API gửi về
  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return; // Không cho gửi khi trống hoặc đang đợi phản hồi cũ

    const userMsg: Message = { id: Date.now(), role: 'user', text: trimmed, time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setMessage('');
    
    // Cuộn xuống cuối ngay sau khi user bấm gửi tin nhắn
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);

    try {
      // Gọi API thực tế thông qua context
      const aiResponse = await fetchAIChatbotPromptPreview(trimmed);
      
      if (aiResponse) {
        const aiMsg: Message = {
          id: Date.now() + 1,
          role: 'ai',
          text: aiResponse,
          time: now(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      // Xử lý thông báo lỗi nếu API gặp sự cố
      const errorMsg: Message = {
        id: Date.now() + 1,
        role: 'ai',
        text: '❌ Sorry, I encountered an error connecting to CashBrain servers. Please try again later.',
        time: now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Fix lỗi che khuất input trên một số dòng iOS
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerGlow} />
        <View style={styles.headerContent}>
          <View style={styles.aiAvatarWrap}>
            <View style={styles.aiAvatar}>
              <Ionicons name="sparkles" size={22} color="#ffffff" />
            </View>
            <View style={styles.onlineDot} />
          </View>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>CashBrain AI</Text>
            <Text style={styles.headerSubtitle}>● Online · Smart Finance Assistant</Text>
          </View>
          <Pressable style={styles.headerAction}>
            <Ionicons name="ellipsis-horizontal" size={20} color="rgba(255,255,255,0.7)" />
          </Pressable>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        <View style={styles.dateSeparator}>
          <View style={styles.dateLine} />
          <Text style={styles.dateText}>Today</Text>
          <View style={styles.dateLine} />
        </View>

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <View key={msg.id} style={[styles.messageRow, isUser && styles.messageRowUser]}>
              {!isUser && (
                <View style={styles.aiBubbleAvatar}>
                  <Ionicons name="sparkles" size={13} color="#ffffff" />
                </View>
              )}
              <View style={[
                styles.bubble,
                isUser ? styles.bubbleUser : [styles.bubbleAI, { backgroundColor: colors.card, shadowColor: 'transparent' }],
              ]}>
                <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : [styles.bubbleTextAI, { color: colors.text }]]}>
                  {formatText(msg.text)}
                </Text>
                <Text style={[styles.bubbleTime, isUser && styles.bubbleTimeUser, !isUser && { color: colors.textMuted }]}>
                  {(() => {
                    const now = new Date();
                    const timeString = now.toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    });

                   return timeString;
                  })()}
                </Text>
              </View>
            </View>
          );
        })}

        {/* HIỂN THỊ TRẠNG THÁI AI ĐANG GÕ (TYPING INDICATOR) */}
        {loading && (
          <View style={styles.messageRow}>
            <View style={styles.aiBubbleAvatar}>
              <Ionicons name="sparkles" size={13} color="#ffffff" />
            </View>
            <View style={[styles.bubble, styles.bubbleAI, { backgroundColor: colors.card, shadowColor: 'transparent' }]}>
              <Text style={[styles.bubbleTextAI, { color: colors.textMuted, fontStyle: 'italic' }]}>
                CashBrain is thinking... 
              </Text>
            </View>
          </View>
        )}

        {/* Smart Insights Card */}
        {messages.length <= 1 && !loading && (
          <View style={[styles.insightsCard, { backgroundColor: colors.card }]}>
            <View style={styles.insightsHeaderRow}>
              <View style={styles.insightsBadge}>
                <Ionicons name="flash" size={13} color="#ec4899" />
                <Text style={styles.insightsBadgeText}>Smart Insights</Text>
              </View>
            </View>
            <View style={styles.insightItem}>
              <View style={[styles.insightDot, { backgroundColor: '#16a34a' }]} />
              <View style={styles.insightTextWrap}>
                <Text style={[styles.insightTitle, { color: colors.text }]}>On Track! 🎯</Text>
                <Text style={[styles.insightDesc, { color: colors.textSecondary }]}>You&apos;ve only used 18% of your April budget.</Text>
              </View>
            </View>
            <View style={styles.insightItem}>
              <View style={[styles.insightDot, { backgroundColor: '#f59e0b' }]} />
              <View style={styles.insightTextWrap}>
                <Text style={[styles.insightTitle, { color: colors.text }]}>Education Spending</Text>
                <Text style={[styles.insightDesc, { color: colors.textSecondary }]}>55% of expenses. Consider free resources.</Text>
              </View>
            </View>
            <View style={styles.insightItem}>
              <View style={[styles.insightDot, { backgroundColor: '#3b82f6' }]} />
              <View style={styles.insightTextWrap}>
                <Text style={[styles.insightTitle, { color: colors.text }]}>Savings Potential</Text>
                <Text style={[styles.insightDesc, { color: colors.textSecondary }]}>You could save ~200K more this month.</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Prompts */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.quickPromptsScroll, { backgroundColor: colors.bg }]}
        contentContainerStyle={styles.quickPromptsContent}
      >
        {quickPrompts.map((p, i) => (
          <Pressable 
            key={i} 
            disabled={loading} // Khóa nút khi đang load bài viết cũ
            style={[styles.quickPromptPill, { backgroundColor: colors.card, borderColor: colors.border }, loading && { opacity: 0.5 }]} 
            onPress={() => sendMessage(p.text)}
          >
            <Text style={[styles.quickPromptText, { color: colors.text }]}>{p.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Input Bar */}
      <View style={[styles.inputBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <Pressable style={styles.inputAttachButton}>
            <Ionicons name="add-circle" size={22} color="#94a3b8" />
          </Pressable>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder={loading ? "Waiting for response..." : "Ask me anything..."}
            placeholderTextColor={colors.textMuted}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
            editable={!loading} // Khóa input khi AI đang xử lý request
            returnKeyType="send"
            onSubmitEditing={() => sendMessage(message)}
          />
          <Pressable
            style={[styles.sendButton, (message.trim() && !loading) ? styles.sendButtonActive : styles.sendButtonInactive]}
            onPress={() => sendMessage(message)}
            disabled={!message.trim() || loading}
          >
            <Ionicons name="arrow-up" size={18} color={(message.trim() && !loading) ? '#ffffff' : '#94a3b8'} />
          </Pressable>
        </View>
        <Text style={styles.inputHint}>CashBrain AI · Personalized to your finances</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f0f4fb',
  },

  // Header
  header: {
    backgroundColor: '#1a3d7c',
    paddingTop: 14,
    paddingBottom: 16,
    paddingHorizontal: 18,
    overflow: 'hidden',
    shadowColor: '#1a3d7c',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    elevation: 10,
  },
  headerGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -80,
    right: -40,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiAvatarWrap: {
    position: 'relative',
  },
  aiAvatar: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  onlineDot: {
    position: 'absolute',
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#1a3d7c',
    bottom: 0,
    right: 0,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#22c55e',
    marginTop: 2,
  },
  headerAction: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Messages
  messageList: {
    flex: 1,
  },
  messageContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 6,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#dde4ef',
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 10,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  aiBubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#214f95',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    flexShrink: 0,
  },
  bubble: {
    maxWidth: '76%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: '#214f95',
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    shadowColor: '#1e293b',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 21,
  },
  bubbleTextUser: {
    color: '#ffffff',
    fontWeight: '500',
  },
  bubbleTextAI: {
    color: '#1e293b',
    fontWeight: '400',
  },
  bubbleTime: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 5,
    textAlign: 'right',
  },
  bubbleTimeUser: {
    color: 'rgba(255,255,255,0.55)',
  },

  // Smart Insights Card
  insightsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginTop: 12,
    shadowColor: '#1e293b',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 3,
  },
  insightsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  insightsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fdf2f8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#f9a8d4',
  },
  insightsBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ec4899',
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  insightDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    flexShrink: 0,
  },
  insightTextWrap: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  insightDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 17,
  },

  // Quick Prompts
  quickPromptsScroll: {
    flexGrow: 0,
    backgroundColor: '#f0f4fb',
  },
  quickPromptsContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  quickPromptPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#dde4ef',
    marginRight: 2,
    shadowColor: '#1e293b',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  quickPromptText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },

  // Input Bar
  inputBar: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: '#e8edf5',
    shadowColor: '#1e293b',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 10,
    elevation: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f7fc',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#dde4ef',
    paddingHorizontal: 6,
    paddingVertical: 6,
    gap: 6,
  },
  inputAttachButton: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    maxHeight: 90,
    paddingVertical: 6,
    lineHeight: 20,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#214f95',
  },
  sendButtonInactive: {
    backgroundColor: '#e8edf5',
  },
  inputHint: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
});
