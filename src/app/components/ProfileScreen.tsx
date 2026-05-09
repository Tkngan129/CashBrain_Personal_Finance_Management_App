import { useState } from 'react';
import {
  User, Settings, Bell, CreditCard, HelpCircle, Shield,
  LogOut, ChevronRight, Tag, Target, Edit3, Star,
  Moon, Globe, X, Trash2, Pencil, Plus, Check, RefreshCw, Camera,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useTransactions } from '../context/TransactionContext';

// ─── Budget constants (same as Dashboard) ────────────────────────────────────
const TOTAL_BUDGET    = 4_000_000;
const TOTAL_SPENT     = 719_000;
const REMAINING       = TOTAL_BUDGET - TOTAL_SPENT;
const SPENT_PCT       = Math.round((TOTAL_SPENT / TOTAL_BUDGET) * 100);
const REMAINING_PCT   = 100 - SPENT_PCT;
const fmtVND = (n: number) => `${Math.abs(n).toLocaleString('en-US')} VND`;

// ─── Category types & defaults ────────────────────────────────────────────────
type ManagedCategory = { id: string; name: string; color: string; isDefault: boolean };

const defaultCategories: ManagedCategory[] = [
  { id: 'food',       name: 'Food',       color: '#f87171', isDefault: true  },
  { id: 'shopping',   name: 'Shopping',   color: '#f97316', isDefault: true  },
  { id: 'transport',  name: 'Transport',  color: '#eab308', isDefault: true  },
  { id: 'home',       name: 'Home',       color: '#9ED3DC', isDefault: true  },
  { id: 'health',     name: 'Health',     color: '#ec4899', isDefault: true  },
  { id: 'education',  name: 'Education',  color: '#8b5cf6', isDefault: true  },
  { id: 'tech',       name: 'Tech',       color: '#3b82f6', isDefault: true  },
  { id: 'dining',     name: 'Dining',     color: '#22c55e', isDefault: true  },
  { id: 'travel',     name: 'Travel',     color: '#0ea5e9', isDefault: true  },
];

const colorSwatches = [
  '#f87171', '#f97316', '#eab308', '#22c55e',
  '#0ea5e9', '#1C4D8D', '#8b5cf6', '#ec4899',
  '#9ED3DC', '#64748b',
];

// ─── Stats & Menu ─────────────────────────────────────────────────────────────
const menuSections = [
  {
    title: 'Account',
    items: [
      { id: 'profile',  label: 'Edit Profile',      desc: 'Name, email, avatar',  icon: User,       color: '#1C4D8D', bg: '#EEF4FF' },
      { id: 'budget',   label: 'Budget Settings',   desc: 'Monthly limits',        icon: Target,     color: '#8b5cf6', bg: '#f5f3ff' },
      { id: 'payment',  label: 'Payment Methods',   desc: 'Cards & accounts',      icon: CreditCard, color: '#0ea5e9', bg: '#f0f9ff' },
    ],
  },
  {
    title: 'Personalize',
    items: [
      { id: 'notifications', label: 'Notifications',     desc: 'Alerts & reminders', icon: Bell,  color: '#22c55e', bg: '#f0fdf4' },
      { id: 'appearance',    label: 'Dark Mode',         desc: 'Theme & display',    icon: Moon,  color: '#64748b', bg: '#f8fafc' },
      { id: 'language',      label: 'Language',          desc: 'English (US)',       icon: Globe, color: '#9ED3DC', bg: '#ecfeff' },
    ],
  },
  {
    title: 'Support & Legal',
    items: [
      { id: 'privacy',  label: 'Privacy & Security', desc: 'Data & permissions', icon: Shield,      color: '#ef4444', bg: '#fef2f2' },
      { id: 'help',     label: 'Help Center',         desc: 'FAQs & support',     icon: HelpCircle, color: '#1C4D8D', bg: '#EEF4FF' },
      { id: 'settings', label: 'App Settings',        desc: 'Advanced options',   icon: Settings,   color: '#64748b', bg: '#f8fafc' },
    ],
  },
];

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.92)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(28,77,141,0.08)',
  boxShadow: '0 2px 16px rgba(28,77,141,0.07)',
  borderRadius: '20px',
};

// ─────────────────────────────────────────────────────────────────────────────
export function ProfileScreen() {
  const { photoTransactions, streak } = useTransactions();
  const [showCatManager, setShowCatManager]   = useState(false);
  const [categories, setCategories]           = useState<ManagedCategory[]>(defaultCategories);
  const [editingId, setEditingId]             = useState<string | null>(null);
  const [editingName, setEditingName]         = useState('');
  const [showAddForm, setShowAddForm]         = useState(false);
  const [newName, setNewName]                 = useState('');
  const [newColor, setNewColor]               = useState(colorSwatches[0]);

  const handleMenuClick = (label: string) => toast.success(`${label} — coming soon!`);
  const handleLogout    = () => toast.error('Logged out');

  // ── Category actions ──────────────────────────────────────────────────────
  const startEdit = (cat: ManagedCategory) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
    setShowAddForm(false);
  };

  const saveEdit = () => {
    if (!editingName.trim()) { toast.error('Name cannot be empty'); return; }
    setCategories(prev => prev.map(c => c.id === editingId ? { ...c, name: editingName.trim() } : c));
    setEditingId(null);
    toast.success('Category updated!');
  };

  const cancelEdit = () => setEditingId(null);

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    if (editingId === id) setEditingId(null);
    toast.success('Category deleted');
  };

  const addCategory = () => {
    if (!newName.trim()) { toast.error('Please enter a category name'); return; }
    const newCat: ManagedCategory = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      color: newColor,
      isDefault: false,
    };
    setCategories(prev => [...prev, newCat]);
    setNewName('');
    setNewColor(colorSwatches[0]);
    setShowAddForm(false);
    toast.success('Category added!');
  };

  const resetToDefaults = () => {
    setCategories(defaultCategories);
    setEditingId(null);
    setShowAddForm(false);
    toast.success('Categories reset to defaults');
  };

  return (
    <div className="h-full relative flex flex-col">
      {/* ── Main scrollable content ── */}
      <div className="flex-1 overflow-y-auto bg-[#f8fafc]" style={{ scrollbarWidth: 'none' }}>

        {/* Header */}
        <div className="bg-white px-5 pt-5 pb-6" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <div className="flex items-center justify-between mb-5">
            <p className="text-slate-800 font-bold" style={{ fontSize: '1.15rem' }}>My Profile</p>
            <button
              onClick={() => handleMenuClick('Edit')}
              className="w-9 h-9 rounded-2xl flex items-center justify-center"
              style={{ background: '#EEF4FF', border: '1px solid rgba(28,77,141,0.14)' }}
            >
              <Edit3 className="w-4 h-4 text-[#1C4D8D]" />
            </button>
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #1C4D8D, #2563ab)', boxShadow: '0 8px 24px rgba(28,77,141,0.3)' }}
              >
                <User className="w-9 h-9 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white" style={{ background: '#22c55e' }}>
                <Star className="w-3 h-3 text-white" fill="white" />
              </div>
            </div>
            <div>
              <p className="text-slate-800 font-bold" style={{ fontSize: '1.1rem' }}>Ngan Tran</p>
              <p className="text-slate-400 text-sm mt-0.5">ngan.tran@email.com</p>
              <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full" style={{ background: '#EEF4FF', border: '1px solid rgba(28,77,141,0.15)' }}>
                <Star className="w-3 h-3 text-[#1C4D8D]" fill="#1C4D8D" />
                <span className="text-[#1C4D8D] text-xs font-semibold">Pro Member</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="px-4 pt-4 pb-6 space-y-3">
          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={cardStyle} className="p-5">
            <div className="grid grid-cols-3 divide-x divide-slate-100">
              {[
                { label: 'Transactions', value: '24' },
                { label: 'Categories',   value: categories.length.toString() },
                { label: 'Budget Left',  value: `${REMAINING_PCT}%` },
              ].map((s) => (
                <div key={s.label} className="text-center px-2">
                  <p className="text-slate-800 font-bold" style={{ fontSize: '1.3rem' }}>{s.value}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Budget mini-card — dynamically computed */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            style={{ ...cardStyle, background: 'linear-gradient(135deg, #EEF4FF 0%, #e8f6f9 100%)' }}
            className="p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-slate-700 font-semibold text-sm">April Budget</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {fmtVND(TOTAL_SPENT)} spent of {fmtVND(TOTAL_BUDGET)}
                </p>
              </div>
              <span className="text-sm font-bold px-3 py-1.5 rounded-full" style={{ background: '#1C4D8D', color: 'white' }}>
                {REMAINING_PCT}% left
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${REMAINING_PCT}%` }}
                transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #1C4D8D, #9ED3DC)' }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              <span className="text-slate-500 font-medium">{fmtVND(TOTAL_SPENT)} spent</span>
              <span className="mx-1.5 text-slate-300">•</span>
              <span style={{ color: '#1C4D8D', fontWeight: 600 }}>{fmtVND(REMAINING)} remaining</span>
            </p>
          </motion.div>

          {/* ── Streak + Photo count card ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }}
            className="p-4 rounded-2xl"
            style={{
              background: streak > 0
                ? 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)'
                : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              border: streak > 0 ? '1px solid #fed7aa' : '1px solid #e2e8f0',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl"
                style={{ background: streak > 0 ? '#f97316' : '#94a3b8' }}
              >
                {streak > 0 ? '🔥' : '📸'}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-extrabold"
                  style={{ fontSize: '1.25rem', color: streak > 0 ? '#c2410c' : '#475569' }}
                >
                  {streak > 0 ? `${streak} day${streak !== 1 ? 's' : ''}` : 'No streak yet'}
                </p>
                <p className="text-xs font-medium mt-0.5" style={{ color: streak > 0 ? '#f97316' : '#94a3b8' }}>
                  {streak > 0 ? 'Logging streak 🎯' : 'Scan a receipt to start'}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-slate-800 font-bold text-sm">{photoTransactions.length}</p>
                <p className="text-slate-400 text-[10px]">receipts</p>
              </div>
            </div>
            <p
              className="text-xs mt-2.5 font-medium"
              style={{ color: streak > 0 ? '#ea580c' : '#94a3b8' }}
            >
              {streak === 0 && '📷 Capture your first expense to start a streak!'}
              {streak === 1 && '✨ Great start! Come back tomorrow to continue your streak.'}
              {streak >= 2 && streak < 7  && `🔥 ${streak} days in a row — you're building a great habit!`}
              {streak >= 7 && streak < 14 && "🏆 One full week! You're a budgeting pro!"}
              {streak >= 14 && '🌟 Incredible consistency! Keep it up!'}
            </p>
          </motion.div>

          {/* ── Photo Diary Grid ── */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">📸 Photo Diary</p>
              {photoTransactions.length > 0 && (
                <span className="text-xs font-semibold" style={{ color: '#1C4D8D' }}>
                  {photoTransactions.length} receipt{photoTransactions.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {photoTransactions.length === 0 ? (
              /* Empty state */
              <div
                className="flex flex-col items-center justify-center gap-3 py-8 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.8)', border: '1.5px dashed rgba(28,77,141,0.18)' }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#EEF4FF' }}>
                  <Camera className="w-6 h-6" style={{ color: '#1C4D8D' }} />
                </div>
                <div className="text-center px-4">
                  <p className="text-slate-600 text-sm font-semibold">No photo receipts yet</p>
                  <p className="text-slate-400 text-xs mt-1">Tap the camera button to scan your first receipt</p>
                </div>
              </div>
            ) : (
              /* Photo grid — 3 columns */
              <div className="grid grid-cols-3 gap-1.5">
                {photoTransactions.slice(0, 9).map((pt, idx) => (
                  <motion.div
                    key={pt.id}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + idx * 0.04 }}
                    className="relative rounded-2xl overflow-hidden"
                    style={{ aspectRatio: '1', background: pt.categoryBg }}
                  >
                    <img
                      src={pt.imageDataUrl}
                      alt={pt.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Amount overlay */}
                    <div
                      className="absolute bottom-0 left-0 right-0 px-1.5 py-1"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }}
                    >
                      <p className="text-white text-[10px] font-bold leading-tight truncate">
                        {Math.abs(pt.amount / 1000).toFixed(0)}K
                      </p>
                    </div>
                    {/* Category color dot */}
                    <div
                      className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full border border-white"
                      style={{ background: pt.categoryColor }}
                    />
                  </motion.div>
                ))}
                {/* "More" tile if > 9 */}
                {photoTransactions.length > 9 && (
                  <div
                    className="rounded-2xl flex items-center justify-center"
                    style={{ aspectRatio: '1', background: '#EEF4FF' }}
                  >
                    <div className="text-center">
                      <p className="font-bold text-sm" style={{ color: '#1C4D8D' }}>+{photoTransactions.length - 9}</p>
                      <p className="text-[10px]" style={{ color: '#1C4D8D' }}>more</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Manage Categories — opens bottom sheet */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}>
            <p className="text-xs font-bold text-slate-400 mb-2 px-1 uppercase tracking-wider">Categories</p>
            <button
              onClick={() => setShowCatManager(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 active:scale-[0.99] transition-all overflow-hidden"
              style={cardStyle}
            >
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#fff7ed' }}>
                <Tag style={{ width: 18, height: 18, color: '#f97316' }} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-slate-700 text-sm font-semibold">Manage Categories</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {categories.length} categories · Add, edit or delete
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
            </button>
          </motion.div>

          {/* Menu sections */}
          {menuSections.map((section, si) => (
            <motion.div key={section.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 + si * 0.05 }}>
              <p className="text-xs font-bold text-slate-400 mb-2 px-1 uppercase tracking-wider">{section.title}</p>
              <div style={cardStyle} className="overflow-hidden">
                {section.items.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.label)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 active:scale-[0.99] transition-all"
                      style={idx < section.items.length - 1 ? { borderBottom: '1px solid #f1f5f9' } : {}}
                    >
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: item.bg }}>
                        <Icon style={{ width: 18, height: 18, color: item.color }} />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-slate-700 text-sm font-semibold">{item.label}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {/* Logout */}
          <motion.button
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            onClick={handleLogout} whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.2)' }}
          >
            <LogOut style={{ width: 18, height: 18 }} className="text-red-500" />
            <span className="text-red-500 font-bold text-sm">Log Out</span>
          </motion.button>

          <p className="text-center text-xs text-slate-300 pb-2">Version 1.0.0 · Made with ♥</p>
        </div>
      </div>

      {/* ══════════════════ CATEGORY MANAGER BOTTOM SHEET ══════════════════ */}
      <AnimatePresence>
        {showCatManager && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-40"
              style={{ background: 'rgba(15,23,41,0.35)' }}
              onClick={() => { setShowCatManager(false); setEditingId(null); setShowAddForm(false); }}
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 z-50 bg-white flex flex-col"
              style={{ borderRadius: '24px 24px 0 0', maxHeight: '85%', boxShadow: '0 -8px 40px rgba(28,77,141,0.14)' }}
            >
              {/* Sheet handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1.5 rounded-full bg-slate-200" />
              </div>

              {/* Sheet header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <div>
                  <p className="text-slate-800 font-bold" style={{ fontSize: '1rem' }}>Manage Categories</p>
                  <p className="text-slate-400 text-xs mt-0.5">{categories.length} categories total</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetToDefaults}
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: '#f1f5f9' }}
                    title="Reset to defaults"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                  <button
                    onClick={() => { setShowCatManager(false); setEditingId(null); setShowAddForm(false); }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: '#f1f5f9' }}
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Category list */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2" style={{ scrollbarWidth: 'none' }}>
                {categories.map((cat, i) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                    style={{
                      background: editingId === cat.id ? '#f8fafc' : 'white',
                      border: editingId === cat.id ? '1.5px solid #1C4D8D' : '1.5px solid #f1f5f9',
                      boxShadow: '0 1px 6px rgba(28,77,141,0.05)',
                    }}
                  >
                    {/* Color dot */}
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${cat.color}18` }}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                    </div>

                    {/* Name or editing input */}
                    {editingId === cat.id ? (
                      <input
                        autoFocus
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                        className="flex-1 bg-transparent outline-none text-slate-800 text-sm font-semibold"
                        placeholder="Category name..."
                      />
                    ) : (
                      <span className="flex-1 text-slate-700 text-sm font-semibold">{cat.name}</span>
                    )}

                    {/* Action buttons */}
                    {editingId === cat.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={saveEdit}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: '#1C4D8D' }}
                        >
                          <Check className="w-3.5 h-3.5 text-white" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: '#f1f5f9' }}
                        >
                          <X className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => startEdit(cat)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: '#EEF4FF' }}
                        >
                          <Pencil className="w-3 h-3 text-[#1C4D8D]" />
                        </button>
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: '#fef2f2' }}
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Empty state */}
                {categories.length === 0 && (
                  <div className="py-8 flex flex-col items-center gap-2">
                    <Tag className="w-8 h-8 text-slate-200" />
                    <p className="text-slate-400 text-sm">No categories yet</p>
                    <button
                      onClick={resetToDefaults}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl"
                      style={{ background: '#EEF4FF', color: '#1C4D8D' }}
                    >
                      Restore defaults
                    </button>
                  </div>
                )}
              </div>

              {/* ── Add category section ── */}
              <div className="px-4 pb-6 pt-2 border-t border-slate-100">
                <AnimatePresence mode="wait">
                  {showAddForm ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="space-y-3 pt-2"
                    >
                      {/* Name input */}
                      <input
                        autoFocus
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                        placeholder="Category name (e.g. Fitness)"
                        className="w-full px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 outline-none rounded-2xl"
                        style={{ background: '#f8fafc', border: '1.5px solid #1C4D8D', boxShadow: '0 0 0 3px rgba(28,77,141,0.08)' }}
                      />

                      {/* Color swatches */}
                      <div>
                        <p className="text-xs text-slate-400 font-medium mb-2">Pick a color</p>
                        <div className="flex gap-2 flex-wrap">
                          {colorSwatches.map((color) => (
                            <button
                              key={color}
                              onClick={() => setNewColor(color)}
                              className="w-7 h-7 rounded-full transition-all"
                              style={{
                                background: color,
                                boxShadow: newColor === color
                                  ? `0 0 0 3px white, 0 0 0 5px ${color}`
                                  : '0 1px 4px rgba(0,0,0,0.15)',
                                transform: newColor === color ? 'scale(1.15)' : 'scale(1)',
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Preview */}
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: `${newColor}12`, border: `1.5px solid ${newColor}30` }}>
                        <div className="w-6 h-6 rounded-lg" style={{ background: newColor }} />
                        <span className="text-sm font-semibold" style={{ color: newColor }}>
                          {newName || 'Category name'}
                        </span>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setShowAddForm(false); setNewName(''); }}
                          className="flex-1 py-3 rounded-2xl text-sm font-semibold text-slate-500"
                          style={{ background: '#f1f5f9' }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={addCategory}
                          className="flex-1 py-3 rounded-2xl text-sm font-bold text-white"
                          style={{ background: '#1C4D8D', boxShadow: '0 4px 14px rgba(28,77,141,0.3)' }}
                        >
                          Add Category
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="add-btn"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setShowAddForm(true); setEditingId(null); }}
                      className="w-full mt-2 py-3.5 rounded-2xl flex items-center justify-center gap-2"
                      style={{
                        background: 'linear-gradient(135deg, #EEF4FF, #e8f6f9)',
                        border: '1.5px dashed rgba(28,77,141,0.25)',
                      }}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#1C4D8D' }}>
                        <Plus className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-sm font-semibold" style={{ color: '#1C4D8D' }}>Add New Category</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}