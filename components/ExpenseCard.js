import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '../utils/formatCurrency';

const ExpenseCard = ({ transaction, small = false }) => {
  const isIncome = transaction.type === 'income';
  return (
    <View style={[styles.card, isIncome ? styles.incomeCard : styles.expenseCard, small && styles.smallCard]}>
      <View style={styles.row}>
        <Text style={styles.description}>{transaction.description}</Text>
        <Text style={[styles.amount, isIncome ? styles.incomeText : styles.expenseText]}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </Text>
      </View>
      <Text style={styles.category}>{transaction.category}</Text>
      <Text style={styles.date}>{new Date(transaction.date).toLocaleDateString('vi-VN')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#1C4D8D',
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  smallCard: { padding: 12, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  description: { fontSize: 16, fontWeight: '500' },
  amount: { fontSize: 16, fontWeight: '600' },
  incomeCard: { backgroundColor: '#f0fdf4' },
  expenseCard: { backgroundColor: '#fef2f2' },
  incomeText: { color: '#10B981' },
  expenseText: { color: '#EF4444' },
  category: { fontSize: 13, color: '#64748B', marginTop: 4 },
  date: { fontSize: 12, color: '#94A3B8', marginTop: 8 },
});

export default ExpenseCard;