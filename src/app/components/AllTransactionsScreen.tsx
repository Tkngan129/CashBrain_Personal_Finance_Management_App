import { resolveCategoryMeta } from '@/constants/categories';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const recentTransactions = [
  { id: 1, title: 'Coffee & Breakfast', category: 'Food', amount: -45000, date: '2026-05-09', time: '09:30' },
  { id: 2, title: 'Online Course', category: 'Education', amount: -399000, date: '2026-05-08', time: '14:15' },
  { id: 3, title: 'Monthly Allowance', category: 'Income', amount: 4000000, date: '2026-04-30', time: '08:00' },
  { id: 4, title: 'Grab to Uni', category: 'Transport', amount: -25000, date: '2026-04-09', time: '08:30' },
  { id: 5, title: 'New Clothes', category: 'Shopping', amount: -250000, date: '2026-04-09', time: '15:45' },
  { id: 6, title: 'Coffee & Breakfast', category: 'Food', amount: -45000, date: '2026-04-11', time: '09:30' },
];

interface Props {
  onClose?: () => void;
}

const formatVND = (value: number) => `${new Intl.NumberFormat('vi-VN').format(Math.abs(value))} VND`;

export function AllTransactionsScreen({ onClose }: Props) {
  const grouped = useMemo(() => {
    const groups: Record<string, typeof recentTransactions> = {} as any;
    recentTransactions.forEach((tx) => {
      const key = tx.date;
      if (!groups[key]) groups[key] = [];
      groups[key].push(tx);
    });
    return Object.keys(groups)
      .sort((a, b) => (a < b ? 1 : -1))
      .map((date) => ({ date, items: groups[date].sort((x, y) => y.time.localeCompare(x.time)) }));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Transactions</Text>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={18} color="#64748b" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {grouped.map((g) => (
          <View key={g.date} style={styles.groupSection}>
            <Text style={styles.groupDate}>{g.date}</Text>
            {g.items.map((tx) => {
              const categoryMeta = resolveCategoryMeta(tx.category);
              return (
              <View key={tx.id} style={styles.transactionItem}>
                <View style={[styles.transactionIcon, { backgroundColor: categoryMeta.bgColor }]}> 
                  <Ionicons name={categoryMeta.icon as any} size={22} color={categoryMeta.color} />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>{tx.title}</Text>
                  <Text style={styles.transactionCategory}>{categoryMeta.label}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.transactionAmount, { color: tx.amount > 0 ? '#1ca34a' : '#ef4444' }]}>
                    {tx.amount > 0 ? '+' : '-'}{formatVND(tx.amount)}
                  </Text>
                  <Text style={styles.transactionMeta}>{tx.date} · {tx.time}</Text>
                </View>
              </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  closeButton: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  content: { paddingHorizontal: 18, paddingBottom: 40 },
  groupSection: { marginBottom: 14 },
  groupDate: { fontSize: 14, fontWeight: '700', color: '#64748b', marginBottom: 8 },
  transactionItem: { minHeight: 72, flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eef2f7' },
  transactionIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  transactionInfo: { flex: 1 },
  transactionTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  transactionCategory: { fontSize: 12, color: '#94a3b8' },
  transactionAmount: { fontSize: 16, fontWeight: '800' },
  transactionMeta: { fontSize: 12, color: '#94a3b8', marginTop: 6 },
});
