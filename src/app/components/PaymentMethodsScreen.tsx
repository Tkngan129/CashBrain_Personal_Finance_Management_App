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

interface PaymentMethodsScreenProps {
  onBack: () => void;
}

export function PaymentMethodsScreen({ onBack }: PaymentMethodsScreenProps) {
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
        <Pressable style={styles.addButton}>
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

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'cards' ? (
          <View style={styles.list}>
            <View style={[styles.card, { backgroundColor: '#1C4D8D', borderColor: '#1C4D8D' }]}>
              <View style={styles.cardTop}>
                <Ionicons name="logo-apple" size={24} color="#ffffff" />
                <Text style={styles.cardType}>Visa</Text>
              </View>
              <Text style={styles.cardNumber}>**** **** **** 1234</Text>
              <View style={styles.cardBottom}>
                <Text style={styles.cardHolder}>Ngan Tran</Text>
                <Text style={styles.cardExpiry}>12/28</Text>
              </View>
            </View>
            
            <View style={[styles.card, { backgroundColor: '#f43f5e', borderColor: '#f43f5e' }]}>
              <View style={styles.cardTop}>
                <Ionicons name="wallet-outline" size={24} color="#ffffff" />
                <Text style={styles.cardType}>MasterCard</Text>
              </View>
              <Text style={styles.cardNumber}>**** **** **** 9876</Text>
              <View style={styles.cardBottom}>
                <Text style={styles.cardHolder}>Ngan Tran</Text>
                <Text style={styles.cardExpiry}>05/27</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.list}>
            <View style={[styles.accountCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <View style={[styles.iconWrap, { backgroundColor: '#ecfdf5' }]}>
                <Ionicons name="business" size={20} color="#22c55e" />
              </View>
              <View style={styles.accountInfo}>
                <Text style={[styles.accountName, { color: colors.text }]}>Vietcombank</Text>
                <Text style={[styles.accountDetail, { color: colors.textMuted }]}>Checking · ***4567</Text>
              </View>
              <Ionicons name="ellipsis-horizontal" size={20} color={colors.textMuted} />
            </View>
          </View>
        )}
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
