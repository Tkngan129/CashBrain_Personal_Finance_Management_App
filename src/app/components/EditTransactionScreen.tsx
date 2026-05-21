import { useExpenses } from '@/src/context/expenseContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { resolveCategoryMeta } from '../../../constants/categories';
import { useColors } from '../../context/ThemeContext';
import { Transaction } from './TransactionDetailScreen';

interface EditTransactionScreenProps {
  transaction: Transaction;
  onCancel: () => void;
  onSave: (updatedTx: Transaction) => void;
}

export function EditTransactionScreen({ transaction, onCancel, onSave }: EditTransactionScreenProps) {
  const colors = useColors();
  
  const [title, setTitle] = useState(transaction.title || transaction.note || '');
  const [amount, setAmount] = useState(Math.abs(transaction.amount).toString());
  const [date, setDate] = useState(transaction.date);
  const [time, setTime] = useState(transaction.time || '');
  const [category, setCategory] = useState(transaction.category_name);
  const [type, setType] = useState<'expense' | 'income'>(transaction.type === "Income" ? 'income' : 'expense');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  const [pickerDate, setPickerDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedCategoryID, setSelectedCategoryID] = useState<string>("");

  const { expenseCategories, fetchExpensesCategories } = useExpenses();

  useEffect( () => {
    fetchExpensesCategories();
  }, []);

  const handleDateConfirm = (selectedDate: Date) => {
    setShowDatePicker(false);
    setPickerDate(selectedDate);
    setDate(selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  };

  const handleTimeConfirm = (selectedTime: Date) => {
    setShowTimePicker(false);
    setPickerDate(selectedTime);
    setTime(selectedTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
  };

  useEffect(() => {
    if (type === 'expense' && ['Salary', 'Freelance', 'Income'].includes(category)) {
      setCategory('Miscellaneous');
    } else if (type === 'income' && !['Salary', 'Freelance', 'Income'].includes(category)) {
      setCategory('Income');
    }
  }, [type]);

  const handleSave = () => {
    const numAmount = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0;

    const finalAmount =
      type === 'expense' ? -numAmount : numAmount;

    onSave({
      ...transaction,
      title,
      amount: finalAmount,
      date,
      time,
      category_name: category,
      category_id:
        transaction.type !== "Income"
          ? selectedCategoryID
          : "null",
    });
  };

  const currentCategoryMeta = resolveCategoryMeta(category);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={onCancel} style={styles.headerButton}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Transaction</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Type Toggle */}
          <View style={[styles.typeToggle, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Pressable
              style={[styles.typeButton, type === 'expense' && styles.typeButtonExpense]}
              onPress={() => setType('expense')}
            >
              <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive, { color: type === 'expense' ? '#ffffff' : colors.textMuted }]}>Expense</Text>
            </Pressable>
            <Pressable
              style={[styles.typeButton, type === 'income' && styles.typeButtonIncome]}
              onPress={() => setType('income')}
            >
              <Text style={[styles.typeText, type === 'income' && styles.typeTextActive, { color: type === 'income' ? '#ffffff' : colors.textMuted }]}>Income</Text>
            </Pressable>
          </View>

          {/* Amount */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textMuted }]}>Amount</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Text style={[styles.currencySymbol, { color: type === 'income' ? '#1ca34a' : '#ef4444' }]}>
                {type === 'income' ? '+' : '-'}
              </Text>
              <TextInput
                style={[styles.amountInput, { color: colors.text }]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.textMuted}
              />
              <Text style={[styles.currencySuffix, { color: colors.textMuted }]}>VND</Text>
            </View>
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textMuted }]}>Category</Text>
            <Pressable 
              style={[styles.categoryPicker, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
              onPress={() => setShowCategoryModal(true)}
            >
              <View style={[styles.categoryIconWrap, { backgroundColor: currentCategoryMeta.bgColor }]}>
                <Ionicons name={currentCategoryMeta.icon as any} size={18} color={currentCategoryMeta.color} />
              </View>
              <Text style={[styles.categoryText, { color: colors.text }]}>{currentCategoryMeta.label}</Text>
              <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
            </Pressable>
          </View>

          {/* Title / Note */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textMuted }]}>Title / Note</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Ionicons name="document-text-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={title}
                onChangeText={setTitle}
                placeholder="What was this for?"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          {/* Date & Time Row */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Date</Text>
              <Pressable 
                style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <Text style={[{ flex: 1, fontSize: 16, fontWeight: '600' }, { color: date ? colors.text : colors.textMuted }]}>
                  {date || 'e.g. Apr 10'}
                </Text>
              </Pressable>
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Time</Text>
              <Pressable 
                style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <Text style={[{ flex: 1, fontSize: 16, fontWeight: '600' }, { color: time ? colors.text : colors.textMuted }]}>
                  {time || 'e.g. 2:15 PM'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        date={pickerDate}
        onConfirm={handleDateConfirm}
        onCancel={() => setShowDatePicker(false)}
        display={Platform.OS === 'ios' ? 'inline' : 'default'}
        locale="en_US"
      />
      <DateTimePickerModal
        isVisible={showTimePicker}
        mode="time"
        date={pickerDate}
        onConfirm={handleTimeConfirm}
        onCancel={() => setShowTimePicker(false)}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        is24Hour={false}
        locale="en_US"
        pickerContainerStyleIOS={{ alignItems: 'center', justifyContent: 'center' }}
      />

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <Pressable style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </Pressable>
      </View>

      {/* Category Modal */}
      <Modal visible={showCategoryModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Category</Text>
              <Pressable onPress={() => setShowCategoryModal(false)} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {type === 'expense' ? (
                expenseCategories.map((group) => (
                  <View key={group.id} style={styles.modalGroup}>
                    <Text style={[styles.modalGroupTitle, { color: colors.textMuted }]}>{group.title}</Text>
                    {group.categories.map((cat) => (
                      <Pressable 
                        key={cat.id} 
                        style={styles.modalCategoryItem}
                        onPress={() => {
                          setCategory(cat.label);
                          setShowCategoryModal(false);
                          setSelectedCategoryID(cat.id)
                        }}
                      >
                        <View style={[styles.modalCategoryIcon, { backgroundColor: group.bgColor }]}>
                          <Ionicons name={cat.icon as any} size={20} color={cat.color} />
                        </View>
                        <Text style={[styles.modalCategoryText, { color: colors.text }]}>{cat.label}</Text>
                        {category === cat.label && <Ionicons name="checkmark" size={20} color="#1C4D8D" />}
                      </Pressable>
                    ))}
                  </View>
                ))
              ) : (
                <View style={styles.modalGroup}>
                  <Text style={[styles.modalGroupTitle, { color: colors.textMuted }]}>INCOME SOURCES</Text>
                  <Pressable 
                    style={styles.modalCategoryItem}
                    onPress={() => {
                      setCategory('Income');
                      setShowCategoryModal(false);
                    }}
                  >
                    <View style={[styles.modalCategoryIcon, { backgroundColor: '#f0fdfa' }]}>
                      <Ionicons name="cash-outline" size={20} color="#0d9488" />
                    </View>
                    <Text style={[styles.modalCategoryText, { color: colors.text }]}>Main Income</Text>
                    {category === 'Income' && <Ionicons name="checkmark" size={20} color="#1C4D8D" />}
                  </Pressable>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    elevation: 4,
    shadowColor: '#1e293b',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  headerButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 20,
  },
  typeToggle: {
    flexDirection: 'row',
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
    marginBottom: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  typeButtonExpense: {
    backgroundColor: '#ef4444',
  },
  typeButtonIncome: {
    backgroundColor: '#1ca34a',
  },
  typeText: {
    fontSize: 15,
    fontWeight: '600',
  },
  typeTextActive: {
    fontWeight: '800',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    height: '100%',
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '800',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    height: '100%',
  },
  currencySuffix: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  categoryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    height: 64,
    paddingHorizontal: 16,
  },
  categoryIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 16,
    borderRadius: 16,
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '700',
  },
  saveButton: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C4D8D',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#1C4D8D',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  modalGroup: {
    marginTop: 24,
  },
  modalGroupTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  modalCategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalCategoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalCategoryText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
});
