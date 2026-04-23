import { useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import MessageBubble from '../components/MessageBubble';
import TransactionConfirmationCard from '../components/TransactionConfirmationCard';
import { parseWithAI } from '../services/aiService';
import { useStore } from '../store/useStore';

export default function AIChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(null);

  const addTransaction = useStore((s) => s.addTransaction);

  const send = async () => {
    const parsed = await parseWithAI(input);

    setMessages((prev) => [...prev, { text: input, sender: 'user' }]);
    setPending(parsed);
    setInput('');
  };

  return (
    <View>
      {messages.map((m, i) => (
        <MessageBubble key={i} message={m} />
      ))}

      {pending && (
        <TransactionConfirmationCard
          data={pending}
          onConfirm={() => {
            addTransaction(pending);
            setPending(null);
          }}
        />
      )}

      <TextInput value={input} onChangeText={setInput} />
      <Button title="Send" onPress={send} />
    </View>
  );
}