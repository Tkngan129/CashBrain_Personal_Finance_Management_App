import { useAnalysis } from '@/src/context/analysisContext';
import { useAuth } from '@/src/context/authContext';
import { useExpenses } from '@/src/context/expenseContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';



interface DashboardScreenProps {
  onNavigate?: (screen: string) => void;
  onAddTransaction?: (type: 'expense' | 'income') => void;
  onTransactionPress?: (transaction: any) => void;
}

const formatVND = (value: number) => {
  return value < 0 ?  `-${new Intl.NumberFormat('vi-VN').format(Math.abs(value))} VND` : `${new Intl.NumberFormat('vi-VN').format(Math.abs(value))} VND`
};

export function DashboardScreen({ onNavigate, onAddTransaction, onTransactionPress }: DashboardScreenProps) {
  const { fetchExpenses, fetchIncomes, transactions } = useExpenses();
  const { weeklyAnalysis, fetchWeeklyAnalysis, monthlyAnalysis, fetchMonthlyAnalysis } = useAnalysis();
  const { userProfile, fetchUserProfile} = useAuth();

  const USER_PROFILE = useMemo(() => {
    return userProfile
  }, [userProfile]);

  const MAX_WEEK_SPENDING = useMemo(() => {
      if (!weeklyAnalysis || weeklyAnalysis.length === 0) {
          return 0;
      }
      
      return Math.max(...weeklyAnalysis.map(item => Math.abs(item.amount) || 0));
  }, [weeklyAnalysis]);

  const TOTAL_BUDGET = useMemo(() => monthlyAnalysis?.total_income || 0, [monthlyAnalysis]);   // static thì dependency rỗng

  const TOTAL_SPENT = useMemo(() => {
      return monthlyAnalysis?.total_expense || 0;
  }, [monthlyAnalysis]); 

  const REMAINING = useMemo(() => {
      return TOTAL_BUDGET - TOTAL_SPENT <= 0 ? 0 : TOTAL_BUDGET - Math.abs(TOTAL_SPENT);
  }, [TOTAL_BUDGET, TOTAL_SPENT]);

  const REMAINING_PCT = useMemo(() => {
      if (TOTAL_BUDGET === 0) return 0;
      return Math.round((REMAINING / TOTAL_BUDGET) * 100) <= 0 ? 0 : Math.round((REMAINING / TOTAL_BUDGET) * 100);
  }, [REMAINING, TOTAL_BUDGET]);

  useEffect( () => {
    fetchExpenses();
    fetchWeeklyAnalysis();
    fetchMonthlyAnalysis();
    fetchIncomes();
    fetchUserProfile();
  }, []);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{(() => {
            const currentHour = new Date().getHours();

            if (currentHour < 12) {
              return "Good morning";
            }

            if (currentHour < 18) {
              return "Good afternoon";
            }

            return "Good evening";
          })()}</Text>
          <Text style={styles.name}>{USER_PROFILE?.username || "Unknown user"}</Text>
        </View>
        <Pressable style={styles.notificationButton} onPress={() => onNavigate?.('transactions')} disabled={true}>
          <Ionicons name="notifications-outline" size={20} color="#64748b" />
        </Pressable>
      </View>

      <View style={styles.balanceCard}>
        <View style={styles.balanceGlowTopRight} />
        <View style={styles.balanceGlowBottomLeft} />

        <View style={styles.balanceTopRow}>
          <View style={styles.balanceTextBlock}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>{formatVND(monthlyAnalysis?.balance || 0)}</Text>
          </View>
          <View style={styles.walletBadge}>
            <Ionicons name="wallet-outline" size={21} color="#ffffff" />
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
            <Text style={styles.sectionTitle}>
              {(() => {
                const month = new Date().toLocaleString('default', { month: 'long' });
                return month; // Output: "May"
              })()}Budget</Text>
            <Text style={styles.sectionSubtitle}>{formatVND(TOTAL_BUDGET)} total</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{REMAINING_PCT}% left</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${REMAINING_PCT}%` }]} />
        </View>
                <View style={styles.budgetSummaryRow}>
        <View style={styles.summaryBlockLeft}>
            <Text style={styles.budgetSpent}>
            {formatVND(TOTAL_SPENT)} spent
            </Text>
        </View>

        <Text style={styles.budgetDot}>•</Text>

        <View style={styles.summaryBlockRight}>
            <Text style={styles.budgetRemaining}>
            {formatVND(REMAINING)} remaining
            </Text>
        </View>
    </View>
      </View>

      {/* WEEKLY CHART */}
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
          {weeklyAnalysis.map((item) => {
            const barHeight = Math.max(14, Math.round((Math.abs(item.amount) / MAX_WEEK_SPENDING) * 102));
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
          <Text style={styles.insightBody}>You&apos;re {REMAINING_PCT}% under budget - ask me for a plan!</Text>
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

        {/* RECENT TRANSACTION (TAKE ONLY FIRST 5 OBJECTS) */}
        <View style={styles.card}>
          {transactions.slice(0, 8).map((tx, index) => {
            // const categoryMeta = resolveCategoryMeta(tx.category);
            return (
            <Pressable
              key={index}
              onPress={() => onTransactionPress?.(tx)}
              style={[
                styles.transactionItem,
                index === 5 - 1 && styles.transactionItemLast,
              ]}
            >
              <View style={[styles.transactionIcon, { backgroundColor: tx?.category_bg_color || '#ecfdf5' }]}> 
                <Ionicons name={tx?.type === 'Expense' ? tx?.category_icon : 'wallet-outline' as any} size={21} color={tx?.category_color || '#22c55e'} />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{tx?.note}</Text>
                <Text style={styles.transactionCategory}>{tx?.category_name} · {tx?.date} </Text>
              </View>
              <Text style={[styles.transactionAmount, { color: tx?.type !== "Expense" ? '#1ca34a' : '#ef4444' }]}> 
                {tx?.type !== "Expense" ? '+' : '-'}{formatVND(tx?.amount)}
              </Text>
            </Pressable>
            );
          })}
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
    paddingHorizontal: 14,
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
    fontSize: 24,
    lineHeight: 28,
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
    minHeight: 280,
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
  fontSize: 24,
  lineHeight: 36,
  fontWeight: '900',
  color: '#ffffff',
  letterSpacing: -0.3,
  marginBottom: 6,
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
    fontSize: 18,
    lineHeight: 22,
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
    fontSize: 14,
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
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
    fontWeight: '500',
  },
  pill: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C4D8D',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 14,
    marginBottom: 14,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8dc7df',
    borderRadius: 999,
  },
  budgetSummaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  summaryBlockLeft: {
    flex: 1,
},
    summaryBlockRight: {
  flex: 1,
  alignItems: 'flex-end',
},
  budgetSpent: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 18,
  },
  budgetDot: {
    color: '#cbd5e1',
    marginHorizontal: 8,
    fontSize: 12,
    marginTop: 2,
  },
  budgetRemaining: {
    color: '#1C4D8D',
    fontWeight: '800',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
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
    height: 170,
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
    minHeight: 78,
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