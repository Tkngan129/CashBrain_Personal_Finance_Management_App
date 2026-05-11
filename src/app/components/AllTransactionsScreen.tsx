import { resolveCategoryMeta } from '@/constants/categories';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTransactions } from '../../context/TransactionContext';

interface Props {
  onClose?: () => void;
  onTransactionPress?: (tx: any) => void;
}

const formatVND = (value: number) => `${new Intl.NumberFormat('vi-VN').format(Math.abs(value))} VND`;

export function AllTransactionsScreen({ onClose, onTransactionPress }: Props) {
  const { transactions } = useTransactions();
  const grouped = useMemo(() => {
    const groups: Record<string, typeof transactions> = {} as any;
    transactions.forEach((tx) => {
      const key = tx.date;
      if (!groups[key]) groups[key] = [];
      groups[key].push(tx);
    });
    return Object.keys(groups)
      .sort((a, b) => (a < b ? 1 : -1))
      .map((date) => ({ date, items: groups[date].sort((x, y) => (y.time || '').localeCompare(x.time || '')) }));
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
              <Pressable key={tx.id} style={styles.transactionItem} onPress={() => onTransactionPress?.(tx)}>
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
              </Pressable>
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
