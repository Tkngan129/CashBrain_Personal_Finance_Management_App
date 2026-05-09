import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerGreeting: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
    marginBottom: 2,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a202c',
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginVertical: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(28,77,141,0.08)',
    shadowColor: '#1C4D8D',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 12,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  budgetValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C4D8D',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1C4D8D',
    borderRadius: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#94a3b8',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a202c',
    marginLeft: 8,
  },
});

const TOTAL_BUDGET = 4_000_000;
const TOTAL_SPENT = 719_000;
const REMAINING = TOTAL_BUDGET - TOTAL_SPENT;
const SPENT_PCT = Math.round((TOTAL_SPENT / TOTAL_BUDGET) * 100);
const REMAINING_PCT = 100 - SPENT_PCT;

const recentTransactions = [
  { id: 1, title: 'Coffee & Breakfast', category: 'Food', amount: -45_000, icon: '☕', color: '#fee2e2' },
  { id: 2, title: 'Online Course', category: 'Education', amount: -399_000, icon: '🎓', color: '#faf5ff' },
  { id: 3, title: 'Monthly Allowance', category: 'Income', amount: 4_000_000, icon: '💳', color: '#f0fdf4' },
  { id: 4, title: 'New Clothes', category: 'Shopping', amount: -250_000, icon: '🛍️', color: '#fff7ed' },
  { id: 5, title: 'Grab to Uni', category: 'Transport', amount: -25_000, icon: '🚗', color: '#fefce8' },
];

const fmtVND = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.abs(n));

interface DashboardScreenProps {
  onNavigate?: (screen: string) => void;
  onAddTransaction?: (type: 'expense' | 'income') => void;
}

export function DashboardScreen({ onNavigate, onAddTransaction }: DashboardScreenProps) {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerGreeting}>Good morning 👋</Text>
          <Text style={styles.headerName}>Ngan Tran</Text>
        </View>
        <Pressable style={styles.notificationButton}>
          <Ionicons name="notifications" size={18} color="#64748b" />
        </Pressable>
      </View>

      <View style={styles.content}>
        {/* Budget Card */}
        <View style={styles.card}>
          <View style={styles.budgetRow}>
            <View>
              <Text style={styles.cardTitle}>April Budget</Text>
              <Text style={styles.cardSubtitle}>{fmtVND(TOTAL_BUDGET)} total</Text>
            </View>
            <View style={{ backgroundColor: '#EEF4FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#1C4D8D' }}>{REMAINING_PCT}% left</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${REMAINING_PCT}%` },
              ]}
            />
          </View>
          <Text style={{ fontSize: 12, color: '#94a3b8' }}>
            <Text style={{ fontWeight: '600', color: '#64748b' }}>{fmtVND(TOTAL_SPENT)} spent</Text>
            {' • '}
            <Text style={{ fontWeight: '600', color: '#1C4D8D' }}>{fmtVND(REMAINING)} remaining</Text>
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable
            style={styles.actionButton}
            onPress={() => onAddTransaction?.('expense')}
          >
            <Ionicons name="arrow-up" size={16} color="#ef4444" />
            <Text style={styles.actionButtonText}>Expense</Text>
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => onAddTransaction?.('income')}
          >
            <Ionicons name="arrow-down" size={16} color="#22c55e" />
            <Text style={styles.actionButtonText}>Income</Text>
          </Pressable>
        </View>

        {/* Recent Transactions */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={styles.cardTitle}>Recent Transactions</Text>
            <Pressable onPress={() => onNavigate?.('analytics')}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#1C4D8D' }}>View all</Text>
            </Pressable>
          </View>
          {recentTransactions.map((tx) => (
            <View key={tx.id} style={styles.transactionItem}>
              <View style={[styles.transactionIcon, { backgroundColor: tx.color }]}>
                <Text style={{ fontSize: 20 }}>{tx.icon}</Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{tx.title}</Text>
                <Text style={styles.transactionCategory}>{tx.category}</Text>
              </View>
              <Text style={[styles.transactionAmount, { color: tx.amount > 0 ? '#22c55e' : '#64748b' }]}>
                {tx.amount > 0 ? '+' : ''}{fmtVND(tx.amount)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
