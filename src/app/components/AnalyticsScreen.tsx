import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
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
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 12,
  },
  chartContainer: {
    height: 200,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 16,
    flexDirection: 'row',
    gap: 8,
  },
  chartBar: {
    flex: 1,
    backgroundColor: '#1C4D8D',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 8,
  },
  chartLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#EEF4FF',
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 12,
    color: '#94a3b8',
  },
  statAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C4D8D',
  },
});

const weekData = [
  { day: 'Mon', amount: 120_000 },
  { day: 'Tue', amount: 45_000 },
  { day: 'Wed', amount: 280_000 },
  { day: 'Thu', amount: 95_000 },
  { day: 'Fri', amount: 399_000 },
  { day: 'Sat', amount: 60_000 },
  { day: 'Sun', amount: 45_000 },
];

const categoryBreakdown = [
  { category: 'Food & Drink', amount: 450_000, color: '#ef4444', icon: '🍔' },
  { category: 'Shopping', amount: 250_000, color: '#f97316', icon: '🛍️' },
  { category: 'Transport', amount: 150_000, color: '#eab308', icon: '🚗' },
  { category: 'Education', amount: 399_000, color: '#8b5cf6', icon: '🎓' },
];

const fmtVND = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.abs(n));

const maxAmount = Math.max(...weekData.map(d => d.amount));

export function AnalyticsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>

      <View style={styles.content}>
        {/* Weekly Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>This Week's Spending</Text>
          <View style={styles.chartContainer}>
            {weekData.map((data, idx) => (
              <View key={idx} style={{ flex: 1, alignItems: 'center' }}>
                <View
                  style={[
                    styles.chartBar,
                    { height: (data.amount / maxAmount) * 140 },
                  ]}
                >
                  <Text style={{ fontSize: 11, color: '#ffffff', fontWeight: '600' }}>
                    {Math.round((data.amount / 1_000_000) * 10) / 10}M
                  </Text>
                </View>
                <Text style={styles.chartLabel}>{data.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Category Breakdown</Text>
          {categoryBreakdown.map((cat, idx) => (
            <View key={idx} style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: `${cat.color}20` }]}>
                <Text style={{ fontSize: 18 }}>{cat.icon}</Text>
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>{cat.category}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View
                    style={{
                      height: 4,
                      backgroundColor: cat.color,
                      borderRadius: 2,
                      width: '40%',
                    }}
                  />
                  <Text style={styles.statValue}>48% of budget</Text>
                </View>
              </View>
              <Text style={styles.statAmount}>{fmtVND(cat.amount)}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Summary</Text>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#fee2e2' }]}>
              <Ionicons name="arrow-up" size={20} color="#ef4444" />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Total Spent</Text>
              <Text style={styles.statValue}>This month</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#ef4444' }}>719K</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#f0fdf4' }]}>
              <Ionicons name="arrow-down" size={20} color="#22c55e" />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Total Income</Text>
              <Text style={styles.statValue}>This month</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#22c55e' }}>4.0M</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
