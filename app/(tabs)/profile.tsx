import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    { icon: 'bell', label: 'Notifications', badge: 3 },
    { icon: 'palette', label: 'Appearance' },
    { icon: 'lock', label: 'Security' },
    { icon: 'file-document', label: 'Terms & Privacy' },
    { icon: 'information', label: 'About' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account-circle" size={64} color="#CD5D3D" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          </View>
        </View>

        {/* Edit Profile */}
        <TouchableOpacity style={styles.editButton}>
          <MaterialCommunityIcons name="pencil" size={16} color="#FFFFFF" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Transactions</Text>
            <Text style={styles.statValue}>24</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Budgets</Text>
            <Text style={styles.statValue}>5</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Saved Goals</Text>
            <Text style={styles.statValue}>3</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {menuItems.map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <MaterialCommunityIcons name={item.icon as any} size={20} color="#CD5D3D" />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <MaterialCommunityIcons name="chevron-right" size={20} color="#A0A0A0" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Premium Section */}
        <View style={styles.premiumCard}>
          <View style={styles.premiumIcon}>
            <MaterialCommunityIcons name="crown" size={32} color="#FFD700" />
          </View>
          <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
          <Text style={styles.premiumText}>Unlock advanced analytics and unlimited budgets</Text>
          <TouchableOpacity style={styles.premiumButton}>
            <Text style={styles.premiumButtonText}>Learn More</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={18} color="#FF6B6B" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>CashBrain v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3EA',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E0D1',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E8E0D1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E2C30',
  },
  userEmail: {
    fontSize: 13,
    color: '#A0A0A0',
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#CD5D3D',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  statsSection: {
    flexDirection: 'row',
    gap: 10,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E0D1',
  },
  statLabel: {
    fontSize: 12,
    color: '#A0A0A0',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E2C30',
    marginTop: 4,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E2C30',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: '#E8E0D1',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E2C30',
  },
  badge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 999,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  premiumCard: {
    backgroundColor: '#FFF8E6',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD699',
  },
  premiumIcon: {
    marginBottom: 8,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#CD5D3D',
    marginBottom: 4,
  },
  premiumText: {
    fontSize: 13,
    color: '#8B6914',
    textAlign: 'center',
    marginBottom: 12,
  },
  premiumButton: {
    backgroundColor: '#CD5D3D',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 9,
  },
  premiumButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 12,
  },
  logoutText: {
    color: '#FF6B6B',
    fontWeight: '700',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 12,
  },
  footerText: {
    fontSize: 12,
    color: '#A0A0A0',
  },
});
