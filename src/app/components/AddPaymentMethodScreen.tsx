import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../context/ThemeContext';

interface AddPaymentMethodScreenProps {
  onBack: () => void;
  onSave: (method: any) => void;
}

export function AddPaymentMethodScreen({ onBack, onSave }: AddPaymentMethodScreenProps) {
  const colors = useColors();
  const [type, setType] = useState<'card' | 'bank'>('card');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [bankName, setBankName] = useState('');
  const [isBankModalVisible, setIsBankModalVisible] = useState(false);

  const POPULAR_BANKS = [
    'Vietcombank',
    'BIDV',
    'Techcombank',
    'TPBank',
    'VietinBank',
    'Agribank',
    'MBBank',
    'Sacombank',
    'VIB',
    'ACB',
  ];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={[styles.headerButtonText, { color: colors.textMuted }]}>Cancel</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Add Payment Method</Text>
        <Pressable onPress={() => {
          onSave({ type, name, number, expiry, bankName });
        }} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.tabsWrap}>
          <Pressable
            style={[styles.tabButton, type === 'card' && styles.tabButtonActive]}
            onPress={() => setType('card')}
          >
            <Text style={[styles.tabText, type === 'card' && styles.tabTextActive, { color: type === 'card' ? '#ffffff' : colors.textMuted }]}>
              Credit/Debit Card
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabButton, type === 'bank' && styles.tabButtonActive]}
            onPress={() => setType('bank')}
          >
            <Text style={[styles.tabText, type === 'bank' && styles.tabTextActive, { color: type === 'bank' ? '#ffffff' : colors.textMuted }]}>
              Bank Account
            </Text>
          </Pressable>
        </View>

        <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {type === 'card' ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textMuted }]}>Cardholder Name</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
                  placeholder="Ngan Tran"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={setName}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textMuted }]}>Card Number</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
                  placeholder="**** **** **** ****"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={number}
                  onChangeText={setNumber}
                />
              </View>
              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.label, { color: colors.textMuted }]}>Expiry Date</Text>
                  <TextInput
                    style={[styles.input, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
                    placeholder="MM/YY"
                    placeholderTextColor={colors.textMuted}
                    value={expiry}
                    onChangeText={setExpiry}
                  />
                </View>
                <View style={{ width: 16 }} />
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.label, { color: colors.textMuted }]}>CVV</Text>
                  <TextInput
                    style={[styles.input, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
                    placeholder="123"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                    secureTextEntry
                    value={cvv}
                    onChangeText={setCvv}
                  />
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textMuted }]}>Bank Name</Text>
                <Pressable
                  style={[styles.input, { justifyContent: 'center', backgroundColor: colors.inputBg, borderColor: colors.border }]}
                  onPress={() => setIsBankModalVisible(true)}
                >
                  <Text style={{ color: bankName ? colors.text : colors.textMuted, fontSize: 15, fontWeight: '600' }}>
                    {bankName || 'Select a Bank'}
                  </Text>
                </Pressable>
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textMuted }]}>Account Name</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
                  placeholder="Ngan Tran"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={setName}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textMuted }]}>Account Number</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
                  placeholder="0123456789"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={number}
                  onChangeText={setNumber}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Bank Selection Modal */}
      <Modal visible={isBankModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Bank</Text>
              <Pressable onPress={() => setIsBankModalVisible(false)} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>
            <FlatList
              data={POPULAR_BANKS}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.bankListItem, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    setBankName(item);
                    setIsBankModalVisible(false);
                  }}
                >
                  <Text style={[styles.bankListText, { color: colors.text }]}>{item}</Text>
                  {bankName === item && <Ionicons name="checkmark" size={20} color="#1C4D8D" />}
                </TouchableOpacity>
              )}
            />
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
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  saveButton: {
    padding: 8,
    marginRight: -8,
  },
  saveButtonText: {
    color: '#1C4D8D',
    fontWeight: '800',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabsWrap: {
    flexDirection: 'row',
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f1f5f9',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#1C4D8D',
    shadowColor: '#1C4D8D',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    fontWeight: '700',
  },
  form: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
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
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalCloseButton: {
    padding: 4,
  },
  bankListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  bankListText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
