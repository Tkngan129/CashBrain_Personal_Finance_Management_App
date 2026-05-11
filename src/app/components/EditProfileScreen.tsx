import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../context/ThemeContext';

interface EditProfileScreenProps {
  onBack: () => void;
}

export function EditProfileScreen({ onBack }: EditProfileScreenProps) {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<'personal' | 'preferences'>('personal');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
        <Pressable style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={[styles.tabsWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <Pressable
            style={[styles.tabButton, activeTab === 'personal' && styles.tabButtonActive]}
            onPress={() => setActiveTab('personal')}
          >
            <Text style={[styles.tabText, activeTab === 'personal' && styles.tabTextActive, { color: activeTab === 'personal' ? '#ffffff' : colors.textMuted }]}>
              Personal Info
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabButton, activeTab === 'preferences' && styles.tabButtonActive]}
            onPress={() => setActiveTab('preferences')}
          >
            <Text style={[styles.tabText, activeTab === 'preferences' && styles.tabTextActive, { color: activeTab === 'preferences' ? '#ffffff' : colors.textMuted }]}>
              Preferences
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'personal' ? (
          <View style={styles.list}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={40} color="#ffffff" />
                </View>
                <Pressable style={[styles.avatarEditButton, { borderColor: colors.bg }]}>
                  <Ionicons name="camera" size={14} color="#ffffff" />
                </Pressable>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Full Name</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Ionicons name="person-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Ngan Tran"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Email Address</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="ngan.tran@email.com"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Phone Number</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Ionicons name="call-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="+84 123 456 789"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.list}>
             <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Currency</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Ionicons name="cash-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value="VND"
                  editable={false}
                />
                <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Time Zone</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Ionicons name="time-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value="Asia/Ho_Chi_Minh"
                  editable={false}
                />
                <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    elevation: 4,
    shadowColor: '#1e293b',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  saveButton: {
    padding: 8,
    marginRight: -8,
  },
  saveButtonText: {
    color: '#1C4D8D',
    fontWeight: '800',
    fontSize: 16,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  tabsWrap: {
    flexDirection: 'row',
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#1C4D8D',
    shadowColor: '#1C4D8D',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor: '#1C4D8D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    height: '100%',
  },
});
