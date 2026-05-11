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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../context/ThemeContext';

interface BudgetSettingsScreenProps {
  onBack: () => void;
  initialBudget?: number;
  onSaveBudget?: (budget: number) => void;
}

export function BudgetSettingsScreen({ onBack, initialBudget = 4000000, onSaveBudget }: BudgetSettingsScreenProps) {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');

  const [monthlyLimit, setMonthlyLimit] = useState((initialBudget).toLocaleString('en-US'));
  const [yearlyLimit, setYearlyLimit] = useState((initialBudget * 12).toLocaleString('en-US'));

  const handleLimitChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (!numericText) {
      activeTab === 'monthly' ? setMonthlyLimit('') : setYearlyLimit('');
      return;
    }
    const formatted = parseInt(numericText, 10).toLocaleString('en-US'); // en-US uses commas
    if (activeTab === 'monthly') {
      setMonthlyLimit(formatted);
    } else {
      setYearlyLimit(formatted);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Budget Settings</Text>
        <Pressable style={styles.saveButton} onPress={() => {
          const raw = activeTab === 'monthly' ? monthlyLimit : yearlyLimit;
          const numericValue = parseInt(raw.replace(/[^0-9]/g, ''), 10) || 0;
          const finalMonthly = activeTab === 'monthly' ? numericValue : Math.round(numericValue / 12);
          onSaveBudget?.(finalMonthly);
          onBack();
        }}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={[styles.tabsWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <Pressable
            style={[styles.tabButton, activeTab === 'monthly' && styles.tabButtonActive]}
            onPress={() => setActiveTab('monthly')}
          >
            <Text style={[styles.tabText, activeTab === 'monthly' && styles.tabTextActive, { color: activeTab === 'monthly' ? '#ffffff' : colors.textMuted }]}>
              Monthly Budget
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabButton, activeTab === 'yearly' && styles.tabButtonActive]}
            onPress={() => setActiveTab('yearly')}
          >
            <Text style={[styles.tabText, activeTab === 'yearly' && styles.tabTextActive, { color: activeTab === 'yearly' ? '#ffffff' : colors.textMuted }]}>
              Yearly Budget
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrap, { backgroundColor: '#eff6ff' }]}>
                <Ionicons name="wallet-outline" size={20} color="#3b82f6" />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Total Limit</Text>
            </View>
            <View style={styles.inputGroup}>
              <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Text style={[styles.currencySymbol, { color: colors.text }]}>VND</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={activeTab === 'monthly' ? monthlyLimit : yearlyLimit}
                  onChangeText={handleLimitChange}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>ALERTS</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={[styles.alertRow, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
              <Text style={[styles.alertText, { color: colors.text }]}>Warn me at 50%</Text>
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
            </View>
            <View style={[styles.alertRow, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
              <Text style={[styles.alertText, { color: colors.text }]}>Warn me at 80%</Text>
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
            </View>
            <View style={styles.alertRow}>
              <Text style={[styles.alertText, { color: colors.text }]}>Warn me at 100%</Text>
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
            </View>
          </View>
        </View>
      </ScrollView>
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
  tabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  tabsWrap: {
    flexDirection: 'row',
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
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
  content: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 20,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#1e293b',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  inputGroup: {
    gap: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    height: 60,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '800',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    height: '100%',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginLeft: 8,
    marginTop: 8,
  },
  alertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  alertText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
