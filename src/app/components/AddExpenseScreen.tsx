import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(28,77,141,0.08)',
    shadowColor: '#1C4D8D',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1a202c',
    backgroundColor: '#f8fafc',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  flex1: {
    flex: 1,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  categoryButtonActive: {
    borderColor: '#1C4D8D',
    backgroundColor: '#EEF4FF',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  categoryLabelActive: {
    color: '#1C4D8D',
  },
  button: {
    backgroundColor: '#1C4D8D',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});

interface AddExpenseScreenProps {
  onClose?: () => void;
  initialType?: 'expense' | 'income';
}

const categories = [
  { id: 'food', label: 'Food', icon: '🍔' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { id: 'utilities', label: 'Utilities', icon: '💡' },
];

export function AddExpenseScreen({ onClose, initialType = 'expense' }: AddExpenseScreenProps) {
  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [date, setDate] = useState('Today');

  const handleSubmit = () => {
    if (amount && description) {
      // Handle submission (e.g., save to context)
      onClose?.();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{type === 'expense' ? 'Add Expense' : 'Add Income'}</Text>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={18} color="#64748b" />
        </Pressable>
      </View>

      <View style={styles.content}>
        {/* Type Toggle */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable
                style={[
                  { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
                  type === 'expense' && { backgroundColor: '#fee2e2' },
                ]}
                onPress={() => setType('expense')}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: type === 'expense' ? '#ef4444' : '#94a3b8' }}>
                  Expense
                </Text>
              </Pressable>
              <Pressable
                style={[
                  { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
                  type === 'income' && { backgroundColor: '#f0fdf4' },
                ]}
                onPress={() => setType('income')}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: type === 'income' ? '#22c55e' : '#94a3b8' }}>
                  Income
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Amount (VND)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor="#cbd5e1"
              keyboardType="number-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, { minHeight: 80, paddingTop: 12 }]}
              placeholder="What was this for?"
              placeholderTextColor="#cbd5e1"
              multiline
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </View>

        {/* Category */}
        {type === 'expense' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.card}>
              <View style={styles.categoryGrid}>
                {categories.map((cat) => (
                  <Pressable
                    key={cat.id}
                    style={[styles.categoryButton, selectedCategory === cat.id && styles.categoryButtonActive]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                    <Text style={[styles.categoryLabel, selectedCategory === cat.id && styles.categoryLabelActive]}>
                      {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Date */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Date</Text>
            <TextInput
              style={styles.input}
              placeholder="Today"
              placeholderTextColor="#cbd5e1"
              value={date}
              onChangeText={setDate}
            />
          </View>
        </View>

        {/* Submit Button */}
        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add {type === 'expense' ? 'Expense' : 'Income'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
