import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const TOTAL_BUDGET = 4_000_000;
const TOTAL_SPENT = 719_000;
const REMAINING = TOTAL_BUDGET - TOTAL_SPENT;
const REMAINING_PCT = Math.round((REMAINING / TOTAL_BUDGET) * 100);

const recentTransactions = [
  { id: 1, title: 'Coffee & Breakfast', category: 'Food', amount: -45000, date: '2026-05-09', time: '09:30', icon: '☕', color: '#fff1f2' },
  { id: 2, title: 'Online Course', category: 'Education', amount: -399000, date: '2026-05-08', time: '14:15', icon: '🎓', color: '#f5f3ff' },
  { id: 3, title: 'Monthly Allowance', category: 'Income', amount: 4000000, date: '2026-04-30', time: '08:00', icon: '💳', color: '#ecfdf5' },
  { id: 4, title: 'Grab to Uni', category: 'Transport', amount: -25000, date: '2026-04-09', time: '08:30', icon: '🚗', color: '#fffce8' },
  { id: 5, title: 'New Clothes', category: 'Shopping', amount: -250000, date: '2026-04-09', time: '15:45', icon: '🛍️', color: '#fff7ed' },
  { id: 6, title: 'Coffee & Breakfast', category: 'Food', amount: -45000, date: '2026-04-11', time: '09:30', icon: '☕', color: '#fff1f2' },
];

const weekData = [
  { day: 'Mon', amount: 24_000, active: false },
  { day: 'Tue', amount: 8_000, active: false },
  { day: 'Wed', amount: 58_000, active: false },
  { day: 'Thu', amount: 18_000, active: false },
  { day: 'Fri', amount: 80_000, active: true },
  { day: 'Sat', amount: 12_000, active: false },
  { day: 'Sun', amount: 9_000, active: false },
];

interface DashboardScreenProps {
  onNavigate?: (screen: string) => void;
  onAddTransaction?: (type: 'expense' | 'income') => void;
}

const formatVND = (value: number) => `${new Intl.NumberFormat('vi-VN').format(Math.abs(value))} VND`;

export function DashboardScreen({ onNavigate, onAddTransaction }: DashboardScreenProps) {

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning 👋</Text>
          <Text style={styles.name}>Ngan Tran</Text>
        </View>
        <Pressable style={styles.notificationButton} onPress={() => onNavigate?.('transactions')}>
          <Ionicons name="notifications-outline" size={20} color="#64748b" />
        </Pressable>
      </View>

      <View style={styles.balanceCard}>
        <View style={styles.balanceGlowTopRight} />
        <View style={styles.balanceGlowBottomLeft} />

        <View style={styles.balanceTopRow}>
          <View style={styles.balanceTextBlock}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>{formatVND(REMAINING)}</Text>
            <View style={styles.trendRow}>
              <Ionicons name="trending-up-outline" size={16} color="#a9d5ff" />
              <Text style={styles.trendText}>+8.2% this month</Text>
            </View>
          </View>
          <View style={styles.walletBadge}>
            <Ionicons name="wallet-outline" size={25} color="#ffffff" />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#57b48d' }]}>
              <Ionicons name="arrow-up" size={18} color="#ffffff" />
            </View>
            <Text style={styles.statLabel}>Income</Text>
            <Text style={styles.statAmount}>{formatVND(TOTAL_BUDGET).replace(' VND', '')}</Text>
            <Text style={styles.statCurrency}>VND</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#c28c5e' }]}>
              <Ionicons name="arrow-down" size={18} color="#ffffff" />
            </View>
            <Text style={styles.statLabel}>Expenses</Text>
            <Text style={styles.statAmount}>{formatVND(TOTAL_SPENT).replace(' VND', '')}</Text>
            <Text style={styles.statCurrency}>VND</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActionsRow}>
        <Pressable style={[styles.quickAction, styles.quickActionExpense]} onPress={() => onAddTransaction?.('expense')}>
          <View style={styles.quickActionIcon}>
            <Ionicons name="cash-outline" size={21} color="#ffffff" />
          </View>
          <Text style={styles.quickActionText}>Add Expense</Text>
        </Pressable>
        <Pressable style={[styles.quickAction, styles.quickActionIncome]} onPress={() => onAddTransaction?.('income')}>
          <View style={[styles.quickActionIcon, styles.quickActionIconIncome]}>
            <Ionicons name="wallet-outline" size={20} color="#22c55e" />
          </View>
          <Text style={[styles.quickActionText, styles.quickActionTextIncome]}>Add Income</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>April Budget</Text>
            <Text style={styles.sectionSubtitle}>{formatVND(TOTAL_BUDGET)} total</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{REMAINING_PCT}% left</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${REMAINING_PCT}%` }]} />
        </View>
        <Text style={styles.budgetSummary}>
          <Text style={styles.budgetSpent}>{formatVND(TOTAL_SPENT)} spent</Text>
          <Text style={styles.budgetDot}>  •  </Text>
          <Text style={styles.budgetRemaining}>{formatVND(REMAINING)} remaining</Text>
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>This Week</Text>
            <Text style={styles.sectionSubtitle}>Daily spending overview</Text>
          </View>
          <Pressable style={styles.linkRow} onPress={() => onNavigate?.('analytics')}>
            <Text style={styles.linkText}>Full report</Text>
            <Ionicons name="chevron-forward" size={16} color="#1C4D8D" />
          </Pressable>
        </View>

        <View style={styles.chartRow}>
          {weekData.map((item) => {
            const barHeight = Math.max(14, Math.round((item.amount / 80_000) * 102));
            return (
              <View key={item.day} style={styles.chartColumn}>
                <View style={styles.barTrack}>
                  <View style={[styles.bar, item.active && styles.barActive, { height: barHeight }]} />
                </View>
                <Text style={styles.chartDay}>{item.day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <Pressable style={styles.insightCard} onPress={() => onNavigate?.('chat')}>
        <View style={styles.insightIcon}>
          <Ionicons name="sparkles-outline" size={24} color="#ffffff" />
        </View>
        <View style={styles.insightTextWrap}>
          <Text style={styles.insightTitle}>AI Smart Insight</Text>
          <Text style={styles.insightBody}>You&apos;re 82% under budget - ask me for a plan!</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
      </Pressable>

      <View>
        <View style={styles.recentHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Pressable onPress={() => onNavigate?.('analytics')}>
            <Text style={styles.linkText}>View all</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          {recentTransactions.map((tx, index) => (
            <View
              key={tx.id}
              style={[
                styles.transactionItem,
                index === recentTransactions.length - 1 && styles.transactionItemLast,
              ]}
            >
              <View style={[styles.transactionIcon, { backgroundColor: tx.color }]}> 
                <Text style={styles.transactionEmoji}>{tx.icon}</Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{tx.title}</Text>
                <Text style={styles.transactionCategory}>{tx.category} · {tx.date} · {tx.time}</Text>
              </View>
              <Text style={[styles.transactionAmount, { color: tx.amount > 0 ? '#1ca34a' : '#ef4444' }]}> 
                {tx.amount > 0 ? '+' : '-'}{formatVND(tx.amount)}
              </Text>
            </View>
          ))}
        </View>

        {/* All transactions are now on their own screen (navigated via bell) */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef3f8',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 24,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
    paddingBottom: 6,
  },
  greeting: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '800',
    color: '#1e293b',
  },
  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#d8e2ee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    minHeight: 324,
    backgroundColor: '#255ca7',
    borderRadius: 28,
    overflow: 'hidden',
    padding: 20,
  },
  balanceGlowTopRight: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    right: -24,
    top: -24,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  balanceGlowBottomLeft: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    left: -32,
    bottom: -24,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  balanceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
    zIndex: 1,
  },
  balanceTextBlock: {
    flex: 1,
    paddingRight: 10,
  },
  balanceLabel: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.88)',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 39,
    lineHeight: 44,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.4,
    marginBottom: 10,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#a6d2ff',
    marginLeft: 4,
  },
  walletBadge: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    zIndex: 1,
  },
  statCard: {
    flex: 1,
    minHeight: 124,
    borderRadius: 22,
    padding: 16,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.82)',
    marginBottom: 8,
  },
  statAmount: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900',
    color: '#ffffff',
  },
  statCurrency: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.56)',
    marginTop: 4,
    fontWeight: '600',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    minHeight: 72,
    borderRadius: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  quickActionExpense: {
    backgroundColor: '#214f95',
  },
  quickActionIncome: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#edf2f7',
  },
  quickActionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  quickActionIconIncome: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  quickActionText: {
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  quickActionTextIncome: {
    color: '#334155',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#1e293b',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
    fontWeight: '500',
  },
  pill: {
    backgroundColor: '#e8efff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C4D8D',
  },
  progressTrack: {
    height: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 18,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8dc7df',
    borderRadius: 999,
  },
  budgetSummary: {
    fontSize: 15,
    lineHeight: 20,
  },
  budgetSpent: {
    color: '#64748b',
    fontWeight: '600',
  },
  budgetDot: {
    color: '#cbd5e1',
  },
  budgetRemaining: {
    color: '#1C4D8D',
    fontWeight: '800',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  linkText: {
    fontSize: 14,
    color: '#1C4D8D',
    fontWeight: '700',
  },
  chartRow: {
    height: 190,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 6,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  barTrack: {
    height: 120,
    width: 34,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 34,
    borderRadius: 10,
    backgroundColor: '#dae2ee',
  },
  barActive: {
    backgroundColor: '#214f95',
  },
  chartDay: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  insightCard: {
    backgroundColor: '#eaf5ff',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#c7e2fb',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  insightIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#214f95',
  },
  insightTextWrap: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  insightBody: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  recentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  transactionItem: {
    minHeight: 96,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f7',
  },
  transactionItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionEmoji: {
    fontSize: 22,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 3,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#94a3b8',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  transactionMeta: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 6,
  },
  modalOverlayFull: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  transactionsModal: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupSection: {
    marginBottom: 12,
  },
  groupDate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 8,
  },
});