import { useState } from 'react';
import {
  Coffee, ShoppingBag, Car, Home, Heart, GraduationCap,
  Smartphone, UtensilsCrossed, Plane, Check,
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useTransactions } from '../context/TransactionContext';

// ─── Categories ───────────────────────────────────────────────────────────────
const CATS = [
  { id: 'food',      name: 'Food',      Icon: Coffee,          color: '#f87171', bg: '#fef2f2' },
  { id: 'shopping',  name: 'Shopping',  Icon: ShoppingBag,     color: '#f97316', bg: '#fff7ed' },
  { id: 'transport', name: 'Transport', Icon: Car,             color: '#eab308', bg: '#fefce8' },
  { id: 'home',      name: 'Home',      Icon: Home,            color: '#9ED3DC', bg: '#ecfeff' },
  { id: 'health',    name: 'Health',    Icon: Heart,           color: '#ec4899', bg: '#fdf2f8' },
  { id: 'education', name: 'Education', Icon: GraduationCap,   color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'tech',      name: 'Tech',      Icon: Smartphone,      color: '#3b82f6', bg: '#eff6ff' },
  { id: 'dining',    name: 'Dining',    Icon: UtensilsCrossed, color: '#22c55e', bg: '#f0fdf4' },
  { id: 'travel',    name: 'Travel',    Icon: Plane,           color: '#0ea5e9', bg: '#f0f9ff' },
];

function fmtLabel(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface Props {
  imageDataUrl: string;
  onClose: () => void;
  onRetake: () => void;
}

export function PhotoExpenseSheet({ imageDataUrl, onClose, onRetake }: Props) {
  const { addPhotoTransaction } = useTransactions();
  const [amount, setAmount] = useState('');
  const [catId,  setCatId]  = useState('');
  const [note,   setNote]   = useState('');
  const [date,   setDate]   = useState(new Date().toISOString().split('T')[0]);

  const cat = CATS.find(c => c.id === catId);

  const save = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) { toast.error('Please enter a valid amount'); return; }
    if (!catId)           { toast.error('Please select a category');    return; }

    addPhotoTransaction({
      title:         note.trim() || cat!.name,
      amount:        -num,
      category:      cat!.name,
      categoryColor: cat!.color,
      categoryBg:    cat!.bg,
      note,
      date:          fmtLabel(date),
      dateISO:       date,
      imageDataUrl,
    });
    toast.success('📸 Expense saved!');
    onClose();
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 320 }}
      className="absolute inset-x-0 bottom-0 z-[60] bg-white rounded-t-3xl overflow-hidden"
      style={{ boxShadow: '0 -12px 48px rgba(0,0,0,0.25)', maxHeight: '90%' }}
    >
      {/* Drag handle */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 rounded-full bg-slate-200" />
      </div>

      {/* Receipt preview strip */}
      <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
        <img
          src={imageDataUrl}
          alt="receipt"
          className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
          style={{ border: '1.5px solid rgba(28,77,141,0.12)' }}
        />
        <div className="flex-1">
          <p className="text-slate-800 font-bold" style={{ fontSize: '0.95rem' }}>Add Photo Expense</p>
          <p className="text-slate-400 text-xs mt-0.5">Receipt captured ✓</p>
        </div>
        <button
          onClick={onRetake}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl"
          style={{ color: '#1C4D8D', background: '#EEF4FF' }}
        >
          Retake
        </button>
      </div>

      {/* Scrollable form */}
      <div
        className="overflow-y-auto px-5 py-4 space-y-4"
        style={{ maxHeight: 'calc(90% - 120px)', scrollbarWidth: 'none' }}
      >
        {/* Amount */}
        <div>
          <p className="text-xs text-slate-500 font-semibold mb-2">Amount (VND) *</p>
          <div
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
            style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}
          >
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: '#fef2f2', color: '#ef4444' }}
            >
              VND
            </span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-300"
              style={{ fontSize: '1.4rem', fontWeight: 800 }}
              autoFocus
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <p className="text-xs text-slate-500 font-semibold mb-2">Category *</p>
          <div className="grid grid-cols-3 gap-2">
            {CATS.map(c => {
              const sel = catId === c.id;
              return (
                <motion.button
                  key={c.id}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setCatId(c.id)}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl transition-all"
                  style={
                    sel
                      ? { background: c.bg, border: `2px solid ${c.color}` }
                      : { background: 'white', border: '1.5px solid #e2e8f0' }
                  }
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: c.bg }}>
                    <c.Icon className="w-4 h-4" style={{ color: c.color }} />
                  </div>
                  <span className="text-[10px] font-semibold" style={{ color: sel ? c.color : '#64748b' }}>
                    {c.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Note */}
        <div>
          <p className="text-xs text-slate-500 font-semibold mb-2">Note (optional)</p>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="e.g. Lunch with friends"
            className="w-full px-4 py-3 rounded-2xl text-sm text-slate-800 placeholder:text-slate-300 outline-none"
            style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}
          />
        </div>

        {/* Date */}
        <div>
          <p className="text-xs text-slate-500 font-semibold mb-2">Date</p>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl text-sm text-slate-700 outline-none"
            style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}
          />
        </div>

        {/* Save button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={save}
          className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #1C4D8D, #2563ab)',
            boxShadow: '0 8px 24px rgba(28,77,141,0.3)',
          }}
        >
          <Check className="w-5 h-5" />
          Save Expense
        </motion.button>

        {/* Bottom padding for safe area */}
        <div className="h-2" />
      </div>
    </motion.div>
  );
}
