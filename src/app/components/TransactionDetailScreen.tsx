import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../context/ThemeContext';
import { resolveCategoryMeta } from '../../../constants/categories';

export interface Transaction {
  id: number | string;
  title: string;
  date: string;
  time?: string;
  amount: number;
  category: string;
  note?: string;
}

interface TransactionDetailScreenProps {
  transaction: Transaction;
  onBack: () => void;
  onEdit?: (tx: Transaction) => void;
  onDelete?: (tx: Transaction) => void;
}

export function TransactionDetailScreen({ transaction, onBack, onEdit, onDelete }: TransactionDetailScreenProps) {
  const colors = useColors();
  const categoryMeta = resolveCategoryMeta(transaction.category);
  const isIncome = transaction.amount > 0;
  
  const formatVND = (value: number) => {
    return Math.abs(value).toLocaleString('vi-VN');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Transaction Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.amountContainer, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={[styles.iconWrap, { backgroundColor: categoryMeta.bgColor }]}>
            <Ionicons name={categoryMeta.icon as any} size={40} color={categoryMeta.color} />
          </View>
          <Text style={[styles.amountLabel, { color: colors.textMuted }]}>Amount</Text>
          <Text style={[styles.amountValue, { color: isIncome ? '#1ca34a' : '#ef4444' }]}>
            {isIncome ? '+' : '-'}{formatVND(transaction.amount)} VND
          </Text>
          <View style={[styles.categoryBadge, { backgroundColor: categoryMeta.bgColor }]}>
            <Text style={[styles.categoryBadgeText, { color: categoryMeta.color }]}>{categoryMeta.label}</Text>
          </View>
        </View>

        <View style={styles.detailsList}>
          <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.detailRow}>
              <View style={styles.detailIconWrap}>
                <Ionicons name="document-text-outline" size={20} color={colors.textMuted} />
              </View>
              <View style={styles.detailInfo}>
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Title / Note</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{transaction.title || transaction.note || 'No note added'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <View style={styles.detailIconWrap}>
                <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
              </View>
              <View style={styles.detailInfo}>
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Date & Time</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {transaction.date} {transaction.time ? `· ${transaction.time}` : ''}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <View style={styles.detailIconWrap}>
                <Ionicons name="wallet-outline" size={20} color={colors.textMuted} />
              </View>
              <View style={styles.detailInfo}>
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Wallet</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>Main Cash</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <Pressable style={styles.deleteButton} onPress={() => onDelete?.(transaction)}>
          <Ionicons name="trash-outline" size={20} color="#64748b" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </Pressable>
        <Pressable style={styles.editButton} onPress={() => onEdit?.(transaction)}>
          <Ionicons name="pencil-outline" size={20} color="#ffffff" />
          <Text style={styles.editButtonText}>Edit</Text>
        </Pressable>
      </View>
    </View>
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
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  amountContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#1e293b',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 4,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  amountValue: {
    fontSize: 42,
    fontWeight: '900',
    marginBottom: 16,
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  categoryBadgeText: {
    fontSize: 14,
    fontWeight: '800',
  },
  detailsList: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  detailCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#1e293b',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    gap: 16,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  deleteButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '800',
  },
  editButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C4D8D',
    borderColor: '#1C4D8D',
    borderWidth: 1,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#1C4D8D',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
});
