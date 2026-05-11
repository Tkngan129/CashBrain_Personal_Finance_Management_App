import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../context/ThemeContext';

export type PaymentMethod = {
  id: string;
  type: 'card' | 'bank';
  name: string; // cardholder or account name
  number: string;
  expiry?: string;
  cvv?: string;
  bankName?: string;
  cardBrand?: string;
  color?: string;
};

interface PaymentMethodsScreenProps {
  onBack: () => void;
  onAddPayment?: () => void;
  paymentMethods?: PaymentMethod[];
}

export function PaymentMethodsScreen({ onBack, onAddPayment, paymentMethods = [] }: PaymentMethodsScreenProps) {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<'cards' | 'accounts'>('cards');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Payment Methods</Text>
        <Pressable style={styles.addButton} onPress={onAddPayment}>
          <Ionicons name="add" size={24} color="#1C4D8D" />
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={[styles.tabsWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <Pressable
            style={[styles.tabButton, activeTab === 'cards' && styles.tabButtonActive]}
            onPress={() => setActiveTab('cards')}
          >
            <Text style={[styles.tabText, activeTab === 'cards' && styles.tabTextActive, { color: activeTab === 'cards' ? '#ffffff' : colors.textMuted }]}>
              Cards
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabButton, activeTab === 'accounts' && styles.tabButtonActive]}
            onPress={() => setActiveTab('accounts')}
          >
            <Text style={[styles.tabText, activeTab === 'accounts' && styles.tabTextActive, { color: activeTab === 'accounts' ? '#ffffff' : colors.textMuted }]}>
              Bank Accounts
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {activeTab === 'cards' 
            ? paymentMethods.filter(p => p.type === 'card').map(card => (
                <View key={card.id} style={[styles.card, { backgroundColor: card.color || '#1C4D8D', borderColor: card.color || '#1C4D8D' }]}>
                  <View style={styles.cardTop}>
                    <Ionicons name={card.cardBrand === 'Visa' ? 'logo-apple' : 'wallet-outline'} size={24} color="#ffffff" />
                    <Text style={styles.cardType}>{card.cardBrand || 'Card'}</Text>
                  </View>
                  <Text style={styles.cardNumber}>**** **** **** {card.number.slice(-4) || '0000'}</Text>
                  <View style={styles.cardBottom}>
                    <Text style={styles.cardHolder}>{card.name}</Text>
                    <Text style={styles.cardExpiry}>{card.expiry}</Text>
                  </View>
                </View>
              ))
            : paymentMethods.filter(p => p.type === 'bank').map(bank => (
                <View key={bank.id} style={[styles.accountCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                  <View style={[styles.iconWrap, { backgroundColor: '#ecfdf5' }]}>
                    <Ionicons name="business" size={20} color="#22c55e" />
                  </View>
                  <View style={styles.accountInfo}>
                    <Text style={[styles.accountName, { color: colors.text }]}>{bank.bankName}</Text>
                    <Text style={[styles.accountDetail, { color: colors.textMuted }]}>Checking · ***{bank.number.slice(-4) || '0000'}</Text>
                  </View>
                  <Ionicons name="ellipsis-horizontal" size={20} color={colors.textMuted} />
                </View>
              ))
          }
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
  addButton: {
    padding: 8,
    marginRight: -8,
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
    gap: 16,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#1e293b',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 4,
    height: 180,
    justifyContent: 'space-between',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    fontStyle: 'italic',
  },
  cardNumber: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 2,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHolder: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardExpiry: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  accountDetail: {
    fontSize: 13,
    fontWeight: '500',
  },
});
