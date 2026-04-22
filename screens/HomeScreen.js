import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../components/GlassCard';
import ExpenseCard from '../components/ExpenseCard';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatCurrency';

const HomeScreen = () => {
  const { balance, totalIncome, totalExpense, recentTransactions } = useFinance();

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#e8f0fb', '#f4f8ff', '#e0f3f7']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Balance Card */}
          <GlassCard style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
            <View style={styles.incomeExpenseRow}>
              <View style={styles.incomeBox}>
                <Text style={styles.incomeLabel}>Income</Text>
                <Text style={styles.incomeAmount}>{formatCurrency(totalIncome)}</Text>
              </View>
              <View style={styles.expenseBox}>
                <Text style={styles.expenseLabel}>Expense</Text>
                <Text style={styles.expenseAmount}>{formatCurrency(totalExpense)}</Text>
              </View>
            </View>
          </GlassCard>

          {/* Recent Transactions */}
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentTransactions.map((tx) => (
            <ExpenseCard key={tx.id} transaction={tx} />
          ))}

          {/* Quick AI Tip */}
          <GlassCard style={styles.tipCard}>
            <Text style={styles.tipTitle}>💡 AI Suggestion</Text>
            <Text style={styles.tipText}>
              You spent 28% more on food this week. Try setting a budget for "Ăn uống".
            </Text>
          </GlassCard>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  gradient: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  balanceCard: { marginBottom: 24, alignItems: 'center' },
  balanceLabel: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  balanceAmount: { fontSize: 36, fontWeight: '700', color: '#1C4D8D', marginVertical: 8 },
  incomeExpenseRow: { flexDirection: 'row', width: '100%', marginTop: 16 },
  incomeBox: { flex: 1, backgroundColor: '#f0fdf4', borderRadius: 12, padding: 12, marginRight: 8 },
  expenseBox: { flex: 1, backgroundColor: '#fef2f2', borderRadius: 12, padding: 12 },
  incomeLabel: { fontSize: 12, color: '#10B981' },
  expenseLabel: { fontSize: 12, color: '#EF4444' },
  incomeAmount: { fontSize: 18, fontWeight: '600', color: '#10B981' },
  expenseAmount: { fontSize: 18, fontWeight: '600', color: '#EF4444' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1C4D8D', marginBottom: 12 },
  tipCard: { marginTop: 8 },
  tipTitle: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  tipText: { fontSize: 14, color: '#475569' },
});

export default HomeScreen;