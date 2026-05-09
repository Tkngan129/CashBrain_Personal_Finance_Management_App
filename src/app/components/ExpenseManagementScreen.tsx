import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'motion/react';
import { Coffee, ShoppingBag, Car, GraduationCap, ChevronDown } from 'lucide-react';

const categoryData = [
  { name: 'Education', value: 399000, color: '#3b82f6', percentage: 55.5 },
  { name: 'Shopping', value: 250000, color: '#8b5cf6', percentage: 34.8 },
  { name: 'Food', value: 45000, color: '#10b981', percentage: 6.3 },
  { name: 'Transport', value: 25000, color: '#f59e0b', percentage: 3.4 },
];

const transactions = [
  {
    id: 1,
    title: 'Online Course Payment',
    category: 'Education',
    amount: -399000,
    date: 'Apr 10, 2026',
    time: '2:15 PM',
    icon: GraduationCap,
    color: '#3b82f6',
  },
  {
    id: 2,
    title: 'Shopping - New Clothes',
    category: 'Shopping',
    amount: -250000,
    date: 'Apr 9, 2026',
    time: '3:45 PM',
    icon: ShoppingBag,
    color: '#8b5cf6',
  },
  {
    id: 3,
    title: 'Coffee & Breakfast',
    category: 'Food',
    amount: -45000,
    date: 'Apr 11, 2026',
    time: '9:30 AM',
    icon: Coffee,
    color: '#10b981',
  },
  {
    id: 4,
    title: 'Grab to University',
    category: 'Transport',
    amount: -25000,
    date: 'Apr 9, 2026',
    time: '8:30 AM',
    icon: Car,
    color: '#f59e0b',
  },
];

export function ExpenseManagementScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  return (
    <div className="h-full overflow-y-auto pb-20 bg-white">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border bg-white sticky top-0 z-10">
        <h2 className="font-semibold text-xl text-foreground mb-4">Expense Management</h2>

        {/* Time Period Selector */}
        <div className="flex gap-2 bg-muted rounded-xl p-1">
          {(['week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedPeriod === period
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-muted-foreground'
              }`}
            >
              {period === 'week' ? 'Week' : period === 'month' ? 'Month' : 'Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Pie Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-4"
      >
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Spending Distribution</h3>
            <span className="text-sm text-muted-foreground">Total: ₫719,000</span>
          </div>

          <div className="h-56 flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `₫${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px 12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3">
            {categoryData.map((category) => (
              <div key={category.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground truncate">{category.name}</p>
                  <p className="text-sm font-semibold text-foreground">{category.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="px-4 pb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">All Transactions</h3>
          <button className="flex items-center gap-1 text-sm text-primary">
            Filter
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {transactions.map((transaction, index) => {
            const Icon = transaction.icon;
            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
                className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${transaction.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: transaction.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{transaction.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.date} • {transaction.time}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    ₫{Math.abs(transaction.amount).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">{transaction.category}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
