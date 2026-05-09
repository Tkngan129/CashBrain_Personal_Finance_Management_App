import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(28,77,141,0.08)',
    shadowColor: '#1C4D8D',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1C4D8D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: '#94a3b8',
  },
  editButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#1C4D8D',
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
  },
  dangerButton: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 12,
  },
  dangerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
});

export function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.content}>
        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>NT</Text>
            </View>
            <Text style={styles.userName}>Ngan Tran</Text>
            <Text style={styles.userEmail}>ngan@example.com</Text>
            <Pressable style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </Pressable>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Text style={styles.settingSubtitle}>Get spending alerts</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#cbd5e1', true: '#1C4D8D' }}
              />
            </View>
            <View style={styles.settingItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingSubtitle}>Easier on the eyes</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#cbd5e1', true: '#1C4D8D' }}
              />
            </View>
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <View style={styles.card}>
            <Pressable style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: '#fee2e2' }]}>
                <Ionicons name="help-circle" size={18} color="#ef4444" />
              </View>
              <Text style={styles.menuLabel}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={18} color="#cbd5e1" style={{ marginLeft: 'auto' }} />
            </Pressable>
            <Pressable style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: '#faf5ff' }]}>
                <Ionicons name="document-text" size={18} color="#8b5cf6" />
              </View>
              <Text style={styles.menuLabel}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={18} color="#cbd5e1" style={{ marginLeft: 'auto' }} />
            </Pressable>
            <Pressable style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: '#fef2f2' }]}>
                <Ionicons name="information-circle" size={18} color="#f97316" />
              </View>
              <Text style={styles.menuLabel}>About App</Text>
              <Ionicons name="chevron-forward" size={18} color="#cbd5e1" style={{ marginLeft: 'auto' }} />
            </Pressable>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <Pressable style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>Sign Out</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
