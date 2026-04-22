import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MessageBubble from '../components/MessageBubble';
import TransactionConfirmationCard from '../components/TransactionConfirmationCard';
import TypingIndicator from '../components/TypingIndicator';
import { useFinance } from '../context/FinanceContext';
import { parseExpenseMessage } from '../utils/parseExpenseMessage';

const AIChatScreen = () => {
  const { addTransaction } = useFinance();
  const [messages, setMessages] = useState([
    { id: '1', text: 'Xin chào! Tôi là AI Finance Assistant. Bạn chi tiêu gì hôm nay?', isUser: false },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState(null);
  const flatListRef = useRef();

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now().toString(), text: input, isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    flatListRef.current?.scrollToEnd();

    // Simulate AI thinking
    setIsTyping(true);

    setTimeout(() => {
      const parsed = parseExpenseMessage(input);
      setIsTyping(false);

      if (parsed) {
        setPendingTransaction(parsed);
        const aiMsg = {
          id: (Date.now() + 1).toString(),
          text: `Tôi hiểu bạn ${parsed.type === 'expense' ? 'đã chi' : 'nhận'} ${parsed.amount} cho "${parsed.description}". Xác nhận nhé?`,
          isUser: false,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const aiMsg = {
          id: (Date.now() + 1).toString(),
          text: 'Tôi chưa hiểu rõ. Bạn có thể nói rõ hơn không? Ví dụ: "Tôi mua sinh tố 15k"',
          isUser: false,
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
      flatListRef.current?.scrollToEnd();
    }, 1200);
  };

  const handleConfirmTransaction = () => {
    if (pendingTransaction) {
      addTransaction({
        id: Date.now().toString(),
        ...pendingTransaction,
        date: new Date().toISOString(),
      });
      setPendingTransaction(null);
      const successMsg = { id: Date.now().toString(), text: '✅ Giao dịch đã được ghi nhận!', isUser: false };
      setMessages((prev) => [...prev, successMsg]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#e8f0fb', '#f4f8ff', '#e0f3f7']} style={styles.gradient}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageBubble message={item} />}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          />

          {isTyping && <TypingIndicator />}

          {pendingTransaction && (
            <TransactionConfirmationCard
              transaction={pendingTransaction}
              onConfirm={handleConfirmTransaction}
              onCancel={() => setPendingTransaction(null)}
            />
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nói với AI ví dụ: Tôi mua cà phê 25k"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendText}>Gửi</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  gradient: { flex: 1 },
  container: { flex: 1 },
  messageList: { padding: 16, paddingBottom: 100 },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.92)',
    margin: 12,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: 'center',
    shadowColor: '#1C4D8D',
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  input: { flex: 1, fontSize: 16, paddingVertical: 8 },
  sendButton: { backgroundColor: '#1C4D8D', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999 },
  sendText: { color: '#fff', fontWeight: '600' },
});

export default AIChatScreen;

