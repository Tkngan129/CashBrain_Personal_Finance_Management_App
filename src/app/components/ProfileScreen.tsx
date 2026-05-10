import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useColors, useTheme } from '../../context/ThemeContext';

const TOTAL_BUDGET = 4_000_000;
const TOTAL_SPENT = 719_000;
const REMAINING = TOTAL_BUDGET - TOTAL_SPENT;
const REMAINING_PCT = Math.round((REMAINING / TOTAL_BUDGET) * 100);

const fmtVND = (v: number) => `${new Intl.NumberFormat('vi-VN').format(v)} VND`;

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  subtitle: string;
  last?: boolean;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
  colors: ReturnType<typeof import('../../context/ThemeContext').useColors>;
};

function MenuItem({ icon, iconBg, iconColor, label, subtitle, last, toggle, toggleValue, onToggle, colors }: MenuItemProps) {
  return (
    <Pressable
      style={[styles.menuItem, last && styles.menuItemLast, { borderBottomColor: colors.border }]}
    >
      <View style={[styles.menuIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.menuText}>
        <Text style={[styles.menuLabel, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.menuSubtitle, { color: colors.textMuted }]}>{subtitle}</Text>
      </View>
      {toggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: colors.switchTrackOff, true: '#1C4D8D' }}
          thumbColor="#ffffff"
        />
      ) : (
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      )}
    </Pressable>
  );
}

export function ProfileScreen() {
  const { isDark, setDark } = useTheme();
  const colors = useColors();
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Page Header */}
      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>My Profile</Text>
        <Pressable style={[styles.editIconButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="create-outline" size={20} color="#1C4D8D" />
        </Pressable>
      </View>

      {/* User Card */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={styles.userRow}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={30} color="#ffffff" />
            </View>
            <View style={styles.onlineDot} />
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>Ngan Tran</Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>ngan.tran@email.com</Text>
            <View style={styles.proBadge}>
              <Ionicons name="star" size={11} color="#1C4D8D" />
              <Text style={styles.proBadgeText}>Pro Member</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stats Row */}
      <View style={[styles.card, styles.statsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>24</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Transactions</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>9</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Categories</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>{REMAINING_PCT}%</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Budget Left</Text>
        </View>
      </View>

      {/* April Budget */}
      <View style={[styles.card, styles.budgetCard, isDark && { backgroundColor: '#0d2440', borderColor: '#1e3a5f' }]}>
        <View style={styles.budgetHeaderRow}>
          <Text style={[styles.budgetTitle, { color: colors.text }]}>April Budget</Text>
          <View style={styles.budgetPill}>
            <Text style={styles.budgetPillText}>{REMAINING_PCT}% left</Text>
          </View>
        </View>
        <Text style={[styles.budgetSub, { color: colors.textSecondary }]}>{fmtVND(TOTAL_SPENT)} spent of {fmtVND(TOTAL_BUDGET)}</Text>
        <View style={[styles.progressTrack, isDark && { backgroundColor: '#1e3a5f' }]}>
          <View style={[styles.progressFill, { width: `${REMAINING_PCT}%` }]} />
        </View>
        <View style={styles.budgetFooterRow}>
          <Text style={[styles.budgetSpent, { color: colors.textSecondary }]}>{fmtVND(TOTAL_SPENT)} spent</Text>
          <Text style={[styles.budgetDot, { color: colors.textMuted }]}>·</Text>
          <Text style={styles.budgetRemaining}>{fmtVND(REMAINING)} remaining</Text>
        </View>
      </View>

      {/* Streak */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={styles.streakRow}>
          <View style={[styles.streakIconWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Text style={{ fontSize: 28 }}>🏆</Text>
          </View>
          <View style={styles.streakContent}>
            <Text style={[styles.streakTitle, { color: colors.text }]}>No streak yet</Text>
            <Text style={[styles.streakSub, { color: colors.textMuted }]}>Scan a receipt to start</Text>
            <View style={styles.streakHint}>
              <Ionicons name="camera-outline" size={13} color={colors.textSecondary} />
              <Text style={[styles.streakHintText, { color: colors.textSecondary }]}>Capture your first expense to start a streak!</Text>
            </View>
          </View>
          <View style={styles.streakCount}>
            <Text style={[styles.streakCountNum, { color: colors.text }]}>0</Text>
            <Text style={[styles.streakCountLabel, { color: colors.textMuted }]}>receipts</Text>
          </View>
        </View>
      </View>

      {/* Photo Diary */}
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>📷  PHOTO DIARY</Text>
      <View style={[styles.card, styles.photoDiaryCard, { backgroundColor: isDark ? '#1c2333' : '#f9fbff', borderColor: colors.border }]}>
        <Ionicons name="camera-outline" size={32} color={colors.textMuted} />
        <Text style={[styles.photoDiaryTitle, { color: colors.text }]}>No photo receipts yet</Text>
        <Text style={[styles.photoDiaryDesc, { color: colors.textMuted }]}>Tap the camera button to scan your first receipt</Text>
      </View>

      {/* Categories */}
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>CATEGORIES</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Pressable style={[styles.menuItem, styles.menuItemLast]}>
          <View style={[styles.menuIcon, { backgroundColor: '#fff7ed' }]}>
            <Ionicons name="pricetag-outline" size={18} color="#f97316" />
          </View>
          <View style={styles.menuText}>
            <Text style={[styles.menuLabel, { color: colors.text }]}>Manage Categories</Text>
            <Text style={[styles.menuSubtitle, { color: colors.textMuted }]}>9 categories · Add, edit or delete</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </Pressable>
      </View>

      {/* Account */}
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>ACCOUNT</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <MenuItem icon="person-outline" iconBg="#eff6ff" iconColor="#3b82f6" label="Edit Profile" subtitle="Name, email, avatar" colors={colors} />
        <MenuItem icon="gift-outline" iconBg="#f5f3ff" iconColor="#8b5cf6" label="Budget Settings" subtitle="Monthly limits" colors={colors} />
        <MenuItem icon="card-outline" iconBg="#f0fdf4" iconColor="#22c55e" label="Payment Methods" subtitle="Cards & accounts" last colors={colors} />
      </View>

      {/* Personalize */}
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>PERSONALIZE</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <MenuItem icon="notifications-outline" iconBg="#f0fdf4" iconColor="#22c55e" label="Notifications" subtitle="Alerts & reminders" colors={colors} />
        <MenuItem icon="moon-outline" iconBg="#eff6ff" iconColor="#3b82f6" label="Dark Mode" subtitle="Theme & display" toggle toggleValue={isDark} onToggle={setDark} colors={colors} />
        <MenuItem icon="globe-outline" iconBg="#fff7ed" iconColor="#f97316" label="Language" subtitle="English (US)" last colors={colors} />
      </View>

      {/* Support & Legal */}
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>SUPPORT & LEGAL</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <MenuItem icon="shield-outline" iconBg="#fef2f2" iconColor="#ef4444" label="Privacy & Security" subtitle="Data & permissions" colors={colors} />
        <MenuItem icon="help-circle-outline" iconBg="#eff6ff" iconColor="#3b82f6" label="Help Center" subtitle="FAQs & support" colors={colors} />
        <MenuItem icon="settings-outline" iconBg="#f5f3ff" iconColor="#8b5cf6" label="App Settings" subtitle="Advanced options" last colors={colors} />
      </View>

      {/* Log Out */}
      <Pressable style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={18} color="#ef4444" />
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>

      {/* Footer */}
      <Text style={[styles.footer, { color: colors.textMuted }]}>Version 1.0.0 · Made with ❤️</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef3f8',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 32,
    gap: 12,
  },

  // Page Header
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1e293b',
  },
  editIconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1e293b',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },

  // Card base
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#1e293b',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 14,
    elevation: 2,
  },

  // User Card
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: '#1C4D8D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#ffffff',
    bottom: 0,
    right: 0,
  },
  userInfo: {
    flex: 1,
    gap: 3,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1e293b',
  },
  userEmail: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 2,
  },
  proBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C4D8D',
  },

  // Stats
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#e8edf5',
  },

  // Budget
  budgetCard: {
    gap: 8,
    backgroundColor: '#f0f7ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  budgetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  budgetTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
  },
  budgetPill: {
    backgroundColor: '#1C4D8D',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  budgetPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  budgetSub: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#c7dff7',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1C4D8D',
    borderRadius: 999,
  },
  budgetFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  budgetSpent: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  budgetDot: {
    color: '#94a3b8',
    fontSize: 12,
  },
  budgetRemaining: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C4D8D',
  },

  // Streak
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e8edf5',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  streakContent: {
    flex: 1,
    gap: 2,
  },
  streakTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
  },
  streakSub: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  streakHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  streakHintText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  streakCount: {
    alignItems: 'center',
    flexShrink: 0,
  },
  streakCountNum: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1e293b',
  },
  streakCountLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
  },

  // Photo Diary
  photoDiaryCard: {
    alignItems: 'center',
    paddingVertical: 28,
    borderWidth: 1.5,
    borderColor: '#dde4ef',
    borderStyle: 'dashed',
    backgroundColor: '#f9fbff',
    gap: 8,
  },
  photoDiaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  photoDiaryDesc: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Section Labels
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
    marginBottom: -4,
    marginTop: 4,
    paddingHorizontal: 4,
  },

  // Menu Items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f4f8',
  },
  menuItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  menuText: {
    flex: 1,
    gap: 2,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },

  // Log Out
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#fca5a5',
    backgroundColor: '#fff5f5',
    marginTop: 4,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ef4444',
  },

  // Footer
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: '#c8d2e0',
    fontWeight: '500',
    marginTop: 4,
  },
});
