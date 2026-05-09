import { useState } from 'react';
import { Home, BarChart2, Camera, MessageCircle, UserCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import { DashboardScreen } from './components/DashboardScreen';
import { AddExpenseScreen } from './components/AddExpenseScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { AIChatScreen } from './components/AIChatScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { CameraScreen } from './components/CameraScreen';
import { TransactionProvider } from './context/TransactionContext';

type Screen = 'home' | 'analytics' | 'add' | 'chat' | 'me' | 'camera';

// ─── Nav items: 2 left + camera center + 2 right ─────────────────────────────
const LEFT_NAV  = [
  { id: 'home'      as Screen, icon: Home,        label: 'Home'      },
  { id: 'analytics' as Screen, icon: BarChart2,   label: 'Analytics' },
];
const RIGHT_NAV = [
  { id: 'chat' as Screen, icon: MessageCircle, label: 'AI Chat' },
  { id: 'me'   as Screen, icon: UserCircle2,   label: 'Me'      },
];

export default function App() {
  const [activeScreen,    setActiveScreen]    = useState<Screen>('home');
  const [addInitialType,  setAddInitialType]  = useState<'expense' | 'income'>('expense');

  const handleAddTransaction = (type: 'expense' | 'income') => {
    setAddInitialType(type);
    setActiveScreen('add');
  };

  const renderTab = (item: { id: Screen; icon: React.ComponentType<any>; label: string }) => {
    const Icon     = item.icon;
    const isActive = activeScreen === item.id;
    return (
      <button
        key={item.id}
        onClick={() => { setActiveScreen(item.id); }}
        className="flex flex-col items-center gap-1 py-0.5 min-w-[56px]"
      >
        <motion.div
          whileTap={{ scale: 0.85 }}
          className="w-10 h-8 rounded-2xl flex items-center justify-center transition-all duration-200"
          style={{ background: isActive ? 'rgba(28,77,141,0.1)' : 'transparent' }}
        >
          <Icon
            className="w-5 h-5 transition-all"
            style={{ color: isActive ? '#1C4D8D' : '#94a3b8' }}
            strokeWidth={isActive ? 2.5 : 2}
          />
        </motion.div>
        <span
          className="text-[10px] font-medium transition-colors"
          style={{ color: isActive ? '#1C4D8D' : '#94a3b8' }}
        >
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <TransactionProvider>
      <div
        className="size-full flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(145deg, #e8f0fb 0%, #f4f8ff 50%, #e0f3f7 100%)' }}
      >
        <Toaster position="top-center" richColors />

        {/* ── Mobile Frame ── */}
        <div
          className="w-full max-w-md h-full rounded-3xl overflow-hidden flex flex-col bg-white relative"
          style={{ boxShadow: '0 32px 80px rgba(28,77,141,0.18), 0 8px 24px rgba(0,0,0,0.08)' }}
        >
          {/* ── Screen Content ── */}
          <div className="flex-1 overflow-hidden bg-[#f8fafc]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeScreen}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="h-full"
              >
                {activeScreen === 'home' && (
                  <DashboardScreen onNavigate={setActiveScreen} onAddTransaction={handleAddTransaction} />
                )}
                {activeScreen === 'analytics' && <AnalyticsScreen />}
                {activeScreen === 'add' && (
                  <AddExpenseScreen onClose={() => setActiveScreen('home')} initialType={addInitialType} />
                )}
                {activeScreen === 'chat' && <AIChatScreen />}
                {activeScreen === 'me'   && <ProfileScreen />}
                {activeScreen === 'camera' && (
                  <CameraScreen onClose={() => setActiveScreen('home')} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Bottom Navigation ── */}
          <div
            className="flex-shrink-0 bg-white border-t border-gray-100"
            style={{ boxShadow: '0 -4px 20px rgba(28,77,141,0.06)' }}
          >
            <div className="flex items-center justify-around px-1 pt-2 pb-3">
              {/* Left tabs */}
              {LEFT_NAV.map(renderTab)}

              {/* ── Camera center button ── */}
              <div className="flex flex-col items-center -mt-6">
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setActiveScreen('camera')}
                  className="w-14 h-14 rounded-full flex items-center justify-center relative"
                  style={{
                    background: activeScreen === 'camera'
                      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                      : 'linear-gradient(135deg, #1C4D8D 0%, #2563ab 100%)',
                    boxShadow: '0 8px 28px rgba(28,77,141,0.45), 0 2px 8px rgba(0,0,0,0.12)',
                  }}
                >
                  <Camera className="w-6 h-6 text-white" strokeWidth={2} />
                </motion.button>
                <span className="text-[10px] mt-1.5 font-medium" style={{ color: activeScreen === 'camera' ? '#1C4D8D' : '#94a3b8' }}>
                  Scan
                </span>
              </div>

              {/* Right tabs */}
              {RIGHT_NAV.map(renderTab)}
            </div>
          </div>
        </div>
      </div>
    </TransactionProvider>
  );
}