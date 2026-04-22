import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import GlassCard from '../components/GlassCard';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/theme';

const ProfileScreen = () => {
  const { totalExpense } = useFinance();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const theme = getTheme(isDarkMode);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={[theme.backgroundStart, theme.backgroundMid, theme.backgroundEnd]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <GlassCard style={styles.profileHeader}>
            <Text style={[styles.greeting, { color: theme.textPrimary }]}>Chào Ngân 👋</Text>
            <Text style={[styles.subGreeting, { color: theme.textSecondary }]}>Hôm nay bạn đã tiết kiệm được 420k</Text>
          </GlassCard>

          <View style={styles.statsRow}>
            <GlassCard style={styles.statCard}>
              <Text style={[styles.statValue, { color: theme.textPrimary }]}>{totalExpense}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Chi tiêu tháng</Text>
            </GlassCard>
            <GlassCard style={styles.statCard}>
              <Text style={[styles.statValue, { color: theme.textPrimary }]}>4</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Ngân sách còn lại</Text>
            </GlassCard>
          </View>

          <GlassCard style={styles.budgetCard}>
            <Text style={[styles.budgetTitle, { color: theme.textPrimary }]}>Ngân sách Ăn uống</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '65%' }]} />
            </View>
            <Text style={[styles.budgetDetail, { color: theme.textSecondary }]}>1.2tr / 2tr VND</Text>
          </GlassCard>

          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Cài đặt</Text>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingText, { color: theme.textPrimary }]}>Chế độ tối (Dark Mode)</Text>
            <Switch
              trackColor={{ false: '#cbd5e1', true: theme.accent }}
              thumbColor={isDarkMode ? '#fff' : '#f4f4f5'}
              onValueChange={toggleDarkMode}
              value={isDarkMode}
            />
          </View>

          {['Tài khoản', 'Cá nhân hóa', 'Hỗ trợ & FAQ'].map((item) => (
            <TouchableOpacity key={item} style={styles.settingRow}>
              <Text style={[styles.settingText, { color: theme.textPrimary }]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  gradient: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  profileHeader: { alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 24, fontWeight: '700' },
  subGreeting: { fontSize: 15, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: '700' },
  statLabel: { fontSize: 13 },
  budgetCard: { marginBottom: 24 },
  budgetTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  progressBarContainer: { height: 8, backgroundColor: '#e2e8f0', borderRadius: 999, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#9ED3DC', borderRadius: 999 },
  budgetDetail: { marginTop: 8, fontSize: 14, textAlign: 'right' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    padding: 18,
    borderRadius: 16,
    marginBottom: 8,
  },
  settingText: { fontSize: 16, fontWeight: '500' },
});

export default ProfileScreen;