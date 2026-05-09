import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarModal: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayCell: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 18,
  },
  dayCellSelected: {
    backgroundColor: '#1C4D8D',
  },
  dayCellText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  todayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [date, setDate] = useState('Today');
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(dayjs().startOf('month'));

  const formatDateLabel = (d: Date) => {
    const today = dayjs();
    const target = dayjs(d);
    if (today.isSame(target, 'day')) return 'Today';
    return target.format('MMM D');
  };

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
            <Pressable style={[styles.input, { justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }]} onPress={() => setShowCalendar(true)}>
              <Text style={{ color: date === 'Today' ? '#0f172a' : '#0f172a' }}>{date}</Text>
              <Ionicons name="calendar-outline" size={18} color="#64748b" />
            </Pressable>

            <Modal visible={showCalendar} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.calendarModal}>
                  <View style={styles.calendarHeader}>
                    <TouchableOpacity onPress={() => setCalendarMonth(calendarMonth.subtract(1, 'month'))}>
                      <Ionicons name="chevron-back" size={22} color="#1C4D8D" />
                    </TouchableOpacity>
                    <Text style={styles.monthText}>{calendarMonth.format('MMMM YYYY')}</Text>
                    <TouchableOpacity onPress={() => setCalendarMonth(calendarMonth.add(1, 'month'))}>
                      <Ionicons name="chevron-forward" size={22} color="#1C4D8D" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.weekRow}>
                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((w) => (
                      <Text key={w} style={{ width: 36, textAlign: 'center', color: '#64748b', fontWeight: '700' }}>{w}</Text>
                    ))}
                  </View>

                  {/* days grid */}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {(() => {
                      const startDay = calendarMonth.startOf('month').day();
                      const daysInMonth = calendarMonth.daysInMonth();
                      const blanks = Array.from({ length: startDay }).map((_, i) => (<View key={`b${i}`} style={{ width: 36, height: 36 }} />));
                      const days = Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayNum = i + 1;
                        const dt = calendarMonth.date(dayNum);
                        const isSelected = dayjs(selectedDate).isSame(dt, 'day');
                        return (
                          <Pressable key={dayNum} style={[styles.dayCell, isSelected && styles.dayCellSelected]} onPress={() => {
                            const newDate = dt.toDate();
                            setSelectedDate(newDate);
                            setDate(formatDateLabel(newDate));
                            setShowCalendar(false);
                          }}>
                            <Text style={[styles.dayCellText, isSelected && { color: '#fff' }]}>{dayNum}</Text>
                          </Pressable>
                        );
                      });
                      return [...blanks, ...days];
                    })()}
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                    <Pressable onPress={() => { const today = new Date(); setSelectedDate(today); setDate(formatDateLabel(today)); setShowCalendar(false); }} style={styles.todayButton}>
                      <Text style={{ color: '#1C4D8D', fontWeight: '700' }}>Today</Text>
                    </Pressable>
                    <Pressable onPress={() => setShowCalendar(false)} style={styles.todayButton}>
                      <Text style={{ color: '#64748b' }}>Cancel</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
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
