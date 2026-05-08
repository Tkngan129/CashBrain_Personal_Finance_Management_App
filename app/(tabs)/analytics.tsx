import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatCurrency';

export default function AnalyticsScreen() {
  const { balance, totalIncome, totalExpense, transactions } = useFinance();

  const categorySpending = transactions.reduce((acc, tx) => {
    if (tx.type === 'expense') {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const spendingPercentage = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Track your spending patterns</Text>
        </View>

        {/* Overview Cards */}
        <View style={styles.overviewGrid}>
          <View style={styles.overviewCard}>
            <MaterialCommunityIcons name="cash" size={32} color="#5FE3D0" />
            <Text style={styles.overviewLabel}>Total Income</Text>
            <Text style={styles.overviewValue}>{formatCurrency(totalIncome)}</Text>
          </View>
          <View style={styles.overviewCard}>
            <MaterialCommunityIcons name="shopping" size={32} color="#FF6B6B" />
            <Text style={styles.overviewLabel}>Total Expense</Text>
            <Text style={styles.overviewValue}>{formatCurrency(totalExpense)}</Text>
          </View>
        </View>

        {/* Spending Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending Rate</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>You've spent {Math.round(spendingPercentage)}% of income</Text>
              <Text style={styles.progressValue}>{spendingPercentage.toFixed(1)}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(spendingPercentage, 100)}%`,
                    backgroundColor: spendingPercentage > 80 ? '#FF6B6B' : '#5FE3D0',
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Top Categories */}
        {topCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Spending Categories</Text>
            {topCategories.map(([category, amount], idx) => (
              <View key={category} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryRank}>#{idx + 1}</Text>
                  <View>
                    <Text style={styles.categoryName}>{category}</Text>
                    <Text style={styles.categoryPercent}>
                      {((amount / totalExpense) * 100).toFixed(0)}% of spending
                    </Text>
                  </View>
                </View>
                <Text style={styles.categoryAmount}>{formatCurrency(amount)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Monthly Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Balance</Text>
              <Text style={styles.summaryValueGreen}>{formatCurrency(balance)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Transactions</Text>
              <Text style={styles.summaryValue}>{transactions.length}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3EA',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 16,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#122126',
  },
  subtitle: {
    fontSize: 14,
    color: '#44565B',
    marginTop: 4,
  },
  overviewGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E0D1',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#44565B',
    marginTop: 8,
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E2C30',
    marginTop: 4,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E2C30',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8E0D1',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 13,
    color: '#44565B',
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#CD5D3D',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E8E0D1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#E8E0D1',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  categoryRank: {
    fontSize: 14,
    fontWeight: '700',
    color: '#CD5D3D',
    width: 24,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E2C30',
  },
  categoryPercent: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 2,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8E0D1',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#44565B',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E2C30',
  },
  summaryValueGreen: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5FE3D0',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E0D1',
  },
});
