import {
    Car,
    Check, Coffee,
    GraduationCap,
    Mic,
    Send,
    ShoppingBag,
    Sparkles, User,
    Wallet,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from '../lib/motion';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface TransactionCard {
  amount: number;
  category: string;
  categoryIcon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  categoryColor: string;
  categoryBg: string;
  note: string;
}

interface BudgetItem { label: string; amount: number; pct: number; color: string }
interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  transactionCard?: TransactionCard;
  budgetPlan?: BudgetItem[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const budgetPlan: BudgetItem[] = [
  { label: 'Savings', amount: 1200000, pct: 30, color: '#22c55e' },
  { label: 'Food', amount: 800000, pct: 20, color: '#f87171' },
  { label: 'Rent & Bills', amount: 1200000, pct: 30, color: '#1C4D8D' },
  { label: 'Education', amount: 400000, pct: 10, color: '#8b5cf6' },
  { label: 'Transport', amount: 200000, pct: 5, color: '#eab308' },
  { label: 'Other', amount: 200000, pct: 5, color: '#9ED3DC' },
];

const initialMessages: Message[] = [
  {
    id: 1, type: 'ai',
    content: "Hi! I'm your AI finance assistant ✨\n\nTell me what you spent and I'll log it instantly — or ask me anything about your budget!",
    timestamp: new Date(),
  },
];

const examples = [
  "I just spent 399k on a course",
  "Suggest a budget plan for 4,000,000 VND",
  "Show my spending patterns",
];

export function AIChatScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;

    const userMsg: Message = { id: Date.now(), type: 'user', content: msg, timestamp: new Date() };
    setMessages((p) => [...p, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const lower = msg.toLowerCase();
      let content = '';
      let card: TransactionCard | undefined;
      let plan: BudgetItem[] | undefined;

      if (lower.includes('course') || lower.includes('399')) {
        content = "Got it! I've logged this expense 🎓";
        card = { amount: 399000, category: 'Education', categoryIcon: GraduationCap, categoryColor: '#8b5cf6', categoryBg: '#f5f3ff', note: 'Online course purchase' };
      } else if (lower.includes('lunch') || lower.includes('coffee') || lower.includes('breakfast') || lower.includes('45')) {
        content = "Logged! Added to your Food expenses ☕";
        card = { amount: 45000, category: 'Food & Drinks', categoryIcon: Coffee, categoryColor: '#f87171', categoryBg: '#fef2f2', note: 'Meal / Coffee' };
      } else if (lower.includes('grab') || lower.includes('taxi') || lower.includes('bus')) {
        content = "Tracked! Transport expense saved 🚗";
        card = { amount: 25000, category: 'Transport', categoryIcon: Car, categoryColor: '#eab308', categoryBg: '#fefce8', note: 'Grab ride' };
      } else if (lower.includes('shop') || lower.includes('clothes')) {
        content = "Added! Shopping expense recorded 🛍️";
        card = { amount: 250000, category: 'Shopping', categoryIcon: ShoppingBag, categoryColor: '#f97316', categoryBg: '#fff7ed', note: 'Clothes shopping' };
      } else if (lower.includes('budget') || lower.includes('plan') || lower.includes('4,000,000') || lower.includes('4000000')) {
        content = "Here's your personalized budget plan for 4,000,000 VND/month 📊 Designed to maximize savings while covering all essentials.";
        plan = budgetPlan;
      } else if (lower.includes('pattern') || lower.includes('spending') || lower.includes('analytics')) {
        content = "Here's what I see in your spending:\n\n📊 Top category: Education — 55.5%\n📅 Most active: weekdays\n📉 8% less vs last month\n🎯 On track with your budget!\n✨ Great discipline this month!";
      } else {
        content = "I can help you:\n• Log expenses by just telling me what you spent\n• Create personalized budget plans\n• Analyze your spending habits\n\nJust type what's on your mind!";
      }

      setMessages((p) => [...p, { id: Date.now() + 1, type: 'ai', content, timestamp: new Date(), transactionCard: card, budgetPlan: plan }]);
    }, 1100);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* ── Header ── */}
      <div
        className="flex-shrink-0 px-5 pt-5 pb-4 bg-white"
        style={{ borderBottom: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(28,77,141,0.05)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center relative flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1C4D8D, #2563ab)', boxShadow: '0 4px 14px rgba(28,77,141,0.3)' }}
          >
            <Sparkles className="w-5.5 h-5.5 text-white" style={{ width: 22, height: 22 }} />
            <span
              className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
              style={{ background: '#22c55e' }}
            />
          </div>
          <div>
            <p className="text-slate-800 font-bold" style={{ fontSize: '1rem' }}>AI Assistant</p>
            <p className="text-xs text-slate-400">Smart expense tracking · Online</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-green-700 text-xs font-semibold">Active</span>
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#f8fafc]" style={{ scrollbarWidth: 'none' }}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2.5 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={
                msg.type === 'ai'
                  ? { background: 'linear-gradient(135deg, #1C4D8D, #2563ab)', boxShadow: '0 2px 8px rgba(28,77,141,0.25)' }
                  : { background: '#e2e8f0' }
              }
            >
              {msg.type === 'ai'
                ? <Sparkles className="w-3.5 h-3.5 text-white" />
                : <User className="w-3.5 h-3.5 text-slate-500" />
              }
            </div>

            {/* Bubble + cards */}
            <div className="max-w-[78%] flex flex-col gap-2">
              <div
                className="px-4 py-3 rounded-2xl"
                style={
                  msg.type === 'ai'
                    ? {
                        background: 'white',
                        border: '1px solid rgba(28,77,141,0.08)',
                        boxShadow: '0 2px 12px rgba(28,77,141,0.07)',
                        borderTopLeftRadius: '6px',
                      }
                    : {
                        background: '#1C4D8D',
                        boxShadow: '0 4px 16px rgba(28,77,141,0.25)',
                        borderTopRightRadius: '6px',
                      }
                }
              >
                <p
                  className="text-sm whitespace-pre-line leading-relaxed"
                  style={{ color: msg.type === 'ai' ? '#334155' : 'white' }}
                >
                  {msg.content}
                </p>
                <p
                  className="text-xs mt-1.5"
                  style={{ color: msg.type === 'ai' ? '#94a3b8' : 'rgba(255,255,255,0.6)' }}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {/* Transaction card */}
              {msg.transactionCard && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.93 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl p-4 bg-white"
                  style={{ border: '1px solid rgba(28,77,141,0.1)', boxShadow: '0 4px 20px rgba(28,77,141,0.1)' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: msg.transactionCard.categoryBg }}
                    >
                      <msg.transactionCard.categoryIcon
                        className="w-6 h-6"
                        style={{ color: msg.transactionCard.categoryColor }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-400 text-xs">{msg.transactionCard.category}</p>
                      <p className="text-slate-800 font-bold" style={{ fontSize: '1.15rem' }}>
                        {msg.transactionCard.amount.toLocaleString('en-US')} VND
                      </p>
                    </div>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
                    >
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <div
                    className="px-3 py-2.5 rounded-xl mb-3"
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                  >
                    <p className="text-slate-400 text-xs">Note</p>
                    <p className="text-slate-700 text-sm font-medium">{msg.transactionCard.note}</p>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-green-600 text-xs font-semibold">Successfully added to your expenses</span>
                  </div>
                </motion.div>
              )}

              {/* Budget plan card */}
              {msg.budgetPlan && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.93 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl p-4 bg-white"
                  style={{ border: '1px solid rgba(28,77,141,0.1)', boxShadow: '0 4px 20px rgba(28,77,141,0.1)' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-[#1C4D8D]" />
                      <span className="text-slate-700 font-bold text-sm">Monthly Budget Plan</span>
                    </div>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: '#EEF4FF', color: '#1C4D8D' }}
                    >
                      4,000,000 VND/month
                    </span>
                  </div>
                  <div className="space-y-3">
                    {msg.budgetPlan.map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                            <span className="text-slate-600 text-xs">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-xs">{item.pct}%</span>
                            <span className="text-slate-800 text-xs font-bold">{(item.amount / 1000).toFixed(0)}K VND</span>
                          </div>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.pct}%` }}
                            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ background: item.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-2.5"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #1C4D8D, #2563ab)' }}
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div
                className="px-4 py-3 rounded-2xl bg-white flex items-center gap-1.5"
                style={{ border: '1px solid rgba(28,77,141,0.08)', boxShadow: '0 2px 12px rgba(28,77,141,0.07)', borderTopLeftRadius: '6px' }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-slate-300"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.55, delay: i * 0.15, repeat: Infinity }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick examples */}
        <AnimatePresence>
          {messages.length === 1 && !typing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2"
            >
              <p className="text-xs text-slate-400 font-medium mb-2 ml-1">Try asking:</p>
              <div className="flex flex-col gap-2">
                {examples.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="text-left text-sm px-4 py-3 rounded-2xl transition-all active:scale-[0.98] bg-white"
                    style={{
                      border: '1px solid rgba(28,77,141,0.12)',
                      color: '#475569',
                      boxShadow: '0 2px 8px rgba(28,77,141,0.05)',
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ── */}
      <div
        className="flex-shrink-0 px-4 pb-4 pt-3 bg-white"
        style={{ borderTop: '1px solid #f1f5f9', boxShadow: '0 -4px 16px rgba(28,77,141,0.04)' }}
      >
        <div className="flex items-center gap-2">
          <button
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}
          >
            <Mic className="w-4.5 h-4.5 text-slate-400" style={{ width: 18, height: 18 }} />
          </button>

          <div
            className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl"
            style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tell me what you spent..."
              className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-300"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all"
            style={
              input.trim()
                ? { background: '#1C4D8D', boxShadow: '0 4px 14px rgba(28,77,141,0.35)' }
                : { background: '#e2e8f0' }
            }
          >
            <Send
              className="w-4 h-4"
              style={{ color: input.trim() ? 'white' : '#94a3b8', width: 16, height: 16 }}
            />
          </motion.button>
        </div>
      </div>
    </div>
  );
}