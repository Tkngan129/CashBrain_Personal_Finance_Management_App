import {
    CalendarDays, Camera,
    Car,
    ChevronLeft, ChevronRight,
    Coffee,
    GraduationCap,
    ShoppingBag,
    TrendingDown, TrendingUp,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer, Tooltip,
    XAxis, YAxis,
} from 'recharts';
import { useTransactions } from '../context/TransactionContext';
import { AnimatePresence, motion } from '../lib/motion';

// ─── Currency helper ──────────────────────────────────────────────────────────
const fmtVND = (n: number) => `${Math.abs(n).toLocaleString('en-US')} VND`;
const fmtVNDSigned = (n: number) => `${n > 0 ? '+' : '-'}${Math.abs(n).toLocaleString('en-US')} VND`;

// ─── Shared Style ─────────────────────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.92)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(28,77,141,0.08)',
  boxShadow: '0 2px 20px rgba(28,77,141,0.07), 0 1px 4px rgba(0,0,0,0.03)',
  borderRadius: '20px',
};

// ─── Chart data ───────────────────────────────────────────────────────────────
const monthlyData = [
  { month: 'Nov', current: 850, previous: 920 },
  { month: 'Dec', current: 920, previous: 880 },
  { month: 'Jan', current: 780, previous: 850 },
  { month: 'Feb', current: 680, previous: 920 },
  { month: 'Mar', current: 750, previous: 780 },
  { month: 'Apr', current: 719, previous: 750 },
];
const weeklyData = [
  { day: 'Mon', amount: 120_000 }, { day: 'Tue', amount: 45_000 },  { day: 'Wed', amount: 280_000 },
  { day: 'Thu', amount: 95_000 },  { day: 'Fri', amount: 399_000 }, { day: 'Sat', amount: 60_000 },
  { day: 'Sun', amount: 45_000 },
];

// ─── Pastel pie colours ───────────────────────────────────────────────────────
const categoryData = [
  { name: 'Education', value: 399_000, color: '#c4b5fd', percentage: 55.5 },
  { name: 'Shopping',  value: 250_000, color: '#fdba74', percentage: 34.8 },
  { name: 'Food',      value:  45_000, color: '#fca5a5', percentage:  6.3 },
  { name: 'Transport', value:  25_000, color: '#fde047', percentage:  3.4 },
];

// ─── Transaction data ────────────────────────────────────────────────────────
type Tx = {
  id: number | string; title: string; category: string; amount: number;
  date: string; time: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string; bg: string;
  imageDataUrl?: string;
};

const allTransactions: Tx[] = [
  { id: 1,  title: 'Online Course',       category: 'Education',  amount: -399_000,   date: 'Apr 10', time: '2:15 PM', icon: GraduationCap, color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 2,  title: 'New Clothes',         category: 'Shopping',   amount: -250_000,   date: 'Apr 9',  time: '3:45 PM', icon: ShoppingBag,   color: '#f97316', bg: '#fff7ed' },
  { id: 3,  title: 'Coffee & Breakfast',  category: 'Food',       amount: -45_000,    date: 'Apr 11', time: '9:30 AM', icon: Coffee,        color: '#f87171', bg: '#fef2f2' },
  { id: 4,  title: 'Grab to Uni',         category: 'Transport',  amount: -25_000,    date: 'Apr 9',  time: '8:30 AM', icon: Car,           color: '#eab308', bg: '#fefce8' },
];

// ─── Calendar data ────────────────────────────────────────────────────────────
// Positive = net income day, Negative = net expense day
const dayNet: Record<number, number> = {
  1:  +4_000_000,   // Monthly Allowance (income)
  5:    -45_000,    // Bubble Tea
  9:   -275_000,    // New Clothes + Grab to Uni
  10:  -399_000,    // Online Course
  11:   -45_000,    // Coffee & Breakfast
  14:  -180_000,    // Groceries + Bus pass
  17:   -65_000,    // Lunch set
  20:  -155_000,    // Lunch out + Grab rides
  23:   -95_000,    // Stationery
};

const dayTransactions: Record<number, Tx[]> = {
  1: [
    { id: 10, title: 'Monthly Allowance', category: 'Income', amount: 4_000_000, date: 'Apr 1', time: '8:00 AM', icon: Wallet, color: '#22c55e', bg: '#f0fdf4' },
  ],
  5: [
    { id: 20, title: 'Bubble Tea', category: 'Food', amount: -45_000, date: 'Apr 5', time: '3:00 PM', icon: Coffee, color: '#f87171', bg: '#fef2f2' },
  ],
  9: [
    { id: 2, title: 'New Clothes', category: 'Shopping', amount: -250_000, date: 'Apr 9', time: '3:45 PM', icon: ShoppingBag, color: '#f97316', bg: '#fff7ed' },
    { id: 4, title: 'Grab to Uni', category: 'Transport', amount: -25_000,  date: 'Apr 9', time: '8:30 AM', icon: Car,         color: '#eab308', bg: '#fefce8' },
  ],
  10: [
    { id: 1, title: 'Online Course', category: 'Education', amount: -399_000, date: 'Apr 10', time: '2:15 PM', icon: GraduationCap, color: '#8b5cf6', bg: '#f5f3ff' },
  ],
  11: [
    { id: 3, title: 'Coffee & Breakfast', category: 'Food', amount: -45_000, date: 'Apr 11', time: '9:30 AM', icon: Coffee, color: '#f87171', bg: '#fef2f2' },
  ],
  14: [
    { id: 30, title: 'Groceries', category: 'Shopping',  amount: -120_000, date: 'Apr 14', time: '11:00 AM', icon: ShoppingBag,   color: '#f97316', bg: '#fff7ed' },
    { id: 31, title: 'Bus pass',  category: 'Transport', amount: -60_000,  date: 'Apr 14', time: '8:00 AM',  icon: Car,           color: '#eab308', bg: '#fefce8' },
  ],
  17: [
    { id: 40, title: 'Lunch set', category: 'Food', amount: -65_000, date: 'Apr 17', time: '12:00 PM', icon: Coffee, color: '#f87171', bg: '#fef2f2' },
  ],
  20: [
    { id: 50, title: 'Lunch out',   category: 'Food',      amount: -80_000, date: 'Apr 20', time: '12:30 PM', icon: Coffee, color: '#f87171', bg: '#fef2f2' },
    { id: 51, title: 'Grab rides',  category: 'Transport', amount: -75_000, date: 'Apr 20', time: '4:00 PM',  icon: Car,    color: '#eab308', bg: '#fefce8' },
  ],
  23: [
    { id: 60, title: 'Stationery', category: 'Shopping', amount: -95_000, date: 'Apr 23', time: '2:00 PM', icon: ShoppingBag, color: '#f97316', bg: '#fff7ed' },
  ],
};

// ─── Types ────────────────────────────────────────────────────────────────────
type SubTab     = 'expenses' | 'calendar' | 'overview';
type TimePeriod = 'week' | 'month' | 'year';

// ─── Tooltip ─────────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'white', border: '1px solid rgba(28,77,141,0.12)',
      borderRadius: 12, padding: '8px 12px',
      boxShadow: '0 4px 16px rgba(28,77,141,0.12)', fontSize: 12, color: '#0f1729',
    }}>
      <p style={{ color: '#64748b', marginBottom: 2 }}>{label}</p>
      <p style={{ fontWeight: 700 }}>{fmtVND(payload[0].value * 1000)}</p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
export function AnalyticsScreen() {
  const { photoTransactions } = useTransactions();

  // Tab order: Expenses → Calendar → Overview
  const [subTab, setSubTab] = useState<SubTab>('expenses');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // ── Merge photo transactions into static data ──────────────────────────────
  const photoTxList: Tx[] = photoTransactions.map(pt => ({
    id:           pt.id,
    title:        pt.title,
    category:     pt.category,
    amount:       pt.amount,
    date:         pt.date,
    time:         pt.createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    icon:         Camera,
    color:        pt.categoryColor,
    bg:           pt.categoryBg,
    imageDataUrl: pt.imageDataUrl,
  }));
  const mergedTxList: Tx[] = [...photoTxList, ...allTransactions];

  // Merged calendar data
  const mergedDayNet: Record<number, number>  = { ...dayNet };
  const mergedDayTxs: Record<number, Tx[]>         = Object.fromEntries(
    Object.entries(dayTransactions).map(([k, v]) => [k, [...v]]),
  );
  photoTransactions.forEach(pt => {
    const day = parseInt(pt.dateISO.split('-')[2], 10);
    if (day >= 1 && day <= 30) {
      mergedDayNet[day] = (mergedDayNet[day] || 0) + pt.amount;   // signed
      if (!mergedDayTxs[day]) mergedDayTxs[day] = [];
      mergedDayTxs[day] = [
        {
          id: pt.id, title: pt.title, category: pt.category, amount: pt.amount,
          date: pt.date,
          time: pt.createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          icon: Camera, color: pt.categoryColor, bg: pt.categoryBg,
          imageDataUrl: pt.imageDataUrl,
        },
        ...mergedDayTxs[day],
      ];
    }
  });
  // ──────────────────────────────────────────────────────────────────────────

  const weekDays    = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const days        = Array.from({ length: 30 }, (_, i) => i + 1);
  const firstOffset = 3;

  const tabs: { id: SubTab; label: string }[] = [
    { id: 'expenses', label: 'Expenses' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'overview', label: 'Overview' },
  ];

  // ── Transaction item renderer (shared by Expenses + Calendar) ─────────────
  const renderTxItem = (t: Tx, i: number, delayBase = 0) => {
    const Icon = t.icon;
    const isIncome = t.amount > 0;
    return (
      <motion.div
        key={t.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delayBase + i * 0.05 }}
        className="flex items-center gap-3 p-3.5 rounded-2xl"
        style={cardStyle}
      >
        {t.imageDataUrl ? (
          <div className="relative flex-shrink-0">
            <img
              src={t.imageDataUrl}
              alt={t.title}
              className="w-10 h-10 rounded-xl object-cover"
              style={{ border: '1.5px solid rgba(28,77,141,0.1)' }}
            />
            <div
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white"
              style={{ background: '#1C4D8D' }}
            >
              <Camera style={{ width: 7, height: 7 }} className="text-white" />
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: t.bg }}>
            <Icon style={{ width: 18, height: 18, color: t.color }} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-slate-800 text-sm font-semibold truncate">{t.title}</p>
          <p className="text-slate-400 text-xs mt-0.5">{t.date} · {t.time}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p
            className="text-sm font-bold"
            style={{ color: isIncome ? '#16a34a' : '#dc2626' }}
          >
            {isIncome ? '+' : '-'}{Math.abs(t.amount).toLocaleString('en-US')} VND
          </p>
          <p className="text-slate-400 text-xs">{t.category}</p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#f8fafc]">

      {/* ── Sticky Header ── */}
      <div className="flex-shrink-0 bg-white px-5 pt-5 pb-0" style={{ borderBottom: '1px solid #f1f5f9' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-slate-400 font-medium">April 2026</p>
            <p className="text-slate-800 font-bold" style={{ fontSize: '1.2rem' }}>Analytics</p>
          </div>
          <div className="px-3 py-1.5 rounded-full flex items-center gap-1.5"
            style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <TrendingDown className="w-3.5 h-3.5 text-green-600" />
            <span className="text-green-700 text-xs font-semibold">-4.1% vs last month</span>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className="flex-1 py-2.5 text-sm font-semibold relative transition-colors"
              style={{ color: subTab === tab.id ? '#1C4D8D' : '#94a3b8' }}
            >
              {tab.label}
              {subTab === tab.id && (
                <motion.div
                  layoutId="analytics-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: '#1C4D8D' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <AnimatePresence mode="wait">

          {/* ══════════════════ EXPENSES ══════════════════ */}
          {subTab === 'expenses' && (
            <motion.div key="expenses"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
              className="px-4 pt-4 pb-6 space-y-3"
            >
              {/* Summary stats */}
              <div className="grid grid-cols-2 gap-3">
                <div style={cardStyle} className="p-4">
                  <p className="text-slate-400 text-xs mb-1">Total Spent</p>
                  <p className="text-slate-800 font-bold" style={{ fontSize: '1rem' }}>719,000 VND</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="w-3 h-3 text-green-500" />
                    <span className="text-green-600 text-xs font-medium">31,000 VND less</span>
                  </div>
                </div>
                <div style={cardStyle} className="p-4">
                  <p className="text-slate-400 text-xs mb-1">Transactions</p>
                  <p className="text-slate-800 font-bold" style={{ fontSize: '1rem' }}>{mergedTxList.length} items</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-orange-400" />
                    <span className="text-orange-500 text-xs font-medium">+{photoTransactions.length} photo</span>
                  </div>
                </div>
              </div>

              {/* Pie chart card */}
              <div style={cardStyle} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-slate-700 font-semibold" style={{ fontSize: '0.88rem' }}>Spending by Category</p>
                  <span className="text-xs text-slate-400">719,000 VND total</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-40 h-40 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%" cy="50%"
                          innerRadius={44} outerRadius={68}
                          paddingAngle={3} dataKey="value"
                          stroke="none"
                        >
                          {categoryData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v: number) => [fmtVND(v), 'Amount']}
                          contentStyle={{
                            background: 'white', border: '1px solid rgba(28,77,141,0.12)',
                            borderRadius: 12, fontSize: 12,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2.5">
                    {categoryData.map((cat) => (
                      <div key={cat.name}>
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                            <span className="text-xs text-slate-600">{cat.name}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-700">{cat.percentage}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${cat.percentage}%` }}
                            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ background: cat.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Transaction list — merged with photo expenses */}
              <div>
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <p className="text-slate-700 font-semibold" style={{ fontSize: '0.88rem' }}>All Transactions</p>
                  {photoTransactions.length > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"
                      style={{ background: '#EEF4FF', color: '#1C4D8D' }}>
                      <Camera style={{ width: 10, height: 10 }} />
                      {photoTransactions.length} photo
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {mergedTxList.map((t, i) => renderTxItem(t, i))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════ CALENDAR ══════════════════ */}
          {subTab === 'calendar' && (
            <motion.div key="calendar"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
              className="px-4 pt-4 pb-6 space-y-3"
            >
              {/* Calendar card */}
              <div style={cardStyle} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <button className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#f1f5f9' }}>
                    <ChevronLeft className="w-4 h-4 text-slate-500" />
                  </button>
                  <p className="text-slate-700 font-semibold text-sm">April 2026</p>
                  <button className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#f1f5f9' }}>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-1">
                  {weekDays.map((d, i) => (
                    <div key={i} className="text-center">
                      <span className="text-[11px] font-semibold text-slate-400">{d}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstOffset }).map((_, i) => (
                    <div key={`e-${i}`} className="aspect-square" />
                  ))}
                  {days.map((date) => {
                    const net        = mergedDayNet[date];
                    const isSelected = selectedDate === date;
                    const hasData    = net !== undefined;
                    const isGreen    = hasData && net > 0;
                    const isRed      = hasData && net < 0;
                    const hasPhoto   = (mergedDayTxs[date] || []).some(t => t.imageDataUrl);

                    // Cell background & text when not selected
                    const cellBg = isGreen
                      ? { background: '#f0fdf4', border: '1px solid rgba(22,163,74,0.2)' }
                      : isRed
                        ? { background: '#fef2f2', border: '1px solid rgba(220,38,38,0.15)' }
                        : { background: 'transparent' };

                    const numColor = isSelected ? 'white'
                      : isGreen ? '#16a34a'
                      : isRed   ? '#dc2626'
                      : '#94a3b8';

                    const amtColor = isSelected ? 'rgba(255,255,255,0.85)'
                      : isGreen ? '#16a34a'
                      : '#dc2626';

                    const absK = hasData ? Math.round(Math.abs(net) / 1000) : 0;
                    const amtLabel = hasData
                      ? (net > 0 ? `+${absK}K` : `-${absK}K`)
                      : '';

                    return (
                      <motion.button
                        key={date}
                        whileTap={{ scale: 0.86 }}
                        onClick={() => setSelectedDate(date === selectedDate ? null : date)}
                        className="aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-150 relative"
                        style={
                          isSelected
                            ? { background: '#1C4D8D', boxShadow: '0 4px 12px rgba(28,77,141,0.32)' }
                            : cellBg
                        }
                      >
                        <span
                          className="text-xs font-semibold leading-none"
                          style={{ color: numColor }}
                        >
                          {date}
                        </span>
                        {hasData && (
                          <span
                            className="leading-none mt-0.5"
                            style={{ fontSize: '7px', fontWeight: 700, color: amtColor }}
                          >
                            {amtLabel}
                          </span>
                        )}
                        {/* Camera dot for photo transactions */}
                        {hasPhoto && !isSelected && (
                          <span
                            className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
                            style={{ background: '#1C4D8D' }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Net this month</span>
                  {(() => {
                    const totalNet = Object.values(mergedDayNet).reduce((a, b) => a + b, 0);
                    const isPos = totalNet >= 0;
                    return (
                      <span className="font-bold text-sm" style={{ color: isPos ? '#16a34a' : '#dc2626' }}>
                        {isPos ? '+' : '-'}{Math.abs(totalNet).toLocaleString('en-US')} VND
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Tap-to-reveal transaction panel */}
              <AnimatePresence mode="wait">
                {selectedDate !== null ? (
                  <motion.div
                    key={selectedDate}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="flex items-center justify-between px-1 mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: '#EEF4FF' }}>
                          <CalendarDays className="w-4 h-4" style={{ color: '#1C4D8D' }} />
                        </div>
                        <p className="text-slate-700 font-semibold text-sm">April {selectedDate}</p>
                      </div>
                      {mergedDayNet[selectedDate] !== undefined && (() => {
                        const net = mergedDayNet[selectedDate];
                        const isPos = net > 0;
                        return (
                          <div className="text-right">
                            <span
                              className="text-xs font-bold"
                              style={{ color: isPos ? '#16a34a' : '#dc2626' }}
                            >
                              {isPos ? '+' : '-'}{Math.abs(net).toLocaleString('en-US')} VND
                            </span>
                            <p className="text-slate-400" style={{ fontSize: '10px' }}>
                              {isPos ? 'Net income' : 'Net expense'}
                            </p>
                          </div>
                        );
                      })()}
                    </div>

                    {(mergedDayTxs[selectedDate] || []).length > 0 ? (
                      <div className="space-y-2">
                        {(mergedDayTxs[selectedDate] || []).map((t, i) => renderTxItem(t, i, 0.02))}
                      </div>
                    ) : (
                      <div
                        className="py-10 flex flex-col items-center gap-2 rounded-2xl"
                        style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid #f1f5f9' }}
                      >
                        <CalendarDays className="w-8 h-8 text-slate-200" />
                        <p className="text-slate-400 text-sm">No transactions on April {selectedDate}</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-2xl"
                    style={{ background: 'rgba(28,77,141,0.04)', border: '1px dashed rgba(28,77,141,0.18)' }}
                  >
                    <CalendarDays className="w-4 h-4 flex-shrink-0" style={{ color: '#1C4D8D' }} />
                    <p className="text-slate-500 text-xs">
                      Tap a <span className="font-semibold" style={{ color: '#1C4D8D' }}>highlighted date</span> to view that day's transactions
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ══════════════════ OVERVIEW ══════════════════ */}
          {subTab === 'overview' && (
            <motion.div key="overview"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
              className="px-4 pt-4 pb-6 space-y-3"
            >
              {/* Summary stats */}
              <div className="grid grid-cols-2 gap-3">
                <div style={cardStyle} className="p-4">
                  <p className="text-slate-400 text-xs mb-1">Total Spent</p>
                  <p className="text-slate-800 font-bold" style={{ fontSize: '1rem' }}>719,000 VND</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="w-3 h-3 text-green-500" />
                    <span className="text-green-600 text-xs font-medium">31,000 VND less</span>
                  </div>
                </div>
                <div style={cardStyle} className="p-4">
                  <p className="text-slate-400 text-xs mb-1">Transactions</p>
                  <p className="text-slate-800 font-bold" style={{ fontSize: '1rem' }}>4 items</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-orange-400" />
                    <span className="text-orange-500 text-xs font-medium">+1 vs last month</span>
                  </div>
                </div>
              </div>

              {/* Time filter */}
              <div style={cardStyle} className="p-1.5 flex gap-1">
                {(['week', 'month', 'year'] as TimePeriod[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setTimePeriod(p)}
                    className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={
                      timePeriod === p
                        ? { background: '#1C4D8D', color: 'white', boxShadow: '0 4px 12px rgba(28,77,141,0.3)' }
                        : { color: '#94a3b8' }
                    }
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>

              {/* Bar chart */}
              <div style={cardStyle} className="p-5">
                <p className="text-slate-700 font-semibold mb-1" style={{ fontSize: '0.88rem' }}>
                  {timePeriod === 'week' ? 'Daily Spending (VND)' : 'Monthly Spending (K VND)'}
                </p>
                <p className="text-slate-400 text-xs mb-4">
                  {timePeriod === 'week' ? 'This week' : 'Last 6 months'}
                </p>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    {timePeriod === 'week' ? (
                      <BarChart data={weeklyData} barSize={22}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 10 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(28,77,141,0.04)', radius: 6 }} />
                        <Bar dataKey="amount" radius={[6, 6, 3, 3]}>
                          {weeklyData.map((e, i) => (
                            <Cell key={i} fill={e.day === 'Fri' ? '#1C4D8D' : '#e2e8f0'} />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : (
                      <BarChart data={monthlyData} barSize={18} barGap={3}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 10 }} tickFormatter={(v) => `${v}K`} />
                        <Tooltip
                          formatter={(v: number, name: string) => [`${v},000 VND`, name === 'current' ? 'Current' : 'Previous']}
                          contentStyle={{ background: 'white', border: '1px solid rgba(28,77,141,0.12)', borderRadius: 12, fontSize: 12 }}
                          cursor={{ fill: 'rgba(28,77,141,0.04)', radius: 6 }}
                        />
                        <Bar dataKey="previous" fill="#e2e8f0" radius={[4, 4, 2, 2]} />
                        <Bar dataKey="current"  fill="#1C4D8D" radius={[4, 4, 2, 2]} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
                {timePeriod === 'month' && (
                  <div className="flex items-center justify-center gap-5 mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-2.5 rounded-sm bg-[#1C4D8D]" />
                      <span className="text-xs text-slate-400">Current</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-2.5 rounded-sm bg-[#e2e8f0]" />
                      <span className="text-xs text-slate-400">Previous</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}