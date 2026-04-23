import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatCurrency } from '../utils/formatCurrency';
import GlassCard from './GlassCard';

const TransactionConfirmationCard = ({ transaction, onConfirm, onCancel }) => (
  <GlassCard style={styles.card}>
    <Text style={styles.title}>Xác nhận giao dịch</Text>
    <Text style={styles.description}>{transaction.description}</Text>
    <Text style={[styles.amount, transaction.type === 'expense' ? styles.expense : styles.income]}>
      {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
    </Text>
    <Text style={styles.category}>Danh mục: {transaction.category}</Text>

    <View style={styles.buttonRow}>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelText}>Hủy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
        <Text style={styles.confirmText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  </GlassCard>
);

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, marginBottom: 16 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  description: { fontSize: 15 },
  amount: { fontSize: 22, fontWeight: '700', marginVertical: 8 },
  income: { color: '#10B981' },
  expense: { color: '#EF4444' },
  category: { fontSize: 14, color: '#64748B' },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 12 },
  cancelButton: { paddingHorizontal: 24, paddingVertical: 10 },
  cancelText: { color: '#64748B', fontWeight: '500' },
  confirmButton: { backgroundColor: '#1C4D8D', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 999 },
  confirmText: { color: '#fff', fontWeight: '600' },
});

export default TransactionConfirmationCard;