import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type AnalyticsTab = 'expenses' | 'calendar' | 'overview';
type RangeTab = 'week' | 'month' | 'year';

const fmtVND = (value: number) =>
  `${new Intl.NumberFormat('vi-VN').format(Math.abs(value))} VND`;

const totalSpent = 719_000;
const totalIncome = 4_000_000;
const netThisMonth = 2_741_000;

const expenseBreakdown = [
  { name: 'Education', amount: 399_000, color: '#b9a2ff' },
  { name: 'Shopping', amount: 250_000, color: '#ffb767' },
  { name: 'Food', amount: 45_000, color: '#f9a0a0' },
  { name: 'Transport', amount: 25_000, color: '#f6d84f' },
];

const expenseTransactions = [
  { id: 1, title: 'Online Course', date: 'Apr 10', time: '2:15 PM', amount: -399_000, category: 'Education', icon: '🎓', color: '#f5f3ff' },
  { id: 2, title: 'New Clothes', date: 'Apr 9', time: '3:45 PM', amount: -250_000, category: 'Shopping', icon: '🛍️', color: '#fff7ed' },
  { id: 3, title: 'Coffee & Breakfast', date: 'Apr 11', time: '9:30 AM', amount: -45_000, category: 'Food', icon: '☕', color: '#fff1f2' },
  { id: 4, title: 'Grab to Uni', date: 'Apr 9', time: '8:30 AM', amount: -25_000, category: 'Transport', icon: '🚗', color: '#fffce8' },
];

const calendarDays = [
  { day: 1, badge: '+400k', type: 'income' },
  { day: 2 },
  { day: 3 },
  { day: 4 },
  { day: 5, badge: '-45K', type: 'expense' },
  { day: 6 },
  { day: 7 },
  { day: 8 },
  { day: 9, badge: '-275K', type: 'expense' },
  { day: 10, badge: '-399K', type: 'expense' },
  { day: 11, badge: '-45K', type: 'expense' },
  { day: 12 },
  { day: 13 },
  { day: 14, badge: '-180K', type: 'expense' },
  { day: 15 },
  { day: 16 },
  { day: 17, badge: '-65K', type: 'expense' },
  { day: 18 },
  { day: 19 },
  { day: 20, badge: '-155K', type: 'expense' },
  { day: 21 },
  { day: 22 },
  { day: 23, badge: '-95K', type: 'expense' },
  { day: 24 },
  { day: 25 },
  { day: 26 },
  { day: 27 },
  { day: 28 },
  { day: 29 },
  { day: 30 },
];

const monthlyBars = [
  { month: 'Nov', amount: 920_000 },
  { month: 'Dec', amount: 880_000 },
  { month: 'Jan', amount: 850_000 },
  { month: 'Feb', amount: 920_000 },
  { month: 'Mar', amount: 770_000 },
  { month: 'Apr', amount: 740_000 },
];

export function AnalyticsScreen() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('expenses');
  const [rangeTab, setRangeTab] = useState<RangeTab>('month');

  const totalExpensePercentages = useMemo(() => {
    const total = expenseBreakdown.reduce((sum, item) => sum + item.amount, 0);
    return expenseBreakdown.map((item) => ({
      ...item,
      percentage: (item.amount / total) * 100,
    }));
  }, []);

  const renderTab = (tab: AnalyticsTab, label: string) => {
    const isActive = activeTab === tab;
    return (
      <Pressable key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{label}</Text>
        <View style={[styles.tabIndicator, isActive && styles.tabIndicatorActive]} />
      </Pressable>
    );
  };

  const renderRangeTab = (tab: RangeTab, label: string) => {
    const isActive = rangeTab === tab;
    return (
      <Pressable key={tab} onPress={() => setRangeTab(tab)} style={[styles.rangeTab, isActive && styles.rangeTabActive]}>
        <Text style={[styles.rangeText, isActive && styles.rangeTextActive]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.headerEyebrow}>April 2026</Text>
          <Text style={styles.headerTitle}>Analytics</Text>
        </View>
        <View style={styles.monthChangePill}>
          <Ionicons name="trending-down-outline" size={16} color="#16a34a" />
          <Text style={styles.monthChangeText}>-4.1% vs last month</Text>
        </View>
      </View>

      <View style={styles.tabsRow}>
        {renderTab('expenses', 'Expenses')}
        {renderTab('calendar', 'Calendar')}
        {renderTab('overview', 'Overview')}
      </View>

      {activeTab === 'expenses' ? (
        <View style={styles.expensesView}>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Spent</Text>
              <Text style={styles.summaryValue}>{fmtVND(totalSpent)}</Text>
              <View style={styles.summaryTrendRow}>
                <Ionicons name="trending-down-outline" size={14} color="#16a34a" />
                <Text style={styles.summaryTrendPositive}>31,000 VND less</Text>
              </View>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Transactions</Text>
              <Text style={styles.summaryValue}>4 items</Text>
              <View style={styles.summaryTrendRow}>
                <Ionicons name="trending-up-outline" size={14} color="#f97316" />
                <Text style={styles.summaryTrendOrange}>+0 photo</Text>
              </View>
            </View>
          </View>

          <View style={styles.panelCard}>
            <View style={styles.panelHeaderRow}>
              <Text style={styles.panelTitle}>Spending by Category</Text>
              <Text style={styles.panelTotal}>{fmtVND(totalSpent)} total</Text>
            </View>

            <View style={styles.categoryGrid}>
              <View style={styles.donutWrap}>
                <View style={styles.donutOuter}>
                  <View style={styles.donutInner} />
                </View>
              </View>

              <View style={styles.categoryList}>
                {totalExpensePercentages.map((item) => (
                  <View key={item.name} style={styles.categoryItem}>
                    <View style={styles.categoryLineRow}>
                      <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
                      <Text style={styles.categoryName}>{item.name}</Text>
                      <Text style={styles.categoryPercent}>{item.percentage.toFixed(1)}%</Text>
                    </View>
                    <View style={styles.categoryTrack}>
                      <View style={[styles.categoryFill, { width: `${item.percentage}%`, backgroundColor: item.color }]} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <Text style={styles.sectionHeading}>All Transactions</Text>
          <View style={styles.transactionsList}>
            {expenseTransactions.map((tx) => (
              <View key={tx.id} style={styles.transactionCard}>
                <View style={[styles.transactionIcon, { backgroundColor: tx.color }]}>
                  <Text style={styles.transactionEmoji}>{tx.icon}</Text>
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>{tx.title}</Text>
                  <Text style={styles.transactionMeta}>{tx.date} · {tx.time}</Text>
                </View>
                <View style={styles.transactionAmountWrap}>
                  <Text style={styles.transactionAmount}>{fmtVND(tx.amount).replace(' VND', '')}</Text>
                  <Text style={styles.transactionCategory}>{tx.category}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {activeTab === 'calendar' ? (
        <View style={styles.calendarView}>
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeaderRow}>
              <Pressable style={styles.calendarNavButton}>
                <Ionicons name="chevron-back" size={22} color="#64748b" />
              </Pressable>
              <Text style={styles.calendarMonth}>April 2026</Text>
              <Pressable style={styles.calendarNavButton}>
                <Ionicons name="chevron-forward" size={22} color="#64748b" />
              </Pressable>
            </View>

            <View style={styles.weekdayRow}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
                <Text key={day} style={styles.weekdayText}>{day}</Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {calendarDays.map((item, index) => {
                const isHighlighted = Boolean(item.badge);
                const isIncome = item.type === 'income';
                return (
                  <View key={`${item.day}-${index}`} style={styles.calendarCell}>
                    {item.day <= 30 ? (
                      <View style={[styles.calendarDayBubble, isHighlighted && (isIncome ? styles.calendarIncomeBubble : styles.calendarExpenseBubble)]}>
                        <Text style={[styles.calendarDayNumber, isHighlighted && (isIncome ? styles.calendarIncomeText : styles.calendarExpenseText)]}>{item.day}</Text>
                        {item.badge ? (
                          <Text style={[styles.calendarBadge, isIncome ? styles.calendarIncomeText : styles.calendarExpenseText]}>{item.badge}</Text>
                        ) : null}
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>

            <View style={styles.calendarDivider} />

            <View style={styles.netRow}>
              <Text style={styles.netLabel}>Net this month</Text>
              <Text style={styles.netValue}>{`+${fmtVND(netThisMonth)}`}</Text>
            </View>
          </View>

          <View style={styles.helpCard}>
            <Ionicons name="calendar-outline" size={20} color="#1C4D8D" />
            <Text style={styles.helpText}>Tap a highlighted date to view that day&apos;s transactions</Text>
          </View>
        </View>
      ) : null}

      {activeTab === 'overview' ? (
        <View style={styles.overviewView}>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Spent</Text>
              <Text style={styles.summaryValue}>{fmtVND(totalSpent)}</Text>
              <View style={styles.summaryTrendRow}>
                <Ionicons name="trending-down-outline" size={14} color="#16a34a" />
                <Text style={styles.summaryTrendPositive}>31,000 VND less</Text>
              </View>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Transactions</Text>
              <Text style={styles.summaryValue}>4 items</Text>
              <View style={styles.summaryTrendRow}>
                <Ionicons name="trending-up-outline" size={14} color="#f97316" />
                <Text style={styles.summaryTrendOrange}>+1 vs last month</Text>
              </View>
            </View>
          </View>

          <View style={styles.rangeTabsRow}>
            {renderRangeTab('week', 'Week')}
            {renderRangeTab('month', 'Month')}
            {renderRangeTab('year', 'Year')}
          </View>

          <View style={styles.panelCard}>
            <Text style={styles.panelTitle}>Monthly Spending (K VND)</Text>
            <Text style={styles.panelSubtitle}>Last 6 months</Text>

            <View style={styles.barChartWrap}>
              <View style={styles.yAxisLabels}>
                {['1000K', '750K', '500K', '250K', '0K'].map((label) => (
                  <Text key={label} style={styles.yAxisLabel}>{label}</Text>
                ))}
              </View>
              <View style={styles.barChartArea}>
                {monthlyBars.map((item) => {
                  const height = Math.max(40, Math.round((item.amount / 1_000_000) * 190));
                  return (
                    <View key={item.month} style={styles.barColumn}>
                      <View style={styles.barTrack}>
                        <View style={[styles.barFill, { height }]} />
                      </View>
                      <Text style={styles.barMonth}>{item.month}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#1f4f95' }]} />
                <Text style={styles.legendText}>Current</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#dbe3ef' }]} />
                <Text style={styles.legendText}>Previous</Text>
              </View>
            </View>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef3f8',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    gap: 14,
  },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    shadowColor: '#1e293b',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 2,
  },
  headerEyebrow: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '900',
    color: '#1e293b',
  },
  monthChangePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#a7f3c1',
    backgroundColor: '#effdf5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    marginTop: 10,
  },
  monthChangeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f8f2a',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8edf5',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 14,
  },
  tabText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#94a3b8',
  },
  tabTextActive: {
    color: '#1f4f95',
  },
  tabIndicator: {
    height: 2,
    width: '70%',
    marginTop: 14,
    backgroundColor: 'transparent',
    borderRadius: 999,
  },
  tabIndicatorActive: {
    backgroundColor: '#1f4f95',
  },
  expensesView: {
    gap: 14,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 26,
    padding: 16,
    shadowColor: '#1e293b',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 10,
  },
  summaryTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  summaryTrendPositive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16a34a',
  },
  summaryTrendOrange: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f97316',
  },
  panelCard: {
    backgroundColor: '#ffffff',
    borderRadius: 26,
    padding: 18,
    shadowColor: '#1e293b',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 2,
  },
  panelHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  panelTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#334155',
  },
  panelSubtitle: {
    fontSize: 15,
    color: '#94a3b8',
    marginTop: 4,
  },
  panelTotal: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  donutWrap: {
    width: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutOuter: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 26,
    borderColor: '#b9a2ff',
    borderRightColor: '#ffb767',
    borderBottomColor: '#f9a0a0',
    borderLeftColor: '#ffb767',
    transform: [{ rotate: '18deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#ffffff',
  },
  categoryList: {
    flex: 1,
    gap: 14,
  },
  categoryItem: {
    gap: 5,
  },
  categoryLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    color: '#475569',
    fontWeight: '500',
  },
  categoryPercent: {
    fontSize: 17,
    fontWeight: '800',
    color: '#334155',
  },
  categoryTrack: {
    height: 8,
    backgroundColor: '#edf2f8',
    borderRadius: 999,
    overflow: 'hidden',
  },
  categoryFill: {
    height: '100%',
    borderRadius: 999,
  },
  sectionHeading: {
    fontSize: 19,
    fontWeight: '900',
    color: '#334155',
    marginTop: 2,
    marginBottom: 2,
  },
  transactionsList: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1e293b',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 2,
  },
  transactionIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  transactionEmoji: {
    fontSize: 22,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  transactionMeta: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  transactionAmountWrap: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ef4444',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#8da0c0',
    fontWeight: '600',
  },
  calendarView: {
    gap: 14,
  },
  calendarCard: {
    backgroundColor: '#ffffff',
    borderRadius: 26,
    padding: 18,
    shadowColor: '#1e293b',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 2,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  calendarNavButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#f3f6fb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarMonth: {
    fontSize: 18,
    fontWeight: '900',
    color: '#334155',
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '800',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    width: '14.2857%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  calendarDayBubble: {
    width: 64,
    height: 64,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  calendarIncomeBubble: {
    backgroundColor: '#eefcf0',
    borderWidth: 1,
    borderColor: '#c8efcf',
  },
  calendarExpenseBubble: {
    backgroundColor: '#fff1f1',
    borderWidth: 1,
    borderColor: '#fbc7c7',
  },
  calendarDayNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#94a3b8',
  },
  calendarBadge: {
    fontSize: 10,
    fontWeight: '900',
  },
  calendarIncomeText: {
    color: '#16a34a',
  },
  calendarExpenseText: {
    color: '#ef4444',
  },
  calendarDivider: {
    height: 1,
    backgroundColor: '#edf2f7',
    marginTop: 12,
    marginBottom: 14,
  },
  netRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netLabel: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '700',
  },
  netValue: {
    fontSize: 17,
    color: '#16a34a',
    fontWeight: '900',
  },
  helpCard: {
    backgroundColor: '#f5f9ff',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#cddcf4',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  helpText: {
    flex: 1,
    fontSize: 15,
    color: '#3b6ba8',
    fontWeight: '700',
  },
  overviewView: {
    gap: 14,
  },
  rangeTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 4,
    borderRadius: 18,
    gap: 4,
    shadowColor: '#1e293b',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 1,
  },
  rangeTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  rangeTabActive: {
    backgroundColor: '#1f4f95',
  },
  rangeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#94a3b8',
  },
  rangeTextActive: {
    color: '#ffffff',
  },
  barChartWrap: {
    flexDirection: 'row',
    marginTop: 18,
    paddingBottom: 4,
  },
  yAxisLabels: {
    width: 46,
    height: 230,
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 14,
  },
  yAxisLabel: {
    fontSize: 12,
    color: '#c7d2e3',
    fontWeight: '700',
    textAlign: 'right',
  },
  barChartArea: {
    flex: 1,
    height: 230,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 6,
    borderTopWidth: 1,
    borderTopColor: '#edf2f7',
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  barTrack: {
    height: 200,
    width: 22,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barFill: {
    width: 22,
    borderRadius: 6,
    backgroundColor: '#214f95',
  },
  barMonth: {
    fontSize: 14,
    color: '#8da0c0',
    fontWeight: '700',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 15,
    color: '#8da0c0',
    fontWeight: '700',
  },
});