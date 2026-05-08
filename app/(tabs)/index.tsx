import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatCurrency';

export default function HomeScreen() {
  const { balance, totalIncome, totalExpense, transactions } = useFinance();
  const { user } = useAuth();

  const recentTransactions = transactions.slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
          </View>
          <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
        </View>

        {/* Balance Card */}
        <LinearGradient colors={['#103E46', '#1F5B63']} style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Income</Text>
              <Text style={styles.incomeText}>{formatCurrency(totalIncome)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Expense</Text>
              <Text style={styles.expenseText}>{formatCurrency(totalExpense)}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <Text style={styles.seeAllLink}>See All</Text>
          </View>

          {recentTransactions.length > 0 ? (
            recentTransactions.map((tx) => (
              <View key={tx.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={styles.categoryIcon}>
                    <Text>{tx.emoji || '💰'}</Text>
                  </View>
                  <View>
                    <Text style={styles.transactionTitle}>{tx.category}</Text>
                    <Text style={styles.transactionDate}>{tx.date}</Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    tx.type === 'income' ? styles.incomeAmount : styles.expenseAmount,
                  ]}
                >
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noTransactions}>No transactions yet</Text>
          )}
        </View>

        {/* AI Tip Card */}
        <LinearGradient colors={['#FFF3E6', '#FFECCC']} style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Smart Insight</Text>
          <Text style={styles.tipText}>
            You spent 28% more on dining this week. Try setting a budget limit for better control.
          </Text>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3EA',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 14,
    color: '#44565B',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#122126',
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: '#A0A0A0',
  },
  balanceCard: {
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
  },
  balanceLabel: {
    fontSize: 13,
    color: '#B4D4D2',
    letterSpacing: 0.3,
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: '800',
    color: '#F6FFFD',
    marginVertical: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statBox: {
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statLabel: {
    fontSize: 12,
    color: '#B8E1DF',
    marginBottom: 4,
  },
  incomeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5FE3D0',
  },
  expenseText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF9999',
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E2C30',
  },
  seeAllLink: {
    fontSize: 13,
    color: '#CD5D3D',
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E8E0D1',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E8E0D1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E2C30',
  },
  transactionDate: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 2,
  },
  transactionAmount: {
    fontWeight: '700',
    fontSize: 14,
  },
  incomeAmount: {
    color: '#5FE3D0',
  },
  expenseAmount: {
    color: '#FF6B6B',
  },
  noTransactions: {
    textAlign: 'center',
    color: '#A0A0A0',
    fontSize: 14,
    paddingVertical: 20,
  },
  tipCard: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#FFD699',
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#CD5D3D',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#8B6914',
    lineHeight: 20,
  },
});
