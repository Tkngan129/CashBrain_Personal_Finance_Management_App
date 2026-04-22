import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit'; // Install: react-native-chart-kit + react-native-svg
import GlassCard from '../components/GlassCard';
import { useFinance } from '../context/FinanceContext';

const screenWidth = Dimensions.get('window').width;

const AnalyticsScreen = () => {
  const { transactions } = useFinance();
  const [activeSubTab, setActiveSubTab] = useState('Overview');

  const subTabs = ['Overview', 'Calendar', 'Expenses'];

  // Mock data for charts
  const barData = {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    datasets: [{ data: [1200000, 800000, 1500000, 600000, 2000000, 900000] }],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#e8f0fb', '#f4f8ff', '#e0f3f7']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Sub-tabs */}
          <View style={styles.subTabContainer}>
            {subTabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.subTab, activeSubTab === tab && styles.subTabActive]}
                onPress={() => setActiveSubTab(tab)}
              >
                <Text style={[styles.subTabText, activeSubTab === tab && styles.subTabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeSubTab === 'Overview' && (
            <GlassCard>
              <Text style={styles.chartTitle}>Monthly Overview</Text>
              <BarChart
                data={barData}
                width={screenWidth - 60}
                height={220}
                yAxisLabel="₫"
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(28, 77, 141, ${opacity})`,
                  barPercentage: 0.6,
                }}
                style={{ borderRadius: 16 }}
              />
            </GlassCard>
          )}

          {activeSubTab === 'Calendar' && (
            <GlassCard>
              <Text style={styles.chartTitle}>April 2026 Calendar</Text>
              {/* Simple calendar grid placeholder - production would use react-native-calendars */}
              <View style={styles.calendarGrid}>
                {Array.from({ length: 35 }).map((_, i) => (
                  <View key={i} style={styles.dayCell}>
                    <Text style={styles.dayText}>{i + 1}</Text>
                    {i % 3 === 0 && <View style={styles.expenseDot} />}
                  </View>
                ))}
              </View>
              <Text style={styles.drawerHint}>Tap a day to see transactions (drawer simulated below)</Text>
              {/* Simulated transaction list for selected day */}
              <View style={{ marginTop: 16 }}>
                {transactions.slice(0, 2).map((tx) => (
                  <View key={tx.id} style={styles.txRow}>
                    <Text style={styles.txName}>{tx.category || tx.title || 'Transaction'}</Text>
                    <Text style={styles.txAmount}>
                      {tx.amount != null ? `${tx.amount} VND` : ''}
                    </Text>
                  </View>
                ))}
              </View>
            </GlassCard>
          )}

          {activeSubTab === 'Expenses' && (
            <GlassCard>
              <Text style={styles.chartTitle}>Expense Breakdown</Text>
              <View style={styles.donutPlaceholder}>
                <Text style={styles.donutCenter}>68%</Text>
                <Text style={styles.donutLabel}>Food &amp; Drink</Text>
              </View>
              {/* Category bars */}
              <View style={styles.categoryBars}>
                <View style={styles.barRow}>
                  <Text style={styles.categoryName}>Ăn uống</Text>
                  <View style={[styles.bar, { width: '68%', backgroundColor: '#1C4D8D' }]} />
                  <Text style={styles.barValue}>1,240,000 VND</Text>
                </View>
                <View style={styles.barRow}>
                  <Text style={styles.categoryName}>Mua sắm</Text>
                  <View style={[styles.bar, { width: '22%', backgroundColor: '#9ED3DC' }]} />
                  <Text style={styles.barValue}>420,000 VND</Text>
                </View>
              </View>
            </GlassCard>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  gradient: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  subTabContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 999, padding: 4, marginBottom: 20 },
  subTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 999 },
  subTabActive: { backgroundColor: '#fff', shadowColor: '#1C4D8D', shadowOpacity: 0.1, shadowRadius: 8 },
  subTabText: { fontWeight: '600', color: '#64748B' },
  subTabTextActive: { color: '#1C4D8D' },
  chartTitle: { fontSize: 18, fontWeight: '600', color: '#1C4D8D', marginBottom: 12 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  dayCell: { width: '13%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', borderRadius: 8 },
  dayText: { fontSize: 13, fontWeight: '500' },
  expenseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444', marginTop: 4 },
  drawerHint: { fontSize: 12, color: '#64748B', marginTop: 12, textAlign: 'center' },
  donutPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#f1f5f9',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 20,
    borderColor: '#9ED3DC',
    marginVertical: 20,
  },
  donutCenter: { fontSize: 32, fontWeight: '700', color: '#1C4D8D' },
  donutLabel: { fontSize: 14, color: '#64748B' },
  categoryBars: { marginTop: 20 },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  categoryName: { width: 90, fontSize: 14 },
  bar: { height: 12, borderRadius: 999, marginHorizontal: 12 },
  barValue: { fontSize: 14, fontWeight: '500', color: '#1C4D8D' },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  txName: { fontSize: 14, color: '#334155' },
  txAmount: { fontSize: 14, fontWeight: '600', color: '#1C4D8D' },
});

export default AnalyticsScreen;
