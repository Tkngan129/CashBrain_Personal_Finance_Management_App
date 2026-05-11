import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../context/ThemeContext';
import { categoryGroups } from '../../../constants/categories';

interface ManageCategoriesScreenProps {
  onBack: () => void;
  onEditCategory?: (category: any) => void;
}

export function ManageCategoriesScreen({ onBack, onEditCategory }: ManageCategoriesScreenProps) {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Categories</Text>
        <Pressable style={styles.addButton}>
          <Ionicons name="add" size={24} color="#1C4D8D" />
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={[styles.tabsWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <Pressable
            style={[styles.tabButton, activeTab === 'expense' && styles.tabButtonActive]}
            onPress={() => setActiveTab('expense')}
          >
            <Text style={[styles.tabText, activeTab === 'expense' && styles.tabTextActive, { color: activeTab === 'expense' ? '#ffffff' : colors.textMuted }]}>
              Expense
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabButton, activeTab === 'income' && styles.tabButtonActive]}
            onPress={() => setActiveTab('income')}
          >
            <Text style={[styles.tabText, activeTab === 'income' && styles.tabTextActive, { color: activeTab === 'income' ? '#ffffff' : colors.textMuted }]}>
              Income
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'expense' ? (
          <View style={styles.list}>
            {categoryGroups.map((group) => (
              <View key={group.id} style={styles.groupSection}>
                <Text style={[styles.groupTitle, { color: colors.textMuted }]}>{group.title.toUpperCase()}</Text>
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                  {group.categories.map((cat, index) => (
                    <View key={cat.id} style={[styles.categoryItem, index === group.categories.length - 1 && styles.categoryItemLast, { borderBottomColor: colors.border }]}>
                      <View style={[styles.iconWrap, { backgroundColor: group.bgColor }]}>
                        <Ionicons name={cat.icon as any} size={18} color={cat.color} />
                      </View>
                      <Text style={[styles.categoryName, { color: colors.text }]}>{cat.label}</Text>
                      <Pressable style={styles.editButton} onPress={() => onEditCategory?.(cat)}>
                        <Ionicons name="pencil" size={16} color={colors.textMuted} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.list}>
            <View style={styles.groupSection}>
              <Text style={[styles.groupTitle, { color: colors.textMuted }]}>INCOME SOURCES</Text>
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <View style={[styles.categoryItem, { borderBottomColor: colors.border }]}>
                  <View style={[styles.iconWrap, { backgroundColor: '#ecfdf5' }]}>
                    <Ionicons name="wallet-outline" size={18} color="#22c55e" />
                  </View>
                  <Text style={[styles.categoryName, { color: colors.text }]}>Salary</Text>
                  <Pressable style={styles.editButton} onPress={() => onEditCategory?.({ id: 901, label: 'Salary', icon: 'wallet-outline', color: '#22c55e' })}>
                    <Ionicons name="pencil" size={16} color={colors.textMuted} />
                  </Pressable>
                </View>
                <View style={[styles.categoryItem, styles.categoryItemLast]}>
                  <View style={[styles.iconWrap, { backgroundColor: '#eff6ff' }]}>
                    <Ionicons name="business-outline" size={18} color="#3b82f6" />
                  </View>
                  <Text style={[styles.categoryName, { color: colors.text }]}>Freelance</Text>
                  <Pressable style={styles.editButton} onPress={() => onEditCategory?.({ id: 902, label: 'Freelance', icon: 'business-outline', color: '#3b82f6' })}>
                    <Ionicons name="pencil" size={16} color={colors.textMuted} />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
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
  addButton: {
    padding: 8,
    marginRight: -8,
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
    gap: 24,
  },
  groupSection: {
    gap: 8,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    shadowColor: '#1e293b',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  categoryItemLast: {
    borderBottomWidth: 0,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
    marginRight: -8,
  },
});
