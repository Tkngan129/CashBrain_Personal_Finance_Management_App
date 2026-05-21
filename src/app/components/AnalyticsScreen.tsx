import { resolveCategoryMeta } from '@/constants/categories';
import { CalendarAnalysisResponse, useAnalysis } from '@/src/context/analysisContext';
import { useExpenses } from '@/src/context/expenseContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  onTransactionPress?: (tx: any) => void;
  
}

export function AnalyticsScreen({ onAddTransaction, onTransactionPress }: AnalyticsScreenProps) {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('expenses');
  const [rangeTab, setRangeTab] = useState<RangeTab>('month');
  const [draftRangeTab, setDraftRangeTab] = useState<RangeTab>('month');
  // Lấy thời điểm hiện tại
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // 1. Month Anchor: Khởi tạo là tháng hiện tại, ngày 1
  const [overviewMonthAnchor, setOverviewMonthAnchor] = useState(new Date(currentYear, currentMonth, 1));
  const [draftOverviewMonthAnchor, setDraftOverviewMonthAnchor] = useState(new Date(currentYear, currentMonth, 1));

  // 2. Year Anchor: Khởi tạo là năm hiện tại
  const [overviewYearAnchor, setOverviewYearAnchor] = useState(currentYear);
  const [draftOverviewYearAnchor, setDraftOverviewYearAnchor] = useState(currentYear);

  // 3. Year Window Start: Thường khởi tạo trước năm hiện tại một khoảng (ví dụ 2 năm) để tạo danh sách chọn
  const [overviewYearWindowStart, setOverviewYearWindowStart] = useState(currentYear - 2);
  const [draftOverviewYearWindowStart, setDraftOverviewYearWindowStart] = useState(currentYear - 2);

  // 4. Week Index: Tính toán tuần hiện tại trong tháng (Tùy chọn)
  // Nếu bạn muốn mặc định là tuần 1 thì giữ 0. 
  // Nếu muốn tuần hiện tại, cần một hàm logic tính toán index tuần.
  const [draftWeekIndex, setDraftWeekIndex] = useState(0); 
  const [appliedWeekIndex, setAppliedWeekIndex] = useState(0);

  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(1);
  const [calendarMonthDate, setCalendarMonthDate] = useState(new Date());
  const [showRangePicker, setShowRangePicker] = useState(false);
  const [overviewActiveMetric, setOverviewActiveMetric] = useState<'expenses' | 'income'>('expenses');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const colors = useColors();

  const { fetchCalendarAnalysis, calendarAnalysis, fetchMonthlyAnalysis, monthlyAnalysis, fetchOverviewTransactionsAnalysis, overviewTransactionsAnalysis} = useAnalysis();
  const { expenses, transactions} = useExpenses();

  useEffect( () => {
    fetchCalendarAnalysis();
    fetchMonthlyAnalysis();
    fetchOverviewTransactionsAnalysis();
    const currentDate = new Date();
    const today = currentDate.getDate();
    setSelectedCalendarDay(today);
  }, [fetchCalendarAnalysis, fetchMonthlyAnalysis, fetchOverviewTransactionsAnalysis]);

  useEffect(() => {
    fetchCalendarAnalysis(calendarMonthDate.toISOString());
  }, [calendarMonthDate, fetchCalendarAnalysis]);

  

  const groupedExpenseTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    // 1. Nhóm các giao dịch theo ngày (Key bây giờ là "2026-05-09")
    const groups = transactions.reduce<Record<string, typeof transactions[number][]>>((acc, tx) => {
      const key = tx.date; // "2026-05-09"
      if (!acc[key]) acc[key] = [];
      acc[key].push(tx);
      return acc;
    }, {});

    // 2. Chuyển object thành array và sắp xếp
    return Object.keys(groups)
      .sort((a, b) => {
        // Vì định dạng YYYY-MM-DD có thể so sánh trực tiếp bằng chuỗi hoặc chuyển về timestamp
        // Sắp xếp giảm dần (ngày mới nhất lên đầu)
        return new Date(b).getTime() - new Date(a).getTime();
      })
      .map((date) => ({
        date, // "2026-05-09"
        // Bạn có thể format lại date ở đây để hiển thị đẹp hơn trên UI nếu muốn (VD: "May 09")
        items: groups[date]
      }));
  }, [transactions]); // Quan trọng: Phải thêm dependency để hàm chạy lại khi có dữ liệu mới

  const getAnalyticsCategoryMeta = (category: string) => resolveCategoryMeta(category);

  const totalExpensePercentages = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();        // 0-based (0-11)
    const currentYear = today.getFullYear();

    // 1. Lọc expense của tháng hiện tại
    const currentMonthExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return (
            expDate.getMonth() === currentMonth &&
            expDate.getFullYear() === currentYear
        );
    });

    // 2. Group by category_name
    const grouped = currentMonthExpenses.reduce((acc, expense) => {
        const categoryName = expense.category_name || 'Uncategorized';

        if (!acc[categoryName]) {
            acc[categoryName] = {
                category_name: categoryName,
                category_color: expense.category_color || '#6b7280',
                category_icon: expense.category_icon || '',
                category_bg_color: expense.category_bg_color || '',
                totalAmount: 0,
                count: 0,
            };
        }

        acc[categoryName].totalAmount += Number(expense.amount) || 0;
        acc[categoryName].count += 1;

        return acc;
    }, {} as Record<string, any>);

    // 3. Tính tổng chi tiêu của tháng
    const totalSpent = Object.values(grouped).reduce(
        (sum, cat) => sum + cat.totalAmount, 
        0
    );

    // 4. Tính percentage và chuyển về array
    return Object.values(grouped)
            .map(category => ({
                ...category,
                percentage: totalSpent > 0 
                    ? Math.round((category.totalAmount / totalSpent) * 100) 
                    : 0,
            }))
            .sort((a, b) => b.totalAmount - a.totalAmount); // sắp xếp theo số tiền giảm dần
    }, [expenses]);

  const calendarDayData = useMemo(() => {
    const year = calendarMonthDate.getFullYear();
    const month = calendarMonthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Calculate padding for Monday start (0: Mon, 1: Tue... 6: Sun)
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const paddingCount = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    type CalendarDayItem = {
      day: number;
      transactions: CalendarAnalysisResponse[];
      total: number;
      hasTransactions: boolean;
      isEmpty: boolean;
    };

    const days: CalendarDayItem[] = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const transactions = calendarAnalysis.filter((tx) => tx.day === day);
      const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
      return {
        day,
        transactions,
        total,
        hasTransactions: transactions.length > 0,
        isEmpty: false,
      };
    });
    
    const padded: CalendarDayItem[] = Array.from({ length: paddingCount }, (_, idx) => ({
      day: -1 - idx,
      transactions: [] as CalendarAnalysisResponse[],
      total: 0,
      hasTransactions: false,
      isEmpty: true,
    })).concat(days);
    
    return padded;
  }, [calendarMonthDate, calendarAnalysis]);

  const selectedDayData = useMemo(
    () => calendarDayData.find((item) => item.day === selectedCalendarDay && !item.isEmpty) ?? calendarDayData.find(item => !item.isEmpty) ?? calendarDayData[0],
    [calendarDayData, selectedCalendarDay],
  );

  const shiftCalendarMonth = (offset: number) => {
    setCalendarMonthDate((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + offset);
      return next;
    });
  };

  const START_OF_WEEK = 1; // Monday = 1, Sunday = 0 (có thể đưa vào state nếu cần dynamic)

  const getStartOfWeek = useCallback((date: Date, startOfWeek: number = START_OF_WEEK): Date => {
    const d = new Date(date);
    const day = d.getDay(); // 0 (CN) -> 6 (T7)
    const diff = (day - startOfWeek + 7) % 7;
    d.setDate(d.getDate() - diff);
    return d;
  }, []);

  const getWeekIndexOfMonth = useCallback((date: Date, startOfWeek: number = START_OF_WEEK): number => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const startOfFirstWeek = getStartOfWeek(firstDayOfMonth, startOfWeek);
    const diffDays = Math.floor((date.getTime() - startOfFirstWeek.getTime()) / (86400000));
    return Math.floor(diffDays / 7);
  }, [getStartOfWeek]);

  const getWeekRangeInMonth = useCallback((
    year: number,
    month: number,
    weekIndex: number,
    startOfWeek: number = START_OF_WEEK
  ): { start: Date; end: Date } => {
    const firstDayOfMonth = new Date(year, month, 1);
    const startOfFirstWeek = getStartOfWeek(firstDayOfMonth, startOfWeek);
    const start = new Date(startOfFirstWeek);
    start.setDate(startOfFirstWeek.getDate() + weekIndex * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start, end };
  }, [getStartOfWeek]);

  /**
 * Trả về mảng các tuần trong một tháng cụ thể
 * Mỗi phần tử: { index, label, startDate, endDate }
 */
  const getWeekRangesInMonth = useCallback((year: number, month: number, startOfWeek: number = START_OF_WEEK) => {
  const firstDayOfMonth = new Date(year, month, 1);
    const startOfFirstWeek = getStartOfWeek(firstDayOfMonth, startOfWeek);
    
    const weeks = [];
    let weekStart = new Date(startOfFirstWeek);
    let weekIndex = 0;
    
    // Lặp cho đến khi vượt quá tháng hiện tại
    while (weekStart <= new Date(year, month + 1, 0)) {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      // Format label: "Week X: day D1 [M1] - day D2 [M2]"
      const startDay = weekStart.getDate();
      const startMonth = weekStart.getMonth();
      const endDay = weekEnd.getDate();
      const endMonth = weekEnd.getMonth();
      
      let startLabel = `${startDay}`;
      let endLabel = `${endDay}`;
      if (startMonth !== month) startLabel += ` ${monthLabels[startMonth]}`;
      if (endMonth !== month) endLabel += ` ${monthLabels[endMonth]}`;
      if (startMonth === endMonth && startMonth !== month) {
        // Cả tuần nằm ở tháng khác (vd cuối tháng trước hoặc đầu tháng sau)
        startLabel = `${startDay} ${monthLabels[startMonth]}`;
        endLabel = `${endDay} ${monthLabels[endMonth]}`;
      }
      
      const label = `Week ${weekIndex + 1}: ${startLabel} - ${endLabel}`;
      
      weeks.push({
        index: weekIndex,
        label,
        startDate: new Date(weekStart),
        endDate: weekEnd,
      });
      
      weekStart.setDate(weekStart.getDate() + 7);
      weekIndex++;
    }
    
    return weeks;
  }, [getStartOfWeek]);

  const getTotalWeeksInMonth = useCallback((year: number, month: number, startOfWeek: number = START_OF_WEEK): number => {
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const weekIndexOfLastDay = getWeekIndexOfMonth(lastDayOfMonth, startOfWeek);
    return weekIndexOfLastDay + 1;
  }, [getWeekIndexOfMonth]);

  const overviewSummary = useMemo(() => {
    const formatMonthYear = (date: Date) => `${monthLabels[date.getMonth()]} ${date.getFullYear()}`;

    let periodStart: Date;
    let periodEnd: Date;
    let label: string;

    // 1. Xác định khoảng thời gian (Period) dựa trên rangeTab
    if (rangeTab === 'week') {
      const { start, end } = getWeekRangeInMonth(
        overviewMonthAnchor.getFullYear(),
        overviewMonthAnchor.getMonth(),
        appliedWeekIndex,
        START_OF_WEEK
      );
      periodStart = start;
      periodEnd = end;
      label = `Week ${appliedWeekIndex + 1}: ${start.getDate()} ${monthLabels[start.getMonth()]} - ${end.getDate()} ${monthLabels[end.getMonth()]}`;
    } else if (rangeTab === 'year') {
      periodStart = new Date(overviewYearAnchor, 0, 1);
      periodEnd = new Date(overviewYearAnchor, 11, 31, 23, 59, 59); // Cuối ngày của năm
      label = `Year ${overviewYearAnchor}`;
    } else {
      // Mặc định là 'month'
      periodStart = new Date(overviewMonthAnchor.getFullYear(), overviewMonthAnchor.getMonth(), 1);
      periodEnd = new Date(overviewMonthAnchor.getFullYear(), overviewMonthAnchor.getMonth() + 1, 0, 23, 59, 59);
      label = formatMonthYear(overviewMonthAnchor);
    }

    // 2. Lọc và Tính toán (Chỉ lặp qua mảng 1 lần để tối ưu hiệu năng)
    let expense = 0;
    let income = 0;

    overviewTransactionsAnalysis.forEach((item) => {
      const itemDate = new Date(item.date[0], item.date[1] - 1, item.date[2]); // Chuyển từ [year, month, day] sang Date
      if (itemDate >= periodStart && itemDate <= periodEnd) {
        const amountNum = parseFloat(item.amount);
        if (amountNum < 0) {
          expense += Math.abs(amountNum);
        } else {
          income += amountNum;
        }
      }
    });

    return {
      label,
      expense,
      income,
    };
    // Thêm overviewTransactions vào dependencies
  }, [appliedWeekIndex, overviewMonthAnchor, overviewYearAnchor, rangeTab, overviewTransactionsAnalysis, getWeekRangeInMonth]);

  useEffect( () => {
    console.log("\n\n\nOVERVIEW SUMMARY: " + overviewSummary.expense);
  }, [overviewSummary]);

  const openRangePicker = () => {
    setDraftRangeTab(rangeTab);
    setDraftOverviewMonthAnchor(overviewMonthAnchor);
    setDraftOverviewYearAnchor(overviewYearAnchor);
    setDraftOverviewYearWindowStart(overviewYearWindowStart);
    setDraftWeekIndex(appliedWeekIndex);
    setShowRangePicker(true);

    // Đảm bảo draftWeekIndex nằm trong khoảng tuần thực tế của tháng hiện tại
    const weeks = getWeekRangesInMonth(
      draftOverviewMonthAnchor.getFullYear(),
      draftOverviewMonthAnchor.getMonth(),
      START_OF_WEEK
    );
    if (draftWeekIndex >= weeks.length) {
      setDraftWeekIndex(0);
    }

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
    setDraftOverviewMonthAnchor(new Date());
    setDraftOverviewYearAnchor(new Date().getFullYear());
    setDraftOverviewYearWindowStart(new Date().getFullYear() - 1);
  };

  const shiftDraftPeriod = (direction: -1 | 1) => {
    if (draftRangeTab === 'week') {
      // Chuyển tháng
      const newMonthAnchor = new Date(
        draftOverviewMonthAnchor.getFullYear(),
        draftOverviewMonthAnchor.getMonth() + direction,
        1
      );
      setDraftOverviewMonthAnchor(newMonthAnchor);
      
      // Tính lại số tuần của tháng mới và điều chỉnh draftWeekIndex nếu cần
      const weeksInNewMonth = getWeekRangesInMonth(
        newMonthAnchor.getFullYear(),
        newMonthAnchor.getMonth(),
        START_OF_WEEK
      );
      let newWeekIndex = draftWeekIndex;
      if (newWeekIndex >= weeksInNewMonth.length) {
        newWeekIndex = weeksInNewMonth.length - 1;
      }
      if (newWeekIndex < 0) newWeekIndex = 0;
      setDraftWeekIndex(newWeekIndex);
      return;
    }

    if (draftRangeTab === 'month') {
      setDraftOverviewMonthAnchor((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
      return;
    }

    // Year tab
    const newWindowStart = draftOverviewYearWindowStart + direction;
    setDraftOverviewYearWindowStart(newWindowStart);
    setDraftOverviewYearAnchor(newWindowStart + 1);
  };

  const shiftOverviewPeriod = (direction: -1 | 1) => {
    if (rangeTab === 'week') {
      let newWeekIndex = appliedWeekIndex + direction;
      let newMonthAnchor = new Date(overviewMonthAnchor);

      const totalWeeksInCurrentMonth = getTotalWeeksInMonth(
        newMonthAnchor.getFullYear(),
        newMonthAnchor.getMonth(),
        START_OF_WEEK
      );

      if (newWeekIndex < 0) {
        // Lùi về tháng trước, lấy tuần cuối cùng của tháng đó
        newMonthAnchor = new Date(overviewMonthAnchor.getFullYear(), overviewMonthAnchor.getMonth() - 1, 1);
        newWeekIndex = getTotalWeeksInMonth(
          newMonthAnchor.getFullYear(),
          newMonthAnchor.getMonth(),
          START_OF_WEEK
        ) - 1;
      } else if (newWeekIndex >= totalWeeksInCurrentMonth) {
        // Tiến sang tháng sau, lấy tuần đầu tiên
        newMonthAnchor = new Date(overviewMonthAnchor.getFullYear(), overviewMonthAnchor.getMonth() + 1, 1);
        newWeekIndex = 0;
      }

      setOverviewMonthAnchor(newMonthAnchor);
      setAppliedWeekIndex(newWeekIndex);
    } 
    else if (rangeTab === 'year') {
      setOverviewYearAnchor((y) => y + direction);
      setOverviewYearWindowStart((y) => y + direction);
    } 
    else {
      // rangeTab === 'month'
      setOverviewMonthAnchor((d) => new Date(d.getFullYear(), d.getMonth() + direction, 1));
    }
  };

  const chartData = useMemo(() => {
    // Helper tính tổng chi hoặc thu dựa trên overviewActiveMetric
    const toAverageTotal = (items: { date: Date; amount: number }[]) => {
      if (items.length === 0){ return 0;}
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

      const addMonths = (date: Date, offset: number) =>
        new Date(date.getFullYear(), date.getMonth() + offset, 1);

      const formatMonthYear = (date: Date) =>
        `${monthLabels[date.getMonth()]} ${date.getFullYear()}`;

      // ---------- TAB WEEK ----------
      if (rangeTab === 'week') {
        // Lấy đầu và cuối tuần đúng dựa trên appliedWeekIndex và START_OF_WEEK
        const { start: weekStart, end: weekEnd } = getWeekRangeInMonth(
          overviewMonthAnchor.getFullYear(),
          overviewMonthAnchor.getMonth(),
          appliedWeekIndex,
          START_OF_WEEK
        );

        // Sắp xếp nhãn các ngày trong tuần bắt đầu từ START_OF_WEEK (Thứ Hai)
        const orderedWeekdays = () => {
          const labels = [...weekdayLabels]; // ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
          const startIndex = START_OF_WEEK === 1 ? 0 : 6; // Monday → 0, Sunday → 6
          return [...labels.slice(startIndex), ...labels.slice(0, startIndex)];
        };
        const dayLabels = orderedWeekdays();

        const weekData = dayLabels.map((label, idx) => {
          // currentDay: giá trị getDay() tương ứng (0=CN, 1=T2, ..., 6=T7)
          const currentDay = (START_OF_WEEK + idx) % 7;
          const entries = overviewTransactionsAnalysis.filter((item) => {
            const itemDate = new Date(item.date[0], item.date[1] - 1, item.date[2]);
            return itemDate >= weekStart && itemDate <= weekEnd && itemDate.getDay() === currentDay;
          });
          return {
            label,
            amount: toAverageTotal(entries.map(e => ({ date: new Date(e.date[0], e.date[1] - 1, e.date[2]), amount: Number(e.amount) }))),
          };
        });

        return {
          title: 'Weekly Expenses',
          subtitle: `Week ${appliedWeekIndex + 1}, ${formatMonthYear(overviewMonthAnchor)}`,
          data: weekData,
        };
      }

      // ---------- TAB YEAR (cửa sổ 3 năm) ----------
      if (rangeTab === 'year') {
        const yearlyData = Array.from({ length: 3 }, (_, index) => {
          const yearValue = overviewYearWindowStart + index;
          const filteredItems = overviewTransactionsAnalysis.filter((item) => item.date[0] === yearValue);
          return {
            label: `${yearValue}`,
            amount: toAverageTotal(
              filteredItems.map(e => ({ date: new Date(e.date[0], e.date[1] - 1, e.date[2]), amount: Number(e.amount) }))
            ),
          };
        });
        return {
          title: 'Yearly Expenses',
          subtitle: `${overviewYearWindowStart} - ${overviewYearWindowStart + 2}`,
          data: yearlyData,
        };
      }

      // ---------- TAB MONTH (mặc định, hiển thị 3 tháng: trước, hiện tại, sau) ----------
      const monthData = [-1, 0, 1].map((offset) => {
        const monthDate = addMonths(overviewMonthAnchor, offset);
        const entries = overviewTransactionsAnalysis.filter(
          (item) =>
            item.date[0] === monthDate.getFullYear() &&
            item.date[1] - 1 === monthDate.getMonth()
        );

        return {
          label: formatMonthYear(monthDate),
          amount: toAverageTotal(entries.map(e => ({ date: new Date(e.date[0], e.date[1] - 1, e.date[2]), amount: Number(e.amount) }))),
        };
      });

      return {
        title: 'Monthly Expenses',
        subtitle: formatMonthYear(overviewMonthAnchor),
        data: monthData,
      };
    }, [
      appliedWeekIndex,
      overviewMonthAnchor,
      overviewYearWindowStart,
      rangeTab,
      overviewActiveMetric,
      getWeekRangeInMonth,
      overviewTransactionsAnalysis,
    ]);

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
          <Text style={[styles.headerEyebrow, { color: colors.textMuted }]}>{(() => {
            const date = new Date();
            const formatted = date.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            });
            return formatted; 
          })()}</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Analytics</Text>
        </View>
        <View style={(monthlyAnalysis?.percentage_transaction_against_last_month ?? 0) < 0 ? styles.monthChangePillDown : styles.monthChangePillUp}>
          <Ionicons 
            name={(monthlyAnalysis?.percentage_transaction_against_last_month ?? 0) < 0 ? "trending-down-outline" : "trending-up-outline"} 
            size={16} 
            color={(monthlyAnalysis?.percentage_transaction_against_last_month ?? 0) < 0 ? "#16a34a" : "#ff1313"} />
          <Text 
            style={(monthlyAnalysis?.percentage_transaction_against_last_month ?? 0) < 0 ? styles.monthChangeTextDown : styles.monthChangeTextUp}
          >{monthlyAnalysis?.percentage_transaction_against_last_month}% vs last month</Text>
        </View>
      </View>

      <View style={[styles.tabsRow, { backgroundColor: colors.tabsRow, borderColor: colors.tabBorder }]}>
        {renderTab('expenses', 'Expenses')}
        {renderTab('calendar', 'Calendar')}
        {renderTab('overview', 'Overview')}
      </View>

      {activeTab === 'expenses' ? (
        <View style={styles.expensesView}>
          {/* EXPENSE - SUMMARY */}
          <View style={styles.summaryGrid}>
            <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Total Spent</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{fmtVND(monthlyAnalysis?.total_expense || 0)}</Text>
              <View style={styles.summaryTrendRow}>
                {(monthlyAnalysis?.balance ?? 0) < 0 ? (
                  <>
                    <View style={styles.summaryTrendRow}>
                      <Ionicons
                        name="warning-outline"
                        size={14}
                        color="#dc2626"
                      />

                      <Text style={styles.summaryTrendNegative}>
                        Overspent {fmtVND(Math.abs(monthlyAnalysis?.balance || 0))}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.summaryTrendRow}>
                      <Ionicons
                        name="wallet-outline"
                        size={14}
                        color="#16a34a"
                      />

                      <Text style={styles.summaryTrendPositive}>
                        Remaining {fmtVND(monthlyAnalysis?.balance || 0)}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Transactions</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{monthlyAnalysis?.number_of_expense_image} items</Text>
              <View style={styles.summaryTrendRow}>
                <Ionicons 
                  name={(monthlyAnalysis?.number_image_against_last_month ?? 0) > 0 ? "trending-up-outline" : "trending-down-outline"} 
                  size={14} 
                  color={(monthlyAnalysis?.number_image_against_last_month ?? 0) > 0 ? "#f97316" : "#16a34a"} 
                />
                <Text 
                  style={(monthlyAnalysis?.number_image_against_last_month ?? 0) > 0 ? styles.summaryTrendUp : styles.summaryTrendDown}>
                  {`${monthlyAnalysis?.number_image_against_last_month}`} photo
                </Text>
              </View>
            </View>
          </View>

          {/* EXPENSE - CIRCLE CHART */}
          <View style={[styles.panelCard, { backgroundColor: colors.card }]}>
            <View style={styles.panelHeaderRow}>
              <Text style={[styles.panelTitle, { color: colors.text }]}>Spending by Category</Text>
              <Text style={[styles.panelTotal, { color: colors.textMuted }]}></Text>
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
                            stroke={item.category_color}
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
                {(showAllCategories ? totalExpensePercentages : totalExpensePercentages.slice(0, 3)).map((item, index) => (
                  <View key={index} style={styles.categoryItem}>
                    <View style={styles.categoryLineRow}>
                      <View style={[styles.categoryDot, { backgroundColor: item.category_color }]} />
                      <Text style={[styles.categoryName, { color: colors.text }]}>{item.category_name}</Text>
                      <Text style={[styles.categoryPercent, { color: colors.textSecondary }]}>{item.percentage.toFixed(1)}%</Text>
                    </View>
                    <View style={[styles.categoryTrack, { backgroundColor: colors.border }]}>
                      <View style={[styles.categoryFill, { width: `${item.percentage}%`, backgroundColor: item.category_color }]} />
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
          
          {/* EXPENSE - GROUP EXPENSE TRANSACTIONS */}
          <Text style={[styles.sectionHeading, { color: colors.sectionHeading }]}>All Transactions</Text>
          <View style={styles.transactionsList}>
            {groupedExpenseTransactions.map((g, index) => (
              <View key={index} style={styles.groupSection}>
                <Text style={[styles.groupDate, { color: colors.groupDate }]}>
                  {(() => {
                    const date = new Date(g.date);

                    const formatted = date.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });

                    return formatted.replace(/ (\d{4})$/, ", $1");
                  })()}
                </Text>
                <View style={styles.groupItemsWrap}>
                  {g.items.map((tx, index) => {
                    return (
                      <Pressable key={index} onPress={() => onTransactionPress?.(tx)} style={[styles.transactionCard, { backgroundColor: colors.transactionCard }]}>
                        <View style={[styles.transactionIcon, { backgroundColor: tx.category_bg_color || '#ecfdf5'}]}>
                          <Ionicons name={tx.category_icon as any || 'wallet-outline'} size={22} color={tx.category_color || '#22c55e'} />
                        </View>
                        <View style={styles.transactionInfo}>
                          <Text style={[styles.transactionTitle, { color: colors.text }]}>{tx.note}</Text>
                          <Text style={[styles.transactionMeta, { color: colors.textMuted }]}>{tx.date} </Text>
                        </View>
                        <View style={styles.transactionAmountWrap}>
                          <Text style={[
                            styles.transactionAmount,
                            tx.type === 'Income' ? styles.transactionIncomeAmount : styles.transactionExpenseAmount,
                          ]}>
                            {tx.type === 'Income' ? '+' : '-'}{fmtVND(tx.amount)}
                          </Text>
                          <Text style={[styles.transactionCategory, { color: colors.textMuted }]}>{tx.category_name}</Text>
                        </View>
                      </Pressable>
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
                {/* BACK MONTH PRESS BUTTON */}
                <Pressable style={styles.calendarMonthNavButton} onPress={() => shiftCalendarMonth(-1)}>
                  <Ionicons name="chevron-back" size={18} color="#64748b" />
                </Pressable>
                <Text style={styles.calendarMonth}>
                  {monthLabels[calendarMonthDate.getMonth()]} {calendarMonthDate.getFullYear()}
                </Text>
                {/* NEXT MONTH PRESS BUTTON */}
                <Pressable style={styles.calendarMonthNavButton} onPress={() => shiftCalendarMonth(1)}>
                  <Ionicons name="chevron-forward" size={18} color="#64748b" />
                </Pressable>
              </View>
            </View>

            <View style={styles.weekdayRow}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <Text key={index} style={styles.weekdayText}>{day}</Text>
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
                    key={idx}
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
                    const categoryMeta = getAnalyticsCategoryMeta(tx.category.toString());
                    const isIncome = tx.amount > 0;
                    return (
                      <Pressable key={tx.id} onPress={() => onTransactionPress?.(tx)} style={styles.selectedDayItem}>
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
                      </Pressable>
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
                style={[styles.overviewMetricCard, overviewActiveMetric === 'expenses' && styles.overviewMetricCardActiveLeft]}
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
                style={[styles.overviewMetricCard, overviewActiveMetric === 'income' && styles.overviewMetricCardActiveRight]}
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
                <Text style={[styles.overviewYAxisLabel, { color: colors.chartLabelText }]}>(VND)</Text>
              </View>

              <View style={styles.barChartWrap}>
                <View style={styles.yAxisLabels}>
                  {chartTopLabels.map((label, idx) => (
                    <Text key={idx} style={[styles.yAxisLabel, { color: colors.chartLabelText }]}>{label}</Text>
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
                      {(() => {
                        const weeks = getWeekRangesInMonth(
                          draftOverviewMonthAnchor.getFullYear(),
                          draftOverviewMonthAnchor.getMonth(),
                          START_OF_WEEK
                        );
                        return weeks.map((week: any) => {
                          const selected = week.index === draftWeekIndex;
                          return (
                            <Pressable
                              key={week.index}
                              onPress={() => setDraftWeekIndex(week.index)}
                              style={[styles.rangeModalWeekItem, selected && styles.rangeModalWeekItemActive]}
                            >
                              <Text style={[styles.rangeModalListItem, selected && styles.rangeModalListItemActive]}>
                                {week.label}
                              </Text>
                            </Pressable>
                          );
                        });
                      })()}
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
  monthChangePillDown: {
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
  monthChangePillUp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#ff1313',
    backgroundColor: '#fae1df',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    marginTop: 10,
  },
  monthChangeTextDown: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f8f2a',
  },
  monthChangeTextUp: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ff1313',
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
    flex: 1,
    fontSize: 12,
    flexShrink: 1,
    fontWeight: '700',
    color: '#16a34a',
  },
  summaryTrendNegative: {
    flex: 1,
    fontSize: 12,
    flexShrink: 1,
    fontWeight: '700',
    color: '#dc2626',
  },
  summaryTrendUp: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f97316',
  },
  summaryTrendDown: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16a34a',
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
  overviewMetricCardActiveLeft: {
    borderWidth: 2,
    borderColor: '#f59ac8',
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    margin: -1,
  },
  overviewMetricCardActiveRight: {
    borderWidth: 2,
    borderColor: '#f59ac8',
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
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