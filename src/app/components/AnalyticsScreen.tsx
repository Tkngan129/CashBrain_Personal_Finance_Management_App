import { resolveCategoryMeta } from '@/constants/categories';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useColors } from '../../context/ThemeContext';

type AnalyticsTab = 'expenses' | 'calendar' | 'overview';
type RangeTab = 'week' | 'month' | 'year';

const fmtVND = (value: number) =>
  `${new Intl.NumberFormat('vi-VN').format(Math.abs(value))} VND`;

const formatCalendarAmount = (value: number) => {
  const absValue = Math.abs(value);
  if (absValue >= 1_000_000) {
    return `${(absValue / 1_000_000).toFixed(absValue % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  return `${Math.round(absValue / 1000)}K`;
};

const totalSpent = 719_000;
const totalIncome = 4_000_000;
const netThisMonth = 2_741_000;

const expenseBreakdown = [
  { name: 'Education', amount: 399_000, color: '#b9a2ff' },
  { name: 'Shopping', amount: 250_000, color: '#ffb767' },
  { name: 'Food & Drinks', amount: 45_000, color: '#f9a0a0' },
  { name: 'Transportation', amount: 25_000, color: '#f6d84f' },
  { name: 'Bills', amount: 15_000, color: '#4f9cf2' },
];

const expenseTransactions = [
  { id: 1, title: 'Online Course', date: 'Apr 10', time: '2:15 PM', amount: -399_000, category: 'Education' },
  { id: 2, title: 'New Clothes', date: 'Apr 9', time: '3:45 PM', amount: -250_000, category: 'Shopping' },
  { id: 3, title: 'Coffee & Breakfast', date: 'Apr 11', time: '9:30 AM', amount: -45_000, category: 'Food & Drinks' },
  { id: 4, title: 'Grab to Uni', date: 'Apr 9', time: '8:30 AM', amount: -25_000, category: 'Transportation' },
  { id: 5, title: 'Monthly Allowance', date: 'Apr 30', time: '8:00 AM', amount: 4_000_000, category: 'Income' },
];

const calendarTransactions = [
  { id: 1, day: 1, title: 'Monthly Allowance', time: '08:00 AM', amount: 4_000_000, category: 'Income' },
  { id: 2, day: 5, title: 'Coffee & Breakfast', time: '09:30 AM', amount: -45_000, category: 'Food & Drinks' },
  { id: 3, day: 9, title: 'Grab to Uni', time: '08:30 AM', amount: -25_000, category: 'Transportation' },
  { id: 4, day: 9, title: 'New Clothes', time: '03:45 PM', amount: -250_000, category: 'Shopping' },
  { id: 5, day: 10, title: 'Online Course', time: '02:15 PM', amount: -399_000, category: 'Education' },
  { id: 6, day: 11, title: 'Coffee & Breakfast', time: '09:30 AM', amount: -45_000, category: 'Food & Drinks' },
  { id: 7, day: 14, title: 'Freelance Bonus', time: '05:20 PM', amount: 180_000, category: 'Income' },
  { id: 8, day: 17, title: 'Lunch with friends', time: '12:10 PM', amount: -65_000, category: 'Food & Drinks' },
  { id: 9, day: 20, title: 'Utilities refund', time: '10:00 AM', amount: -155_000, category: 'Bills' },
  { id: 10, day: 23, title: 'Movie night', time: '08:45 PM', amount: -95_000, category: 'Entertainment' },
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

const overviewTransactions = [
  { date: new Date(2024, 11, 12), amount: -260_000 },
  { date: new Date(2024, 11, 21), amount: 820_000 },
  { date: new Date(2025, 0, 7), amount: -400_000 },
  { date: new Date(2025, 0, 15), amount: -150_000 },
  { date: new Date(2025, 1, 4), amount: -1_843_000 },
  { date: new Date(2025, 1, 12), amount: 1_281_835 },
  { date: new Date(2025, 1, 20), amount: -230_000 },
  { date: new Date(2025, 1, 28), amount: 450_000 },
  { date: new Date(2025, 2, 6), amount: -320_000 },
  { date: new Date(2025, 3, 7), amount: -45_000 },
  { date: new Date(2025, 3, 8), amount: -250_000 },
  { date: new Date(2025, 3, 9), amount: -25_000 },
  { date: new Date(2025, 3, 10), amount: -399_000 },
  { date: new Date(2025, 3, 11), amount: -45_000 },
  { date: new Date(2025, 3, 12), amount: 180_000 },
  { date: new Date(2026, 3, 7), amount: -45_000 },
  { date: new Date(2026, 4, 4), amount: -65_000 },
  { date: new Date(2026, 5, 15), amount: -95_000 },
  { date: new Date(2026, 6, 10), amount: -155_000 },
  { date: new Date(2026, 7, 21), amount: -120_000 },
  { date: new Date(2026, 8, 9), amount: -175_000 },
  { date: new Date(2026, 9, 2), amount: -85_000 },
  { date: new Date(2026, 10, 18), amount: -140_000 },
  { date: new Date(2026, 11, 12), amount: 4_000_000 },
];

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatCompactMoney = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  }

  return `${Math.round(value / 1000)}K`;
};

interface AnalyticsScreenProps {
  onAddTransaction?: (type: 'expense' | 'income') => void;
}

export function AnalyticsScreen({ onAddTransaction }: AnalyticsScreenProps) {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('expenses');
  const [rangeTab, setRangeTab] = useState<RangeTab>('month');
  const [draftRangeTab, setDraftRangeTab] = useState<RangeTab>('month');
  const [overviewMonthAnchor, setOverviewMonthAnchor] = useState(new Date(2025, 1, 1));
  const [draftOverviewMonthAnchor, setDraftOverviewMonthAnchor] = useState(new Date(2025, 1, 1));
  const [overviewYearAnchor, setOverviewYearAnchor] = useState(2025);
  const [draftOverviewYearAnchor, setDraftOverviewYearAnchor] = useState(2025);
  const [overviewYearWindowStart, setOverviewYearWindowStart] = useState(2024);
  const [draftOverviewYearWindowStart, setDraftOverviewYearWindowStart] = useState(2024);
  const [draftWeekIndex, setDraftWeekIndex] = useState(0);
  const [appliedWeekIndex, setAppliedWeekIndex] = useState(0);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(1);
  const [calendarMonthDate, setCalendarMonthDate] = useState(new Date(2026, 3, 1));
  const [showRangePicker, setShowRangePicker] = useState(false);
  const [overviewActiveMetric, setOverviewActiveMetric] = useState<'expenses' | 'income'>('expenses');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const colors = useColors();

  const groupedExpenseTransactions = useMemo(() => {
    const groups: Record<string, typeof expenseTransactions> = {};
    expenseTransactions.forEach((tx) => {
      const key = tx.date;
      if (!groups[key]) groups[key] = [];
      groups[key].push(tx);
    });
    return Object.keys(groups)
      .sort((a, b) => {
        const dayA = parseInt(a.replace('Apr ', '')) || 0;
        const dayB = parseInt(b.replace('Apr ', '')) || 0;
        return dayB - dayA;
      })
      .map((date) => ({ date, items: groups[date] }));
  }, []);

  const getAnalyticsCategoryMeta = (category: string) => resolveCategoryMeta(category);

  const totalExpensePercentages = useMemo(() => {
    const total = expenseBreakdown.reduce((sum, item) => sum + item.amount, 0);
    return expenseBreakdown.map((item) => ({
      ...item,
      percentage: (item.amount / total) * 100,
    }));
  }, []);

  const calendarDayData = useMemo(() => {
    const days = Array.from({ length: 30 }, (_, index) => {
      const day = index + 1;
      const transactions = calendarTransactions.filter((tx) => tx.day === day);
      const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
      return {
        day,
        transactions,
        total,
        hasTransactions: transactions.length > 0,
        isEmpty: false,
      };
    });
    
    // Add 2 padding days for Wednesday start
    const padded = [
      { day: -1, transactions: [], total: 0, hasTransactions: false, isEmpty: true },
      { day: 0, transactions: [], total: 0, hasTransactions: false, isEmpty: true },
      ...days
    ];
    return padded;
  }, []);

  const selectedDayData = useMemo(
    () => calendarDayData.find((item) => item.day === selectedCalendarDay && !item.isEmpty) ?? calendarDayData.find(item => !item.isEmpty) ?? calendarDayData[2],
    [calendarDayData, selectedCalendarDay],
  );

  const overviewSummary = useMemo(() => {
    const formatMonthYear = (date: Date) => `${monthLabels[date.getMonth()]} ${date.getFullYear()}`;

    const monthStart = new Date(overviewMonthAnchor.getFullYear(), overviewMonthAnchor.getMonth(), 1);
    const monthEnd = new Date(overviewMonthAnchor.getFullYear(), overviewMonthAnchor.getMonth() + 1, 0);

    const weekStart = new Date(
      overviewMonthAnchor.getFullYear(),
      overviewMonthAnchor.getMonth(),
      1 + appliedWeekIndex * 7,
    );
    const weekEnd = new Date(
      overviewMonthAnchor.getFullYear(),
      overviewMonthAnchor.getMonth(),
      Math.min(
        7 + appliedWeekIndex * 7,
        new Date(overviewMonthAnchor.getFullYear(), overviewMonthAnchor.getMonth() + 1, 0).getDate(),
      ),
    );

    const yearStart = new Date(overviewYearAnchor, 0, 1);
    const yearEnd = new Date(overviewYearAnchor, 11, 31);

    const [periodStart, periodEnd, label] = rangeTab === 'week'
      ? [weekStart, weekEnd, `Week ${appliedWeekIndex + 1}: day ${weekStart.getDate()} - day ${weekEnd.getDate()}`]
      : rangeTab === 'year'
        ? [yearStart, yearEnd, `Year ${overviewYearAnchor}`]
        : [monthStart, monthEnd, formatMonthYear(overviewMonthAnchor)];

    const inPeriod = overviewTransactions.filter((item) => item.date >= periodStart && item.date <= periodEnd);
    const expense = inPeriod.reduce((sum, item) => sum + (item.amount < 0 ? Math.abs(item.amount) : 0), 0);
    const income = inPeriod.reduce((sum, item) => sum + (item.amount > 0 ? item.amount : 0), 0);

    return {
      label,
      expense,
      income,
    };
  }, [appliedWeekIndex, overviewMonthAnchor, overviewYearAnchor, rangeTab]);

  const openRangePicker = () => {
    setDraftRangeTab(rangeTab);
    setDraftOverviewMonthAnchor(overviewMonthAnchor);
    setDraftOverviewYearAnchor(overviewYearAnchor);
    setDraftOverviewYearWindowStart(overviewYearWindowStart);
    setDraftWeekIndex(appliedWeekIndex);
    setShowRangePicker(true);
  };

  const handleRangePickerApply = () => {
    setRangeTab(draftRangeTab);
    setOverviewMonthAnchor(draftOverviewMonthAnchor);
    setOverviewYearAnchor(draftOverviewYearAnchor);
    setOverviewYearWindowStart(draftOverviewYearWindowStart);
    setAppliedWeekIndex(draftWeekIndex);
    setShowRangePicker(false);
  };

  const handleRangePickerReset = () => {
    setDraftRangeTab('month');
    setDraftOverviewMonthAnchor(new Date(2025, 1, 1));
    setDraftOverviewYearAnchor(2025);
    setDraftOverviewYearWindowStart(2024);
  };

  const shiftDraftPeriod = (direction: -1 | 1) => {
    if (draftRangeTab === 'week') {
      setDraftOverviewMonthAnchor((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
      return;
    }

    if (draftRangeTab === 'month') {
      setDraftOverviewMonthAnchor((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
      return;
    }

    const newWindowStart = draftOverviewYearWindowStart + direction;
    setDraftOverviewYearWindowStart(newWindowStart);
    setDraftOverviewYearAnchor(newWindowStart + 1);
  };

  const shiftOverviewPeriod = (direction: -1 | 1) => {
    if (rangeTab === 'week') {
      let newWeekIndex = appliedWeekIndex + direction;
      let newMonthAnchor = new Date(overviewMonthAnchor);

      if (newWeekIndex < 0) {
        newMonthAnchor = new Date(overviewMonthAnchor.getFullYear(), overviewMonthAnchor.getMonth() - 1, 1);
        const daysInPrevMonth = new Date(newMonthAnchor.getFullYear(), newMonthAnchor.getMonth() + 1, 0).getDate();
        newWeekIndex = Math.floor((daysInPrevMonth - 1) / 7); 
      } else {
        const daysInCurrentMonth = new Date(overviewMonthAnchor.getFullYear(), overviewMonthAnchor.getMonth() + 1, 0).getDate();
        const maxWeekIndex = Math.floor((daysInCurrentMonth - 1) / 7);
        if (newWeekIndex > maxWeekIndex) {
          newMonthAnchor = new Date(overviewMonthAnchor.getFullYear(), overviewMonthAnchor.getMonth() + 1, 1);
          newWeekIndex = 0;
        }
      }
      setOverviewMonthAnchor(newMonthAnchor);
      setAppliedWeekIndex(newWeekIndex);
    } else if (rangeTab === 'year') {
      setOverviewYearAnchor((y) => y + direction);
      setOverviewYearWindowStart((y) => y + direction);
    } else {
      setOverviewMonthAnchor((d) => new Date(d.getFullYear(), d.getMonth() + direction, 1));
    }
  };

  const chartData = useMemo(() => {
    const toAverageTotal = (items: Array<{ date: Date; amount: number }>) => {
      const expense = items.reduce(
        (sum, item) => sum + (item.amount < 0 ? Math.abs(item.amount) : 0),
        0
      );

      const income = items.reduce(
        (sum, item) => sum + (item.amount > 0 ? item.amount : 0),
        0
      );

      return overviewActiveMetric === 'income' ? income : expense;
    };

    const addMonths = (date: Date, offset: number) => new Date(date.getFullYear(), date.getMonth() + offset, 1);
    const formatMonthYear = (date: Date) => {
      const month = monthLabels[date.getMonth()];
      return `${month} ${date.getFullYear()}`;
    };

    const weekStart = new Date(overviewMonthAnchor.getFullYear(), overviewMonthAnchor.getMonth(), 1 + appliedWeekIndex * 7);
    const weekEnd = new Date(overviewMonthAnchor.getFullYear(), overviewMonthAnchor.getMonth(), Math.min(7 + appliedWeekIndex * 7, new Date(overviewMonthAnchor.getFullYear(), overviewMonthAnchor.getMonth() + 1, 0).getDate()));

    const week = weekdayLabels.map((label, index) => {
      const dayOfWeek = index === 6 ? 0 : index + 1;
      const entries = overviewTransactions.filter(
        (item) =>
          item.date >= weekStart &&
          item.date <= weekEnd &&
          item.date.getDay() === dayOfWeek,
      );

      return {
        label,
        amount: toAverageTotal((entries)),
      };
    });

    const month = [-1, 0, 1].map((offset) => {
      const monthDate = addMonths(overviewMonthAnchor, offset);
      const entries = overviewTransactions.filter(
        (item) =>
          item.date.getFullYear() === monthDate.getFullYear() &&
          item.date.getMonth() === monthDate.getMonth(),
      );

      return {
        label: formatMonthYear(monthDate),
        amount: toAverageTotal(entries),
      };
    });

    const yearly = Array.from({ length: 3 }, (_, index) => {
      const yearValue = overviewYearWindowStart + index;
      return {
        label: `${yearValue}`,
        amount: toAverageTotal(overviewTransactions.filter((item) => item.date.getFullYear() === yearValue)),
      };
    });

    const year = monthLabels.map((label, monthIndex) => {
      const entries = overviewTransactions.filter(
        (item) => item.date.getFullYear() === overviewYearAnchor && item.date.getMonth() === monthIndex,
      );

      return {
        label,
        amount: toAverageTotal(entries),
      };
    });

    if (rangeTab === 'week') {
      return {
        title: 'Weekly Expenses',
        subtitle: formatMonthYear(overviewMonthAnchor),
        data: week,
      };
    }

    if (rangeTab === 'year') {
      return {
        title: 'Yearly Expenses',
        subtitle: `${overviewYearWindowStart} - ${overviewYearWindowStart + 2}`,
        data: yearly,
      };
    }

    return {
      title: 'Monthly Expenses',
      subtitle: formatMonthYear(overviewMonthAnchor),
      data: month,
    };
  }, [appliedWeekIndex, overviewMonthAnchor, overviewYearAnchor, overviewYearWindowStart, rangeTab, overviewActiveMetric]);

  const maxChartValue = Math.max(...chartData.data.map((item) => item.amount), 1);
  const chartTopLabels = useMemo(
    () => [4, 3, 2, 1, 0].map((step) => formatCompactMoney((maxChartValue * step) / 4)),
    [maxChartValue],
  );

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
    const isActive = draftRangeTab === tab;
    return (
      <Pressable key={tab} onPress={() => setDraftRangeTab(tab)} style={[styles.rangeTab, isActive && styles.rangeTabActive]}>
        <Text style={[styles.rangeText, isActive && styles.rangeTextActive]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={[styles.headerCard, { backgroundColor: colors.headerCard }]}>
        <View>
          <Text style={[styles.headerEyebrow, { color: colors.textMuted }]}>April 2026</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Analytics</Text>
        </View>
        <View style={styles.monthChangePill}>
          <Ionicons name="trending-down-outline" size={16} color="#16a34a" />
          <Text style={styles.monthChangeText}>-4.1% vs last month</Text>
        </View>
      </View>

      <View style={[styles.tabsRow, { backgroundColor: colors.tabsRow, borderColor: colors.tabBorder }]}>
        {renderTab('expenses', 'Expenses')}
        {renderTab('calendar', 'Calendar')}
        {renderTab('overview', 'Overview')}
      </View>

      {activeTab === 'expenses' ? (
        <View style={styles.expensesView}>
          <View style={styles.summaryGrid}>
            <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Total Spent</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{fmtVND(totalSpent)}</Text>
              <View style={styles.summaryTrendRow}>
                <Ionicons name="trending-down-outline" size={14} color="#16a34a" />
                <Text style={styles.summaryTrendPositive}>31,000 VND less</Text>
              </View>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Transactions</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>4 items</Text>
              <View style={styles.summaryTrendRow}>
                <Ionicons name="trending-up-outline" size={14} color="#f97316" />
                <Text style={styles.summaryTrendOrange}>+0 photo</Text>
              </View>
            </View>
          </View>

          <View style={[styles.panelCard, { backgroundColor: colors.card }]}>
            <View style={styles.panelHeaderRow}>
              <Text style={[styles.panelTitle, { color: colors.text }]}>Spending by Category</Text>
              <Text style={[styles.panelTotal, { color: colors.textSecondary }]}>{fmtVND(totalSpent)} total</Text>
            </View>

            <View style={styles.categoryGrid}>
              <View style={styles.donutWrap}>
                <Svg width="160" height="160" viewBox="0 0 160 160">
                  <G rotation="-90" origin="80, 80">
                    {(() => {
                      const radius = 56;
                      const strokeWidth = 32;
                      const circumference = 2 * Math.PI * radius;
                      let currentOffset = 0;

                      return totalExpensePercentages.map((item, index) => {
                        const strokeLength = (item.percentage / 100) * circumference;
                        const offset = -currentOffset;
                        currentOffset += strokeLength;
                        return (
                          <Circle
                            key={index}
                            cx="80"
                            cy="80"
                            r={radius}
                            stroke={item.color}
                            strokeWidth={strokeWidth}
                            fill="transparent"
                            strokeDasharray={`${strokeLength} ${circumference}`}
                            strokeDashoffset={offset}
                          />
                        );
                      });
                    })()}
                  </G>
                </Svg>
              </View>

              <View style={styles.categoryList}>
                {(showAllCategories ? totalExpensePercentages : totalExpensePercentages.slice(0, 3)).map((item) => (
                  <View key={item.name} style={styles.categoryItem}>
                    <View style={styles.categoryLineRow}>
                      <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
                      <Text style={[styles.categoryName, { color: colors.text }]}>{item.name}</Text>
                      <Text style={[styles.categoryPercent, { color: colors.textSecondary }]}>{item.percentage.toFixed(1)}%</Text>
                    </View>
                    <View style={[styles.categoryTrack, { backgroundColor: colors.border }]}>
                      <View style={[styles.categoryFill, { width: `${item.percentage}%`, backgroundColor: item.color }]} />
                    </View>
                  </View>
                ))}
                {totalExpensePercentages.length > 3 && (
                  <Pressable
                    style={styles.moreCategoriesButton}
                    onPress={() => setShowAllCategories(!showAllCategories)}
                  >
                    <Text style={[styles.moreCategoriesText, { color: colors.textSecondary }]}>
                      {showAllCategories ? 'Show less' : `+${totalExpensePercentages.length - 3} more`}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>

          <Text style={[styles.sectionHeading, { color: colors.sectionHeading }]}>All Transactions</Text>
          <View style={styles.transactionsList}>
            {groupedExpenseTransactions.map((g) => (
              <View key={g.date} style={styles.groupSection}>
                <Text style={[styles.groupDate, { color: colors.groupDate }]}>{g.date}</Text>
                <View style={styles.groupItemsWrap}>
                  {g.items.map((tx) => {
                    const categoryMeta = getAnalyticsCategoryMeta(tx.category);
                    return (
                      <View key={tx.id} style={[styles.transactionCard, { backgroundColor: colors.transactionCard }]}>
                        <View style={[styles.transactionIcon, { backgroundColor: categoryMeta.bgColor }]}>
                          <Ionicons name={categoryMeta.icon as any} size={22} color={categoryMeta.color} />
                        </View>
                        <View style={styles.transactionInfo}>
                          <Text style={[styles.transactionTitle, { color: colors.text }]}>{tx.title}</Text>
                          <Text style={[styles.transactionMeta, { color: colors.textMuted }]}>{tx.date} · {tx.time}</Text>
                        </View>
                        <View style={styles.transactionAmountWrap}>
                          <Text style={[
                            styles.transactionAmount,
                            tx.amount > 0 ? styles.transactionIncomeAmount : styles.transactionExpenseAmount,
                          ]}>
                            {tx.amount > 0 ? '+' : '-'}{fmtVND(tx.amount)}
                          </Text>
                          <Text style={[styles.transactionCategory, { color: colors.textMuted }]}>{categoryMeta.label}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {activeTab === 'calendar' ? (
        <View style={styles.calendarView}>
          <View style={styles.calendarCard}>
            <View style={styles.calendarToolbarRow}>
              <View style={styles.calendarMonthPicker}>
                <Pressable style={styles.calendarMonthNavButton}>
                  <Ionicons name="chevron-back" size={18} color="#64748b" />
                </Pressable>
                <Text style={styles.calendarMonth}>
                  {monthLabels[calendarMonthDate.getMonth()]} {calendarMonthDate.getFullYear()}
                </Text>
                <Pressable style={styles.calendarMonthNavButton}>
                  <Ionicons name="chevron-forward" size={18} color="#64748b" />
                </Pressable>
              </View>
            </View>

            <View style={styles.weekdayRow}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
                <Text key={day} style={styles.weekdayText}>{day}</Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {calendarDayData.map((item, idx) => {
                if (item.isEmpty) {
                  return <View key={`empty-${idx}`} style={styles.calendarCell} />;
                }
                const isHighlighted = item.hasTransactions;
                const isIncome = item.total > 0;
                const isSelected = selectedCalendarDay === item.day;
                const hasAmount = item.hasTransactions;
                return (
                  <Pressable
                    key={item.day}
                    style={styles.calendarCell}
                    onPress={() => setSelectedCalendarDay(item.day)}
                  >
                    <View style={[
                      styles.calendarDayBubble,
                      isHighlighted && (isIncome ? styles.calendarIncomeBubble : styles.calendarExpenseBubble),
                      isSelected && styles.calendarDayBubbleSelected,
                    ]}>
                      <Text style={[
                        styles.calendarDayNumber,
                        isHighlighted && (isIncome ? styles.calendarIncomeText : styles.calendarExpenseText),
                        isSelected && styles.calendarSelectedDayText,
                      ]}>{item.day}</Text>

                      {hasAmount ? (
                        <Text style={[
                          styles.calendarBubbleAmount,
                          item.total > 0 ? styles.calendarIncomeText : styles.calendarExpenseText,
                          isSelected && styles.calendarSelectedDayText,
                        ]}>
                          {item.total > 0 ? '+' : '-'}{formatCalendarAmount(item.total)}
                        </Text>
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.netMonthDivider} />
            <View style={styles.netMonthRow}>
              <Text style={styles.netMonthLabel}>Net this month</Text>
              <Text style={[styles.netMonthValue, netThisMonth >= 0 ? styles.calendarIncomeText : styles.calendarExpenseText]}>
                {netThisMonth >= 0 ? '+' : '-'}{fmtVND(netThisMonth)}
              </Text>
            </View>

            <View style={styles.selectedDaySection}>
              <View style={styles.selectedDayHeader}>
                <View style={styles.selectedDayTitleRow}>
                  <Ionicons name="calendar-outline" size={20} color="#334155" />
                  <Text style={styles.selectedDayTitle}>April {selectedCalendarDay}</Text>
                </View>
                <View style={styles.selectedDaySummary}>
                  <Text style={[styles.selectedDayNetAmount, selectedDayData.total >= 0 ? styles.calendarIncomeText : styles.calendarExpenseText]}>
                    {selectedDayData.total >= 0 ? '+' : '-'}{fmtVND(selectedDayData.total)}
                  </Text>
                  <Text style={styles.selectedDayNetLabel}>Net {selectedDayData.total >= 0 ? 'income' : 'expense'}</Text>
                </View>
              </View>

              <View style={styles.selectedDayList}>
                {selectedDayData.transactions.length > 0 ? (
                  selectedDayData.transactions.map((tx) => {
                    const categoryMeta = getAnalyticsCategoryMeta(tx.category);
                    const isIncome = tx.amount > 0;
                    return (
                      <View key={tx.id} style={styles.selectedDayItem}>
                        <View style={[styles.selectedDayIcon, { backgroundColor: categoryMeta.bgColor }]}>
                          <Ionicons name={categoryMeta.icon as any} size={22} color={categoryMeta.color} />
                        </View>
                        <View style={styles.selectedDayInfo}>
                          <Text style={styles.selectedDayTransactionTitle}>{tx.title}</Text>
                          <Text style={styles.selectedDayTransactionMeta}>Apr {tx.day} · {tx.time}</Text>
                        </View>
                        <View style={styles.selectedDayAmountWrap}>
                          <Text style={[styles.selectedDayAmount, isIncome ? styles.calendarIncomeText : styles.calendarExpenseText]}>
                            {isIncome ? '+' : '-'}{fmtVND(tx.amount)}
                          </Text>
                          <Text style={styles.selectedDayTransactionCategory}>{categoryMeta.label}</Text>
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.noTransactionsText}>No transactions for this day.</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      ) : null}

      {activeTab === 'overview' ? (
        <View style={styles.overviewView}>
          <View style={styles.overviewHeaderRow}>
            <View style={styles.overviewHeaderTitleRow}>
              <Text style={styles.overviewHeaderTitle}>Expense Overview</Text>
            </View>
          </View>

          <View style={styles.overviewCard}>
            <View style={styles.overviewMonthRow}>
              <Pressable
                style={styles.overviewMonthNavButton}
                onPress={() => shiftOverviewPeriod(-1)}
              >
                <Ionicons name="chevron-back" size={26} color="#4b5563" />
              </Pressable>
              <Pressable style={styles.overviewMonthLabelWrap} onPress={openRangePicker}>
                <Ionicons name="calendar-outline" size={18} color="#2b2b2b" />
                <Text style={styles.overviewMonthLabel}>{overviewSummary.label}</Text>
              </Pressable>
              <Pressable
                style={styles.overviewMonthNavButton}
                onPress={() => shiftOverviewPeriod(1)}
              >
                <Ionicons name="chevron-forward" size={26} color="#4b5563" />
              </Pressable>
            </View>

            <View style={styles.overviewSummaryGrid}>
              <Pressable
                style={[styles.overviewMetricCard, overviewActiveMetric === 'expenses' && styles.overviewMetricCardActive]}
                onPress={() => setOverviewActiveMetric('expenses')}
              >
                <View style={styles.overviewMetricTitleRow}>
                  <Text style={styles.overviewMetricTitle}>Expenses</Text>
                  <View style={[styles.metricArrowBadge, { backgroundColor: '#fff1f1' }]}>
                    <Ionicons name="arrow-down" size={14} color="#fe3939" />
                  </View>
                </View>
                <Text style={styles.overviewMetricValue}>{fmtVND(overviewSummary.expense)}</Text>
              </Pressable>

              <Pressable
                style={[styles.overviewMetricCard, overviewActiveMetric === 'income' && styles.overviewMetricCardActive]}
                onPress={() => setOverviewActiveMetric('income')}
              >
                <View style={styles.overviewMetricTitleRow}>
                  <Text style={styles.overviewMetricTitle}>Income</Text>
                  <View style={[styles.metricArrowBadge, { backgroundColor: '#f0fdf4' }]}>
                    <Ionicons name="arrow-up" size={14} color="#22c55e" />
                  </View>
                </View>
                <Text style={styles.overviewMetricValue}>{fmtVND(overviewSummary.income)}</Text>
              </Pressable>
            </View>

            {/* insight removed per request */}

            <View style={[styles.overviewChartBlock, { borderColor: colors.chartCardBorder, borderWidth: 1, borderRadius: 16, padding: 8, backgroundColor: colors.barTrackBg }]}>
              <View style={styles.overviewYAxisHeader}>
                <Text style={[styles.overviewYAxisLabel, { color: colors.chartLabelText }]}>(Million VND)</Text>
              </View>

              <View style={styles.barChartWrap}>
                <View style={styles.yAxisLabels}>
                  {chartTopLabels.map((label) => (
                    <Text key={label} style={[styles.yAxisLabel, { color: colors.chartLabelText }]}>{label}</Text>
                  ))}
                </View>
                <View style={styles.barChartArea}>
                  {chartData.data.map((item) => {
                    const height = Math.max(28, Math.round((item.amount / maxChartValue) * 190));
                    const isActive =
                      rangeTab === 'week' ||
                      (rangeTab === 'month' && item.label === chartData.data[1]?.label) ||
                      (rangeTab === 'year' && item.label === `${overviewYearAnchor}`);
                    return (
                      <View key={item.label} style={styles.barColumn}>
                        <View style={[styles.barTrack, { backgroundColor: colors.barTrackBg }]}>
                          <View
                            style={[
                              styles.barFill,
                              {
                                height,
                                backgroundColor: isActive ? colors.barFillActive : colors.barFillInactive,
                              },
                            ]}
                          />
                        </View>
                        <Text style={[styles.barMonth, { color: colors.chartLabelText }]}>{item.label}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>

          <Modal visible={showRangePicker} transparent animationType="fade" onRequestClose={() => setShowRangePicker(false)}>
            <Pressable style={styles.rangeModalOverlay} onPress={() => setShowRangePicker(false)}>
              <Pressable style={styles.rangeModalSheet} onPress={() => undefined}>
                <View style={styles.rangeModalHeaderRow}>
                  <Text style={styles.rangeModalTitle}>Choose chart period</Text>
                  <Pressable onPress={() => setShowRangePicker(false)} style={styles.rangeModalCloseButton}>
                    <Ionicons name="close" size={24} color="#2f3135" />
                  </Pressable>
                </View>

                <View style={styles.rangeModalTabsRow}>
                  {renderRangeTab('week', 'Week')}
                  {renderRangeTab('month', 'Month')}
                  {renderRangeTab('year', 'Year')}
                </View>

                <View style={styles.rangeModalContentCard}>
                  <View style={styles.rangeModalMiniHeader}>
                    <Pressable style={styles.rangeModalMiniNavButton} onPress={() => shiftDraftPeriod(-1)}>
                      <Ionicons name="chevron-back" size={22} color="#2f3135" />
                    </Pressable>
                    <Text style={styles.rangeModalMiniTitle}>
                      {draftRangeTab === 'year'
                        ? `${draftOverviewYearAnchor}`
                        : `${monthLabels[draftOverviewMonthAnchor.getMonth()]} ${draftOverviewMonthAnchor.getFullYear()}`}
                    </Text>
                    <Pressable style={styles.rangeModalMiniNavButton} onPress={() => shiftDraftPeriod(1)}>
                      <Ionicons name="chevron-forward" size={22} color="#2f3135" />
                    </Pressable>
                  </View>

                  {draftRangeTab === 'week' ? (
                    <View style={styles.rangeModalList}>
                      {[
                        'Week 1: day 27 - day 2',
                        'Week 2: day 3 - day 9',
                        'Week 3: day 10 - day 16',
                        'Week 4: day 17 - day 23',
                        'Week 5: day 24 - day 2',
                      ].map((item, idx) => {
                        const selected = idx === draftWeekIndex;
                        return (
                          <Pressable key={item} onPress={() => setDraftWeekIndex(idx)} style={[styles.rangeModalWeekItem, selected && styles.rangeModalWeekItemActive]}>
                            <Text style={[styles.rangeModalListItem, selected && styles.rangeModalListItemActive]}>
                              <Text style={styles.rangeModalListItemBold}>{item.split(':')[0]}:</Text> {item.split(':')[1].trim()}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : draftRangeTab === 'month' ? (
                    <View style={styles.rangeModalMonthGrid}>
                      {[
                        'Jan', 'Feb', 'Mar',
                        'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep',
                        'Oct', 'Nov', 'Dec',
                      ].map((month, index) => {
                        const selected = index === draftOverviewMonthAnchor.getMonth();
                        return (
                          <Pressable
                            key={month}
                            onPress={() => setDraftOverviewMonthAnchor(new Date(draftOverviewMonthAnchor.getFullYear(), index, 1))}
                            style={[styles.rangeModalMonthItem, selected && styles.rangeModalMonthItemActive]}
                          >
                            <Text style={[styles.rangeModalMonthText, selected && styles.rangeModalMonthTextActive]}>{month}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : (
                    <View style={styles.rangeModalYearGrid}>
                      {Array.from({ length: 3 }, (_, index) => draftOverviewYearWindowStart + index).map((year) => (
                        <Pressable
                          key={year}
                          onPress={() => setDraftOverviewYearAnchor(year)}
                          style={[styles.rangeModalYearItem, year === draftOverviewYearAnchor && styles.rangeModalYearItemActive]}
                        >
                          <Text style={[styles.rangeModalYearText, year === draftOverviewYearAnchor && styles.rangeModalYearTextActive]}>{year}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.rangeModalFooterRow}>
                  <Pressable style={styles.rangeModalFooterButtonOutline} onPress={handleRangePickerReset}>
                    <Text style={styles.rangeModalFooterButtonOutlineText}>Clear filter</Text>
                  </Pressable>
                  <Pressable style={styles.rangeModalFooterButtonFill} onPress={handleRangePickerApply}>
                    <Text style={styles.rangeModalFooterButtonFillText}>Apply</Text>
                  </Pressable>
                </View>
              </Pressable>
            </Pressable>
          </Modal>
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
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
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
    fontSize: 12,
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
    paddingTop: 12,
    paddingBottom: 10,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94a3b8',
  },
  tabTextActive: {
    color: '#1f4f95',
  },
  tabIndicator: {
    height: 2,
    width: '52%',
    marginTop: 10,
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
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 18,
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
    fontSize: 12,
    fontWeight: '700',
    color: '#16a34a',
  },
  summaryTrendOrange: {
    fontSize: 12,
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
    fontSize: 15,
    fontWeight: '900',
    color: '#334155',
  },
  panelSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  panelTotal: {
    fontSize: 15,
    color: '#94a3b8',
    fontWeight: '800',
  },
  categoryGrid: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 24,
  },
  donutWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  categoryList: {
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
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  categoryPercent: {
    fontSize: 13,
    fontWeight: '900',
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
  moreCategoriesButton: {
    alignItems: 'center',
    paddingTop: 8,
    marginTop: 4,
  },
  moreCategoriesText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '900',
    color: '#334155',
    marginTop: 2,
    marginBottom: 2,
  },
  transactionsList: {
    gap: 12,
  },
  groupSection: {
    marginBottom: 6,
  },
  groupDate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 8,
    marginLeft: 4,
  },
  groupItemsWrap: {
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
    fontSize: 18,
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
    fontWeight: '700',
  },
  transactionAmountWrap: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 4,
  },
  transactionExpenseAmount: {
    color: '#ef4444',
  },
  transactionIncomeAmount: {
    color: '#16a34a',
  },
  transactionCategory: {
    fontSize: 14,
    color: '#8da0c0',
    fontWeight: '600',
  },
  calendarView: {
    gap: 12,
  },
  calendarCard: {
    backgroundColor: '#ffffff',
    borderRadius: 26,
    padding: 14,
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
    fontSize: 16,
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
    marginBottom: 10,
  },
  calendarCell: {
    width: '14.2857%',
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    paddingVertical: 4,
  },
  calendarDayBubble: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  calendarDayBubbleSelected: {
    backgroundColor: '#1C4D8D',
    borderWidth: 0,
    shadowColor: '#1C4D8D',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
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
  calendarBubbleAmount: {
    fontSize: 8,
    fontWeight: '900',
    lineHeight: 10,
    textAlign: 'center',
  },
  calendarSelectedDayText: {
    color: '#ffffff',
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
    marginTop: 8,
    marginBottom: 10,
  },
  selectedDayList: {
    gap: 6,
    marginBottom: 10,
  },
  selectedDayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  selectedDayIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  selectedDayInfo: {
    flex: 1,
  },
  selectedDayTransactionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  selectedDayTransactionMeta: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  selectedDayAmountWrap: {
    alignItems: 'flex-end',
  },
  selectedDayAmount: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  selectedDayTransactionCategory: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  noTransactionsText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
    paddingVertical: 8,
  },
  calendarToolbarRow: {
    marginBottom: 20,
  },
  calendarMonthPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calendarMonthNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  netMonthDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginTop: 24,
    marginBottom: 16,
  },
  netMonthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netMonthLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8',
  },
  netMonthValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  selectedDaySection: {
    marginTop: 28,
  },
  selectedDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  selectedDayTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectedDayTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#334155',
  },
  selectedDaySummary: {
    alignItems: 'flex-end',
  },
  selectedDayNetAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  selectedDayNetLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94a3b8',
    marginTop: 2,
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
  overviewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  overviewHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  overviewHeaderTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2f3135',
  },
  trendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  trendButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ec4899',
  },
  overviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 14,
    shadowColor: '#1e293b',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 2,
  },
  overviewMonthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  overviewMonthNavButton: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewMonthLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  overviewMonthLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2f3135',
  },
  overviewSummaryGrid: {
    flexDirection: 'row',
    gap: 0,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 18,
    overflow: 'hidden',
  },
  overviewMetricCard: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
  },
  overviewMetricCardActive: {
    borderWidth: 2,
    borderColor: '#f59ac8',
    margin: -1,
  },
  overviewMetricTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  overviewMetricTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#404040',
  },
  metricArrowBadge: {
    width: 16,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1fbf3',
  },
  overviewMetricValue: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '900',
    color: '#2f3135',
    letterSpacing: -0.4,
  },
  overviewInsightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    backgroundColor: '#f3fbf5',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  overviewInsightLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  overviewInsightShield: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewInsightText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#16a34a',
    lineHeight: 20,
  },
  overviewInsightSubText: {
    fontWeight: '600',
    color: '#64748b',
  },
  overviewChartBlock: {
    marginTop: 12,
  },
  overviewYAxisHeader: {
    marginBottom: 4,
  },
  overviewYAxisLabel: {
    fontSize: 12,
    color: '#7c7c7c',
    fontWeight: '700',
  },
  rangeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  rangeModalSheet: {
    backgroundColor: '#f8f8fc',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 18,
  },
  rangeModalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rangeModalTitle: {
    flex: 1,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
    color: '#2f3135',
    textAlign: 'center',
    marginRight: 24,
  },
  rangeModalCloseButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -32,
  },
  rangeModalTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 4,
    marginBottom: 14,
  },
  rangeModalContentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 12,
    minHeight: 280,
  },
  rangeModalMiniHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#d7e2ff',
  },
  rangeModalMiniNavButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rangeModalMiniTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2f3135',
  },
  rangeModalList: {
    gap: 14,
    paddingVertical: 10,
  },
  rangeModalWeekItem: {
    borderRadius: 12,
    paddingVertical: 6,
  },
  rangeModalWeekItemActive: {
    backgroundColor: '#f3f5ff',
  },
  rangeModalListItemActive: {
    color: '#1f2b6c',
    fontWeight: '800',
  },
  rangeModalListItem: {
    fontSize: 16,
    lineHeight: 22,
    color: '#4b5563',
  },
  rangeModalListItemBold: {
    fontWeight: '800',
    color: '#2f3135',
  },
  rangeModalMonthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  rangeModalMonthItem: {
    width: '30%',
    minHeight: 46,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  rangeModalMonthItemActive: {
    backgroundColor: '#ec4899',
  },
  rangeModalMonthText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  rangeModalMonthTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  rangeModalYearGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
  },
  rangeModalYearItem: {
    flex: 1,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  rangeModalYearItemActive: {
    backgroundColor: '#ec4899',
  },
  rangeModalYearText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  rangeModalYearTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  rangeModalFooterRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  rangeModalFooterButtonOutline: {
    flex: 1,
    minHeight: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1f6feb',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  rangeModalFooterButtonOutlineText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1f6feb',
  },
  rangeModalFooterButtonFill: {
    flex: 1,
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: '#1f6feb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rangeModalFooterButtonFillText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
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
    fontSize: 10,
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
    fontSize: 12,
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