import {
  Bell, Wallet, ArrowUp, ArrowDown, TrendingUp,
  Receipt, Banknote,
  Coffee, ShoppingBag, Car, GraduationCap, Sparkles, ChevronRight, Camera,
} from 'lucide-react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { useTransactions } from '../context/TransactionContext';

type Screen = 'home' | 'analytics' | 'add' | 'chat' | 'me';

// ─── Currency helper ─────────────────────────────────────────────────────────
const fmtVND = (n: number) => `${Math.abs(n).toLocaleString('en-US')} VND`;
const fmtVNDSigned = (n: number) => `${n > 0 ? '+' : '-'}${Math.abs(n).toLocaleString('en-US')} VND`;

// ─── Budget constants ─────────────────────────────────────────────────────────
const TOTAL_BUDGET = 4_000_000;
const TOTAL_SPENT  = 719_000;
const REMAINING    = TOTAL_BUDGET - TOTAL_SPENT;
const SPENT_PCT    = Math.round((TOTAL_SPENT / TOTAL_BUDGET) * 100);   // 18%
const REMAINING_PCT = 100 - SPENT_PCT;                                  // 82%

// ─── Data ─────────────────────────────────────────────────────────────────────
const weekData = [
  { day: 'Mon', amount: 120_000 },
  { day: 'Tue', amount: 45_000 },
  { day: 'Wed', amount: 280_000 },
  { day: 'Thu', amount: 95_000 },
  { day: 'Fri', amount: 399_000 },
  { day: 'Sat', amount: 60_000 },
  { day: 'Sun', amount: 45_000 },
];

const recentTransactions = [
  { id: 1, title: 'Coffee & Breakfast', category: 'Food',      amount: -45_000,    date: 'Today 9:30', icon: Coffee,        color: '#f87171', bg: '#fef2f2' },
  { id: 2, title: 'Online Course',      category: 'Education', amount: -399_000,   date: 'Yesterday',  icon: GraduationCap, color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 3, title: 'Monthly Allowance',  category: 'Income',    amount: 4_000_000,  date: 'Apr 10',     icon: Wallet,        color: '#22c55e', bg: '#f0fdf4' },
  { id: 4, title: 'New Clothes',        category: 'Shopping',  amount: -250_000,   date: 'Apr 9',      icon: ShoppingBag,   color: '#f97316', bg: '#fff7ed' },
  { id: 5, title: 'Grab to Uni',        category: 'Transport', amount: -25_000,    date: 'Apr 9',      icon: Car,           color: '#eab308', bg: '#fefce8' },
];

// ─── Shared card style ────────────────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(28,77,141,0.08)',
  boxShadow: '0 2px 20px rgba(28,77,141,0.07), 0 1px 4px rgba(0,0,0,0.03)',
  borderRadius: '20px',
};

interface DashboardScreenProps {
  onNavigate: (s: Screen) => void;
  onAddTransaction: (type: 'expense' | 'income') => void;
}

// ─── Unified display type ─────────────────────────────────────────────────────
type DisplayTx = {
  id: string | number;
  title: string;
  category: string;
  amount: number;
  date: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  bg: string;
  imageDataUrl?: string;
};

export function DashboardScreen({ onNavigate, onAddTransaction }: DashboardScreenProps) {
  const { photoTransactions } = useTransactions();

  // Merge photo transactions (newest first) with static recent transactions
  const staticTxs: DisplayTx[] = recentTransactions.map(t => ({
    id: t.id, title: t.title, category: t.category, amount: t.amount,
    date: t.date, icon: t.icon, color: t.color, bg: t.bg,
  }));
  const photoTxs: DisplayTx[] = photoTransactions.slice(0, 5).map(pt => ({
    id: pt.id, title: pt.title, category: pt.category, amount: pt.amount,
    date: pt.date, color: pt.categoryColor, bg: pt.categoryBg,
    imageDataUrl: pt.imageDataUrl,
  }));
  const mergedRecent = [...photoTxs, ...staticTxs].slice(0, 6);

  return (
    <div className="h-full overflow-y-auto bg-[#f8fafc]" style={{ scrollbarWidth: 'none' }}>

      {/* ── Status bar ── */}
      <div className="px-5 pt-5 pb-2 bg-white flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 font-medium">Good morning 👋</p>
          <p className="text-slate-800 font-bold" style={{ fontSize: '1.05rem' }}>Ngan Tran</p>
        </div>
        <button
          className="w-9 h-9 rounded-2xl flex items-center justify-center relative"
          style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}
        >
          <Bell style={{ width: 18, height: 18 }} className="text-slate-500" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: '#1C4D8D', border: '1.5px solid white' }}
          />
        </button>
      </div>

      {/* ── Balance Hero Card ── */}
      <div className="px-4 pt-3 pb-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1C4D8D 0%, #1e5fa8 55%, #1a7a90 100%)',
            boxShadow: '0 12px 40px rgba(28,77,141,0.35)',
          }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'rgba(158,211,220,0.15)' }} />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.06)' }} />

          <div className="relative">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-white/65 text-xs font-medium mb-1">Total Balance</p>
                <p className="text-white font-bold" style={{ fontSize: '2rem', lineHeight: 1.1 }}>
                  {fmtVND(REMAINING)}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <TrendingUp className="w-3.5 h-3.5 text-[#9ED3DC]" />
                  <span className="text-[#9ED3DC] text-xs font-medium">+8.2% this month</span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.18)' }}>
                <Wallet style={{ width: 22, height: 22 }} className="text-white" />
              </div>
            </div>

            {/* Income / Expense sub-boxes */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-3.5" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-green-400/25 flex items-center justify-center">
                    <ArrowUp className="w-3.5 h-3.5 text-green-300" />
                  </div>
                  <span className="text-white/70 text-xs">Income</span>
                </div>
                <p className="text-white font-bold" style={{ fontSize: '0.95rem' }}>4,000,000</p>
                <p className="text-white/50 text-[10px]">VND</p>
              </div>
              <div className="rounded-2xl p-3.5" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-orange-400/25 flex items-center justify-center">
                    <ArrowDown className="w-3.5 h-3.5 text-orange-300" />
                  </div>
                  <span className="text-white/70 text-xs">Expenses</span>
                </div>
                <p className="text-white font-bold" style={{ fontSize: '0.95rem' }}>719,000</p>
                <p className="text-white/50 text-[10px]">VND</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Main Content ── */}
      <div className="px-4 space-y-3 pb-6">

        {/* Quick Actions — each button pre-selects type */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="grid grid-cols-2 gap-3"
        >
          <button
            onClick={() => onAddTransaction('expense')}
            className="flex items-center gap-3 rounded-2xl p-4 active:scale-95 transition-transform"
            style={{ background: '#1C4D8D', boxShadow: '0 6px 20px rgba(28,77,141,0.28)' }}
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Receipt style={{ width: 18, height: 18 }} className="text-white" />
            </div>
            <span className="text-white text-sm font-semibold">Add Expense</span>
          </button>

          <button
            onClick={() => onAddTransaction('income')}
            className="flex items-center gap-3 rounded-2xl p-4 active:scale-95 transition-transform"
            style={cardStyle}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <Banknote style={{ width: 18, height: 18 }} className="text-green-600" />
            </div>
            <span className="text-slate-700 text-sm font-semibold">Add Income</span>
          </button>
        </motion.div>

        {/* Budget Progress — blue = remaining, gray track = spent */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={cardStyle}
          className="p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-slate-800 font-semibold" style={{ fontSize: '0.9rem' }}>April Budget</p>
              <p className="text-slate-400 text-xs mt-0.5">{fmtVND(TOTAL_BUDGET)} total</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: '#EEF4FF', color: '#1C4D8D' }}>
              {REMAINING_PCT}% left
            </span>
          </div>
          {/* Track = full budget. Blue fill = remaining. Uncovered gray = spent. */}
          <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${REMAINING_PCT}%` }}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #1C4D8D, #9ED3DC)' }}
            />
          </div>
          {/* Single-line summary */}
          <p className="text-xs text-slate-400 mt-2">
            <span className="text-slate-500 font-medium">{fmtVND(TOTAL_SPENT)} spent</span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span style={{ color: '#1C4D8D', fontWeight: 600 }}>{fmtVND(REMAINING)} remaining</span>
          </p>
        </motion.div>

        {/* Spending chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          style={cardStyle}
          className="p-5"
        >
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-slate-800 font-semibold" style={{ fontSize: '0.9rem' }}>This Week</p>
              <p className="text-slate-400 text-xs mt-0.5">Daily spending overview</p>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="flex items-center gap-1 text-xs font-semibold"
              style={{ color: '#1C4D8D' }}
            >
              Full report <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-40 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData} barGap={4} barSize={24}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  cursor={{ fill: 'rgba(28,77,141,0.04)', radius: 8 }}
                  formatter={(value: number) => [fmtVND(value), 'Spent']}
                  contentStyle={{
                    background: 'white',
                    border: '1px solid rgba(28,77,141,0.12)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(28,77,141,0.12)',
                    fontSize: '12px',
                    color: '#0f1729',
                  }}
                />
                <Bar dataKey="amount" radius={[6, 6, 4, 4]}>
                  {weekData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.day === 'Fri' ? '#1C4D8D' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI nudge */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          onClick={() => onNavigate('chat')}
          className="w-full flex items-center gap-3 p-4 rounded-2xl active:scale-[0.98] transition-transform text-left"
          style={{ background: 'linear-gradient(135deg, #EEF4FF 0%, #e8f6f9 100%)', border: '1px solid rgba(28,77,141,0.12)' }}
        >
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#1C4D8D' }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-800 text-sm font-semibold">AI Smart Insight</p>
            <p className="text-slate-500 text-xs truncate mt-0.5">You're {REMAINING_PCT}% under budget — ask me for a plan!</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
        </motion.button>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-slate-800 font-semibold" style={{ fontSize: '0.9rem' }}>Recent Transactions</p>
            <button onClick={() => onNavigate('analytics')} className="text-xs font-semibold" style={{ color: '#1C4D8D' }}>
              View all
            </button>
          </div>

          <div className="space-y-2">
            {mergedRecent.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.04 }}
                  className="flex items-center gap-3 p-3.5 rounded-2xl"
                  style={cardStyle}
                >
                  {/* Thumbnail or category icon */}
                  {t.imageDataUrl ? (
                    <div className="relative flex-shrink-0">
                      <img
                        src={t.imageDataUrl}
                        alt={t.title}
                        className="w-11 h-11 rounded-2xl object-cover"
                        style={{ border: '1.5px solid rgba(28,77,141,0.1)' }}
                      />
                      <div
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"
                        style={{ background: '#1C4D8D' }}
                      >
                        <Camera style={{ width: 9, height: 9 }} className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: t.bg }}>
                      {Icon && <Icon className="w-5 h-5" style={{ color: t.color }} />}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 text-sm font-semibold truncate">{t.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{t.date} · {t.category}</p>
                  </div>
                  <p
                    className="text-sm font-bold flex-shrink-0"
                    style={{ color: t.amount > 0 ? '#22c55e' : '#0f1729' }}
                  >
                    {fmtVNDSigned(t.amount)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}