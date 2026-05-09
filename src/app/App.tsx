import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

type Screen = 'home' | 'analytics' | 'add' | 'chat' | 'me' | 'camera';
type TxType = 'expense' | 'income';

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: TxType;
  category: string;
  note: string;
  date: string;
  accent: string;
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    title: 'Coffee & Breakfast',
    amount: -45000,
    type: 'expense',
    category: 'Food',
    note: 'Morning meal',
    date: 'Today',
    accent: '#ef4444',
  },
  {
    id: '2',
    title: 'Monthly Allowance',
    amount: 4000000,
    type: 'income',
    category: 'Income',
    note: 'Allowance received',
    date: 'Apr 10',
    accent: '#22c55e',
  },
  {
    id: '3',
    title: 'Online Course',
    amount: -399000,
    type: 'expense',
    category: 'Education',
    note: 'Paid for course',
    date: 'Yesterday',
    accent: '#8b5cf6',
  },
];

const WEEKLY_SPEND = [
  { label: 'Mon', value: 120000 },
  { label: 'Tue', value: 45000 },
  { label: 'Wed', value: 280000 },
  { label: 'Thu', value: 95000 },
  { label: 'Fri', value: 399000 },
  { label: 'Sat', value: 60000 },
  { label: 'Sun', value: 45000 },
];

const NAV_ITEMS: Array<{ key: Screen; label: string; icon: string }> = [
  { key: 'home', label: 'Home', icon: '⌂' },
  { key: 'analytics', label: 'Stats', icon: '▦' },
  { key: 'add', label: 'Add', icon: '+' },
  { key: 'chat', label: 'Chat', icon: '✦' },
  { key: 'me', label: 'Me', icon: '☺' },
  { key: 'camera', label: 'Scan', icon: '⌁' },
];

const fmtVnd = (value: number) => `${Math.abs(Math.round(value)).toLocaleString('en-US')} VND`;

const getTotals = (transactions: Transaction[]) => {
  const income = transactions.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
  const expense = transactions.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  return { income, expense, balance: income - expense };
};

function ScreenShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.screenCard}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>{title}</Text>
        <Text style={styles.screenSubtitle}>{subtitle}</Text>
      </View>
      {children}
    </View>
  );
}

function HomeScreen({ transactions, onNavigate }: { transactions: Transaction[]; onNavigate: (screen: Screen) => void }) {
  const { income, expense, balance } = getTotals(transactions);
  const remaining = Math.max(0, 4000000 - expense);
  const remainingPct = Math.max(12, Math.round((remaining / 4000000) * 100));

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.heroCard}>
        <Text style={styles.heroKicker}>Good morning</Text>
        <Text style={styles.heroBalance}>{fmtVnd(balance)}</Text>
        <Text style={styles.heroCaption}>Balance is current across your recent transactions.</Text>

        <View style={styles.heroStatsRow}>
          <View style={styles.heroStatBox}>
            <Text style={styles.heroStatLabel}>Income</Text>
            <Text style={styles.heroStatValue}>{fmtVnd(income)}</Text>
          </View>
          <View style={styles.heroStatBox}>
            <Text style={styles.heroStatLabel}>Expense</Text>
            <Text style={styles.heroStatValue}>{fmtVnd(expense)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.cardTitle}>Budget progress</Text>
            <Text style={styles.cardMuted}>Monthly target for April</Text>
          </View>
          <Text style={styles.pill}>{remainingPct}% left</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${remainingPct}%` }]} />
        </View>
        <Text style={styles.summaryLine}>{fmtVnd(expense)} spent • {fmtVnd(remaining)} remaining</Text>
      </View>

      <View style={styles.actionGrid}>
        <Pressable style={[styles.actionButton, styles.actionPrimary]} onPress={() => onNavigate('add')}>
          <Text style={styles.actionButtonText}>Add expense</Text>
        </Pressable>
        <Pressable style={[styles.actionButton, styles.actionSecondary]} onPress={() => onNavigate('analytics')}>
          <Text style={styles.actionSecondaryText}>View analytics</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.cardTitle}>Recent transactions</Text>
            <Text style={styles.cardMuted}>Latest activity in your wallet</Text>
          </View>
          <Pressable onPress={() => onNavigate('analytics')}>
            <Text style={styles.linkText}>See all</Text>
          </Pressable>
        </View>
        <View style={styles.listGap}>
          {transactions.slice(0, 5).map(tx => (
            <View key={tx.id} style={styles.txRow}>
              <View style={[styles.txBadge, { backgroundColor: `${tx.accent}18` }]}>
                <Text style={[styles.txBadgeText, { color: tx.accent }]}>{tx.type === 'income' ? '+' : '−'}</Text>
              </View>
              <View style={styles.txBody}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txMeta}>{tx.date} • {tx.category}</Text>
              </View>
              <Text style={[styles.txAmount, { color: tx.amount > 0 ? '#16a34a' : '#0f172a' }]}>
                {tx.amount > 0 ? '+' : '−'}{fmtVnd(tx.amount)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function AnalyticsScreen({ transactions }: { transactions: Transaction[] }) {
  const { income, expense } = getTotals(transactions);
  const maxWeek = Math.max(...WEEKLY_SPEND.map(item => item.value));

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <ScreenShell title="Analytics" subtitle="A simple native overview of your spending">
        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Income</Text>
            <Text style={styles.metricValue}>{fmtVnd(income)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Expense</Text>
            <Text style={styles.metricValue}>{fmtVnd(expense)}</Text>
          </View>
        </View>

        <View style={styles.barCard}>
          {WEEKLY_SPEND.map(day => (
            <View key={day.label} style={styles.barItem}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { height: `${Math.max(10, Math.round((day.value / maxWeek) * 100))}%` },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{day.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Insight</Text>
          <Text style={styles.tipText}>Your biggest daily spike is Friday. Keeping one no-spend day midweek should help smooth the curve.</Text>
        </View>
      </ScreenShell>
    </ScrollView>
  );
}

function AddScreen({
  onSave,
}: {
  onSave: (tx: Omit<Transaction, 'id'>) => void;
}) {
  const [type, setType] = useState<TxType>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('General');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    const numericAmount = Number(amount.replace(/,/g, '').trim());
    if (!title.trim() || !amount.trim() || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError('Enter a title and a valid amount.');
      return;
    }

    onSave({
      title: title.trim(),
      amount: type === 'expense' ? -Math.abs(numericAmount) : Math.abs(numericAmount),
      type,
      category: category.trim() || (type === 'expense' ? 'General' : 'Income'),
      note: note.trim() || 'Manual entry',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      accent: type === 'expense' ? '#ef4444' : '#22c55e',
    });
    setTitle('');
    setAmount('');
    setCategory('General');
    setNote('');
    setError('');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <ScreenShell title="Add transaction" subtitle="A native-safe form that works on mobile">
        <View style={styles.toggleRow}>
          <Pressable
            style={[styles.toggleChip, type === 'expense' && styles.toggleChipActive]}
            onPress={() => setType('expense')}
          >
            <Text style={[styles.toggleText, type === 'expense' && styles.toggleTextActive]}>Expense</Text>
          </Pressable>
          <Pressable
            style={[styles.toggleChip, type === 'income' && styles.toggleChipActive]}
            onPress={() => setType('income')}
          >
            <Text style={[styles.toggleText, type === 'income' && styles.toggleTextActive]}>Income</Text>
          </Pressable>
        </View>

        <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} placeholderTextColor="#94a3b8" />
        <TextInput style={styles.input} placeholder="Amount" keyboardType="numeric" value={amount} onChangeText={setAmount} placeholderTextColor="#94a3b8" />
        <TextInput style={styles.input} placeholder="Category" value={category} onChangeText={setCategory} placeholderTextColor="#94a3b8" />
        <TextInput style={[styles.input, styles.textArea]} placeholder="Note" value={note} onChangeText={setNote} placeholderTextColor="#94a3b8" multiline />

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <Pressable style={styles.actionPrimary} onPress={submit}>
          <Text style={styles.actionButtonText}>Save transaction</Text>
        </Pressable>
      </ScreenShell>
    </ScrollView>
  );
}

function ChatScreen() {
  const [messages, setMessages] = useState<Array<{ id: string; role: 'ai' | 'user'; text: string }>>([
    { id: '1', role: 'ai', text: 'Hi. I can suggest budgets or log a quick expense.' },
  ]);
  const [text, setText] = useState('');

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    const next = [...messages, { id: `${Date.now()}`, role: 'user' as const, text: trimmed }];
    const lower = trimmed.toLowerCase();
    const reply = lower.includes('budget')
      ? 'Try 50% needs, 30% wants, 20% savings.'
      : lower.includes('coffee') || lower.includes('lunch')
        ? 'Logged idea: Food expense.'
        : 'I can help with budgets and spending summaries.';

    setMessages([...next, { id: `${Date.now() + 1}`, role: 'ai', text: reply }]);
    setText('');
  };

  return (
    <ScreenShell title="AI Chat" subtitle="Quick budget help without web-only components">
      <View style={styles.chatList}>
        {messages.map(message => (
          <View key={message.id} style={[styles.chatBubble, message.role === 'ai' ? styles.aiBubble : styles.userBubble]}>
            <Text style={[styles.chatText, message.role === 'ai' ? styles.aiText : styles.userText]}>{message.text}</Text>
          </View>
        ))}
      </View>
      <View style={styles.chatComposer}>
        <TextInput style={[styles.input, styles.chatInput]} value={text} onChangeText={setText} placeholder="Ask about budgets..." placeholderTextColor="#94a3b8" />
        <Pressable style={[styles.actionPrimary, styles.chatButton]} onPress={send}>
          <Text style={styles.actionButtonText}>Send</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <ScreenShell title="Profile" subtitle="Settings and account details">
        <View style={styles.profileHero}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>NT</Text>
          </View>
          <Text style={styles.profileName}>Ngan Tran</Text>
          <Text style={styles.cardMuted}>Student budget account</Text>
        </View>

        <View style={styles.profileRow}>
          <Text style={styles.profileLabel}>Theme</Text>
          <Text style={styles.profileValue}>Light</Text>
        </View>
        <View style={styles.profileRow}>
          <Text style={styles.profileLabel}>Language</Text>
          <Text style={styles.profileValue}>English (US)</Text>
        </View>
        <View style={styles.profileRow}>
          <Text style={styles.profileLabel}>Notifications</Text>
          <Text style={styles.profileValue}>Enabled</Text>
        </View>
      </ScreenShell>
    </ScrollView>
  );
}

function CameraScreen() {
  return (
    <View style={styles.centerScreen}>
      <View style={styles.cameraFrame}>
        <Text style={styles.cameraIcon}>▣</Text>
        <Text style={styles.cameraTitle}>Receipt scanner</Text>
        <Text style={styles.cameraText}>Camera access is not wired in this simplified build, but the screen now renders safely on mobile.</Text>
        <Pressable style={styles.actionPrimary}>
          <Text style={styles.actionButtonText}>Scan receipt</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [{ ...tx, id: `${Date.now()}` }, ...prev]);
    setActiveScreen('home');
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'analytics':
        return <AnalyticsScreen transactions={transactions} />;
      case 'add':
        return <AddScreen onSave={addTransaction} />;
      case 'chat':
        return <ChatScreen />;
      case 'me':
        return <ProfileScreen />;
      case 'camera':
        return <CameraScreen />;
      case 'home':
      default:
        return <HomeScreen transactions={transactions} onNavigate={setActiveScreen} />;
    }
  };

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar style="dark" />
      <View style={styles.frame}>
        <View style={styles.topBar}>
          <Text style={styles.appTitle}>CashBrain</Text>
          <Text style={styles.appSubtitle}>Mobile budget tracker</Text>
        </View>

        <View style={styles.content}>{renderScreen()}</View>

        <View style={styles.navBar}>
          {NAV_ITEMS.map(item => {
            const active = activeScreen === item.key;
            return (
              <Pressable key={item.key} onPress={() => setActiveScreen(item.key)} style={styles.navItem}>
                <View style={[styles.navIcon, active && styles.navIconActive]}>
                  <Text style={[styles.navIconText, active && styles.navIconTextActive]}>{item.icon}</Text>
                </View>
                <Text style={[styles.navLabel, active && styles.navLabelActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#e7eef8',
  },
  frame: {
    flex: 1,
    margin: 12,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#1c4d8d',
    shadowOpacity: 0.14,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: '#f84f6b',
  },
  appTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
  },
  appSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
    fontSize: 13,
  },
  content: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  screenCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  screenHeader: {
    marginBottom: 14,
  },
  screenTitle: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '800',
  },
  screenSubtitle: {
    color: '#64748b',
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
  heroCard: {
    backgroundColor: '#1c4d8d',
    borderRadius: 28,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#1c4d8d',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  heroKicker: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '600',
  },
  heroBalance: {
    color: '#ffffff',
    marginTop: 8,
    fontSize: 30,
    fontWeight: '800',
  },
  heroCaption: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  heroStatBox: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    padding: 14,
  },
  heroStatLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  heroStatValue: {
    color: '#ffffff',
    marginTop: 6,
    fontSize: 16,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  cardMuted: {
    color: '#94a3b8',
    marginTop: 3,
    fontSize: 12,
  },
  pill: {
    backgroundColor: '#eef4ff',
    color: '#1c4d8d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
    marginTop: 14,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#1c4d8d',
  },
  summaryLine: {
    marginTop: 10,
    color: '#475569',
    fontSize: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  actionButton: {
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  actionPrimary: {
    backgroundColor: '#1c4d8d',
  },
  actionSecondary: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  actionSecondaryText: {
    color: '#1c4d8d',
    fontWeight: '700',
    fontSize: 14,
  },
  linkText: {
    color: '#1c4d8d',
    fontSize: 12,
    fontWeight: '700',
  },
  listGap: {
    marginTop: 12,
    gap: 10,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 2,
  },
  txBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txBadgeText: {
    fontSize: 18,
    fontWeight: '800',
  },
  txBody: {
    flex: 1,
  },
  txTitle: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
  },
  txMeta: {
    color: '#94a3b8',
    marginTop: 3,
    fontSize: 12,
  },
  txAmount: {
    fontSize: 13,
    fontWeight: '800',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  metricCard: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  metricLabel: {
    color: '#64748b',
    fontSize: 12,
  },
  metricValue: {
    color: '#0f172a',
    marginTop: 6,
    fontSize: 15,
    fontWeight: '800',
  },
  barCard: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    height: 200,
    paddingTop: 10,
    paddingBottom: 4,
  },
  barItem: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    flex: 1,
    width: '100%',
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: '#1c4d8d',
  },
  barLabel: {
    marginTop: 8,
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
  },
  tipCard: {
    marginTop: 14,
    borderRadius: 20,
    padding: 14,
    backgroundColor: '#eef4ff',
  },
  tipTitle: {
    color: '#1c4d8d',
    fontSize: 13,
    fontWeight: '800',
  },
  tipText: {
    color: '#334155',
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  toggleChip: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  toggleChipActive: {
    backgroundColor: '#1c4d8d',
    borderColor: '#1c4d8d',
  },
  toggleText: {
    color: '#64748b',
    fontWeight: '700',
    fontSize: 13,
  },
  toggleTextActive: {
    color: '#ffffff',
  },
  input: {
    minHeight: 50,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#0f172a',
    fontSize: 14,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 92,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#dc2626',
    marginBottom: 12,
    fontSize: 13,
    fontWeight: '600',
  },
  chatList: {
    gap: 10,
  },
  chatBubble: {
    borderRadius: 18,
    padding: 14,
    maxWidth: '90%',
  },
  aiBubble: {
    backgroundColor: '#eef4ff',
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#1c4d8d',
    alignSelf: 'flex-end',
  },
  chatText: {
    fontSize: 14,
    lineHeight: 20,
  },
  aiText: {
    color: '#0f172a',
  },
  userText: {
    color: '#ffffff',
  },
  chatComposer: {
    marginTop: 14,
  },
  chatInput: {
    marginBottom: 10,
  },
  chatButton: {
    alignSelf: 'flex-end',
    minWidth: 96,
  },
  profileHero: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: '#1c4d8d',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
  },
  profileName: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  profileLabel: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '600',
  },
  profileValue: {
    color: '#64748b',
    fontSize: 13,
  },
  centerScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  cameraFrame: {
    width: '100%',
    borderRadius: 28,
    padding: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cameraIcon: {
    fontSize: 46,
    color: '#1c4d8d',
  },
  cameraTitle: {
    color: '#0f172a',
    marginTop: 12,
    fontSize: 20,
    fontWeight: '800',
  },
  cameraText: {
    color: '#64748b',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 19,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  navIcon: {
    width: 34,
    height: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  navIconActive: {
    backgroundColor: '#dbeafe',
  },
  navIconText: {
    color: '#94a3b8',
    fontSize: 18,
    fontWeight: '800',
  },
  navIconTextActive: {
    color: '#1c4d8d',
  },
  navLabel: {
    marginTop: 5,
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  navLabelActive: {
    color: '#1c4d8d',
  },
});