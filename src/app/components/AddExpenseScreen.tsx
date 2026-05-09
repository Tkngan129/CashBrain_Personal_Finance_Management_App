import {
    Banknote,
    Car,
    Check,
    ChevronDown,
    Coffee,
    GraduationCap,
    Heart,
    Home,
    Plane,
    Receipt,
    ShoppingBag,
    Smartphone,
    Sparkles,
    UtensilsCrossed,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from '../lib/motion';

// ─── Data ─────────────────────────────────────────────────────────────────────
const categories = [
  { id: 'food', name: 'Food', icon: Coffee, color: '#f87171', bg: '#fef2f2' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: '#f97316', bg: '#fff7ed' },
  { id: 'transport', name: 'Transport', icon: Car, color: '#eab308', bg: '#fefce8' },
  { id: 'home', name: 'Home', icon: Home, color: '#9ED3DC', bg: '#ecfeff' },
  { id: 'health', name: 'Health', icon: Heart, color: '#ec4899', bg: '#fdf2f8' },
  { id: 'education', name: 'Education', icon: GraduationCap, color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'tech', name: 'Tech', icon: Smartphone, color: '#3b82f6', bg: '#eff6ff' },
  { id: 'dining', name: 'Dining', icon: UtensilsCrossed, color: '#22c55e', bg: '#f0fdf4' },
  { id: 'travel', name: 'Travel', icon: Plane, color: '#0ea5e9', bg: '#f0f9ff' },
];

interface AddExpenseScreenProps {
  onClose: () => void;
  initialType?: 'expense' | 'income';
}

const inputStyle: React.CSSProperties = {
  background: '#f8fafc',
  border: '1.5px solid #e2e8f0',
  borderRadius: '14px',
};
const inputFocused: React.CSSProperties = {
  background: '#f8fafc',
  border: '1.5px solid #1C4D8D',
  borderRadius: '14px',
  boxShadow: '0 0 0 3px rgba(28,77,141,0.08)',
};

export function AddExpenseScreen({ onClose, initialType = 'expense' }: AddExpenseScreenProps) {
  const [type, setType] = useState<'expense' | 'income'>(initialType);
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [aiSuggestion, setAiSuggestion] = useState<{ category: string; confidence: number } | null>(null);
  const [amountFocused, setAmountFocused] = useState(false);
  const [noteFocused, setNoteFocused] = useState(false);

  useEffect(() => {
    if (note.length < 3) { setAiSuggestion(null); return; }
    const lower = note.toLowerCase();
    let cat = '', conf = 0;
    if (lower.includes('course') || lower.includes('study') || lower.includes('class') || lower.includes('book')) { cat = 'education'; conf = 95; }
    else if (lower.includes('lunch') || lower.includes('dinner') || lower.includes('coffee') || lower.includes('breakfast')) { cat = 'food'; conf = 90; }
    else if (lower.includes('grab') || lower.includes('taxi') || lower.includes('bus') || lower.includes('fuel')) { cat = 'transport'; conf = 88; }
    else if (lower.includes('shop') || lower.includes('clothes') || lower.includes('shirt')) { cat = 'shopping'; conf = 85; }
    else if (lower.includes('flight') || lower.includes('hotel') || lower.includes('trip')) { cat = 'travel'; conf = 90; }
    setAiSuggestion(cat && cat !== selectedCategory ? { category: cat, confidence: conf } : null);
  }, [note, selectedCategory]);

  const handleApply = () => {
    if (aiSuggestion) {
      setSelectedCategory(aiSuggestion.category);
      setAiSuggestion(null);
      toast.success('Category applied!');
    }
  };

  const handleSubmit = () => {
    if (!amount || !selectedCategory) {
      toast.error('Please fill in amount and select a category');
      return;
    }
    toast.success(`${type === 'expense' ? 'Expense' : 'Income'} added!`);
    onClose();
  };

  const selectedCat = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* ── Header ── */}
      <div className="flex-shrink-0 px-5 pt-5 pb-4 bg-white border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">New transaction</p>
            <p className="text-slate-800 font-bold" style={{ fontSize: '1.15rem' }}>Add Transaction</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}
          >
            <X className="w-4.5 h-4.5 text-slate-500" style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Type toggle */}
        <div
          className="flex mt-4 p-1 rounded-2xl gap-1"
          style={{ background: '#f1f5f9' }}
        >
          <button
            onClick={() => setType('expense')}
            className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all text-sm font-semibold"
            style={type === 'expense'
              ? { background: 'white', color: '#ef4444', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }
              : { color: '#94a3b8' }}
          >
            <Receipt className="w-4 h-4" />
            Expense
          </button>
          <button
            onClick={() => setType('income')}
            className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all text-sm font-semibold"
            style={type === 'income'
              ? { background: 'white', color: '#22c55e', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }
              : { color: '#94a3b8' }}
          >
            <Banknote className="w-4 h-4" />
            Income
          </button>
        </div>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 bg-[#f8fafc]" style={{ scrollbarWidth: 'none' }}>

        {/* Amount */}
        <div>
          <p className="text-xs text-slate-500 font-semibold mb-2 ml-1">Amount (VND)</p>
          <div
            className="flex items-center gap-2 px-4 py-4 transition-all"
            style={amountFocused ? inputFocused : inputStyle}
          >
            <span
              className="text-xs font-bold flex-shrink-0 px-1.5 py-0.5 rounded-md"
              style={{
                background: type === 'expense' ? '#fef2f2' : '#f0fdf4',
                color: type === 'expense' ? '#ef4444' : '#22c55e',
              }}
            >
              VND
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onFocus={() => setAmountFocused(true)}
              onBlur={() => setAmountFocused(false)}
              placeholder="0"
              className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-300"
              style={{ fontSize: '1.6rem', fontWeight: 800 }}
            />
            {selectedCat && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl flex-shrink-0"
                style={{ background: selectedCat.bg }}
              >
                <selectedCat.icon className="w-3.5 h-3.5" style={{ color: selectedCat.color }} />
                <span className="text-xs font-semibold" style={{ color: selectedCat.color }}>{selectedCat.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* AI suggestion */}
        <AnimatePresence>
          {aiSuggestion && (
            <motion.div
              initial={{ opacity: 0, y: -6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -6, height: 0 }}
              className="overflow-hidden"
            >
              <div
                className="flex items-center gap-3 p-4 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, #EEF4FF 0%, #e8f6f9 100%)',
                  border: '1px solid rgba(28,77,141,0.14)',
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#1C4D8D' }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-slate-800 text-sm font-semibold">AI Suggestion</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: '#EEF4FF', color: '#1C4D8D' }}
                    >
                      {aiSuggestion.confidence}%
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs">
                    Looks like a <span className="text-slate-700 font-semibold">
                      {categories.find((c) => c.id === aiSuggestion.category)?.name}
                    </span> expense
                  </p>
                </div>
                <button
                  onClick={handleApply}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold"
                  style={{ background: '#1C4D8D', color: 'white' }}
                >
                  <Check className="w-3 h-3" />
                  Apply
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category selector */}
        <div>
          <p className="text-xs text-slate-500 font-semibold mb-3 ml-1">Category</p>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="flex flex-col items-center gap-2 p-3.5 rounded-2xl transition-all"
                  style={
                    isSelected
                      ? {
                          background: cat.bg,
                          border: `2px solid ${cat.color}`,
                          boxShadow: `0 4px 16px ${cat.color}25`,
                        }
                      : {
                          background: 'white',
                          border: '1.5px solid #e2e8f0',
                        }
                  }
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: cat.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: isSelected ? cat.color : '#64748b' }}
                  >
                    {cat.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Note */}
        <div>
          <div className="flex items-center justify-between mb-2 ml-1">
            <p className="text-xs text-slate-500 font-semibold">Note (Optional)</p>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#1C4D8D]" />
              <span className="text-xs text-[#1C4D8D] font-semibold">AI-powered</span>
            </div>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onFocus={() => setNoteFocused(true)}
            onBlur={() => setNoteFocused(false)}
            placeholder="e.g., Bought a machine learning course..."
            rows={3}
            className="w-full px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 outline-none resize-none transition-all"
            style={noteFocused ? inputFocused : inputStyle}
          />
          <p className="text-xs text-slate-400 mt-1.5 ml-1">AI auto-detects category from your note</p>
        </div>

        {/* Date */}
        <div>
          <p className="text-xs text-slate-500 font-semibold mb-2 ml-1">Date</p>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3.5 text-sm text-slate-700 outline-none transition-all"
              style={inputStyle}
            />
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl text-white font-bold text-base"
          style={{
            background: 'linear-gradient(135deg, #1C4D8D, #2563ab)',
            boxShadow: '0 8px 24px rgba(28,77,141,0.35)',
          }}
        >
          Add {type === 'expense' ? 'Expense' : 'Income'}
        </motion.button>
      </div>
    </div>
  );
}