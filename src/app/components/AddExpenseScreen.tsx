import { useExpenses } from '@/src/context/expenseContext';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingBottom: 20,
  },
  section: {
    marginVertical: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(28,77,141,0.08)',
    shadowColor: '#1C4D8D',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1a202c',
    backgroundColor: '#f8fafc',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  button: {
    backgroundColor: '#1C4D8D',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarModal: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  categoryModal: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayCell: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 18,
  },
  dayCellSelected: {
    backgroundColor: '#1C4D8D',
  },
  dayCellText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  todayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  quickItem: {
    width: '23%',
    alignItems: 'center',
  },
  quickIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickIconWrapActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  quickLabel: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    width: '100%',
  },
  quickLabelActive: {
    color: '#1C4D8D',
  },
  moreButtonLabel: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  categoryContainer: {
    gap: 16,
  },
  groupCard: {
    marginBottom: 14,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eef2f7',
    backgroundColor: '#ffffff',
  },
  groupHeader: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  categoryGrid: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 22,
  },
  categoryItemIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryItemLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#0A84FF',        // Màu xanh biển chủ đạo (iOS-like blue)
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#5A9EFF',        // Màu nhạt hơn khi disabled
    opacity: 0.8,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  }
});

interface AddExpenseScreenProps {
  onClose?: () => void;
  initialType?: 'expense' | 'income';
}

type CategoryItem = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

const basicCategories: CategoryItem[] = [
  { id: '6a0d1c32c9127e9322c18cf2', label: 'Dining', icon: 'restaurant-outline', color: '#f59e0b' },
  { id: '6a0d1c32c9127e9322c18cf4', label: 'Shopping', icon: 'bag-handle-outline', color: '#ec4899' },
  { id: '6a0d1c32c9127e9322c18cf3', label: 'Transport', icon: 'car-outline', color: '#3b82f6' },
];


export function AddExpenseScreen({ onClose, initialType = 'expense' }: AddExpenseScreenProps) {
  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem['label']>(basicCategories[0].label);
  const [selectedCategoryID, setSelectedCategoryID] = useState<CategoryItem['id']>(basicCategories[0].id);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [date, setDate] = useState('Today');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(dayjs().startOf('month'));

  const {fetchExpensesCategories, expenseCategories, addExpense, addIncome, loading} = useExpenses();

  useEffect(() => {
    fetchExpensesCategories();
  }, []);

  const moreCategories = useMemo(() => {

    if (!expenseCategories) return [];

    return expenseCategories.map((group) => ({
      groupId: group.id,
      title: group.title,
      color: group.color,
      bgColor: group.bgColor,

      categories: group.categories.map((item) => ({
        id: item.id,

        label: item.label,

        icon:
          item.icon as keyof typeof Ionicons.glyphMap,

        color: item.color,
      })),
    }));
  }, [expenseCategories]);

    const moreCategoryItems = useMemo(
    () => moreCategories.flatMap((group) => group.categories),
    [moreCategories],
  );

  // quick categories
  const quickCategories = useMemo(() => {

    const allItems = [
      ...basicCategories,

      ...moreCategoryItems.filter(
        (item) =>
          !basicCategories.some(
            (basicItem) =>
              basicItem.label === item.label,
          ),
      ),
    ];

    const selectedItem =
      allItems.find(
        (item) =>
          item.label === selectedCategory,
      ) ?? basicCategories[0];

    const fallbackItems =
      basicCategories.filter(
        (item) =>
          item.label !== selectedItem.label,
      );

    return [selectedItem, ...fallbackItems].slice(0, 3);

  }, [moreCategoryItems, selectedCategory]);

  const selectedMoreCategory = useMemo(
    () =>
      moreCategoryItems.find(
        (item) =>
          item.label === selectedCategory,
      ),
    [moreCategoryItems, selectedCategory],
  );

  

  const formatDateLabel = (d: Date) => {
    const today = dayjs();
    const target = dayjs(d);
    if (today.isSame(target, 'day')) return 'Today';
    return target.format('MMM D');
  };

  const handleSubmit = async () => {

    if (amount.trim() && description.trim()) {
      const formatDate = new Date(selectedDate);
        
      const year = formatDate.getFullYear();
      const month = String(formatDate.getMonth() + 1).padStart(2, '0');
      const day = String(formatDate.getDate()).padStart(2, '0');
      
      const dateString = `${year}-${month}-${day}`;
      if (type === 'expense'){
        await addExpense({
          amount: Number(amount),
          category_id: String(selectedCategoryID),
          date: dateString,
          note: description,
        })
      }else{
        await addIncome({
          amount: Number(amount),
          date: dateString,
          note: description,
        })
      }
      

      onClose?.();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{type === 'expense' ? 'Add Expense' : 'Add Income'}</Text>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={18} color="#64748b" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable
                style={[
                  { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
                  type === 'expense' && { backgroundColor: '#fee2e2' },
                ]}
                onPress={() => setType('expense')}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: type === 'expense' ? '#ef4444' : '#94a3b8' }}>
                  Expense
                </Text>
              </Pressable>
              <Pressable
                style={[
                  { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
                  type === 'income' && { backgroundColor: '#f0fdf4' },
                ]}
                onPress={() => setType('income')}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: type === 'income' ? '#22c55e' : '#94a3b8' }}>
                  Income
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Amount (VND)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor="#cbd5e1"
              keyboardType="number-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, { minHeight: 80, paddingTop: 12 }]}
              placeholder="What was this for?"
              placeholderTextColor="#cbd5e1"
              multiline
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </View>

        {type === 'expense' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.card}>
              <View style={styles.quickGrid}>
                {quickCategories.map((item) => {
                  const isSelected = selectedCategory === item.label;
                  return (
                    <Pressable
                      key={item.id}
                      style={styles.quickItem}
                      onPress={() => {
                        setSelectedCategory(item.label);
                        setSelectedCategoryID(item.id);
                      }}
                    >
                      <View style={[styles.quickIconWrap, isSelected && styles.quickIconWrapActive]}>
                        <Ionicons name={item.icon as any} size={30} color={item.color} />
                      </View>
                      <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.quickLabel, isSelected && styles.quickLabelActive]}>{item.label}</Text>
                    </Pressable>
                  );
                })}

                <Pressable style={styles.quickItem} onPress={() => setShowMoreCategories(true)}>
                  <View style={styles.quickIconWrap}>
                    <Ionicons name="grid-outline" size={30} color="#ec4899" />
                  </View>
                  <Text style={styles.moreButtonLabel}>More</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Date</Text>
            <Pressable
              style={[
                styles.input,
                { justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' },
              ]}
              onPress={() => setShowCalendar(true)}
            >
              <Text style={{ color: '#0f172a' }}>{date}</Text>
              <Ionicons name="calendar-outline" size={18} color="#64748b" />
            </Pressable>

            <Modal visible={showCalendar} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.calendarModal}>
                  {/* Header điều hướng */}
                  <View style={styles.calendarHeader}>
                    <TouchableOpacity onPress={() => setCalendarMonth(calendarMonth.subtract(1, 'month'))}>
                      <Ionicons name="chevron-back" size={22} color="#1C4D8D" />
                    </TouchableOpacity>
                    <Text style={styles.monthText}>{calendarMonth.format('MMMM YYYY')}</Text>
                    <TouchableOpacity onPress={() => setCalendarMonth(calendarMonth.add(1, 'month'))}>
                      <Ionicons name="chevron-forward" size={22} color="#1C4D8D" />
                    </TouchableOpacity>
                  </View>

                  {/* Hàng tiêu đề Thứ (Sử dụng % để chính xác tuyệt đối) */}
                  <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((w) => (
                      <Text key={w} style={{ width: '14.28%', textAlign: 'center', color: '#64748b', fontWeight: '700' }}>
                        {w}
                      </Text>
                    ))}
                  </View>

                  {/* Lưới ngày */}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {(() => {
                      const firstDayOfMonth = calendarMonth.startOf('month');
                      const startDay = firstDayOfMonth.day(); // 0 (Sun) đến 6 (Sat)
                      const daysInMonth = calendarMonth.daysInMonth();
                      
                      // 1. Tạo các ô trống đầu tháng
                      const blanks = Array.from({ length: startDay }).map((_, index) => (
                        <View key={`blank-${index}`} style={{ width: '14.28%', height: 40 }} />
                      ));

                      // 2. Tạo các ô ngày trong tháng
                      const days = Array.from({ length: daysInMonth }).map((_, index) => {
                        const dayNum = index + 1;
                        // Quan trọng: Tạo object ngày chính xác từ ngày đầu tháng để tránh nhảy ngày
                        const currentDay = firstDayOfMonth.date(dayNum); 
                        const isSelected = dayjs(selectedDate).isSame(currentDay, 'day');
                        const isToday = dayjs().isSame(currentDay, 'day');

                        return (
                          <Pressable
                            key={dayNum}
                            style={[
                              { width: '14.28%', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 50},
                              isSelected && styles.dayCellSelected,
                              !isSelected && isToday && { borderBottomWidth: 2, borderBottomColor: '#1C4D8D' }
                            ]}
                            onPress={() => {
                              const newDate = currentDay.toDate();
                              setSelectedDate(newDate);
                              setDate(formatDateLabel(newDate)); // Đảm bảo hàm này hoạt động đúng
                              setShowCalendar(false);
                            }}
                          >
                            <Text style={[
                              { color: '#1e293b', fontSize: 14 },
                              isSelected && { color: '#fff', fontWeight: 'bold' }
                            ]}>
                              {dayNum}
                            </Text>
                          </Pressable>
                        );
                      });

                      return [...blanks, ...days];
                    })()}
                  </View>

                  {/* Footer Buttons */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                    <Pressable
                      onPress={() => {
                        const today = new Date();
                        setSelectedDate(today);
                        setCalendarMonth(dayjs(today)); // Reset lịch về tháng hiện tại
                        setDate(formatDateLabel(today));
                        setShowCalendar(false);
                      }}
                      style={styles.todayButton}
                    >
                      <Text style={{ color: '#1C4D8D', fontWeight: '700' }}>Today</Text>
                    </Pressable>
                    <Pressable onPress={() => setShowCalendar(false)} style={styles.todayButton}>
                      <Text style={{ color: '#64748b' }}>Cancel</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </View>
        
        {/*  SHOW MORE CATEGORIES SCREEN */}
        <Modal visible={showMoreCategories} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.categoryModal}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#0f172a' }}>Choose Category</Text>
                <Pressable onPress={() => setShowMoreCategories(false)}>
                  <Ionicons name="close" size={26} color="#64748b" />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {selectedMoreCategory && (
                  <View style={{ marginBottom: 16 }}>
                    {/*  SELECTED CATEGORY ICON */}
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 8, paddingHorizontal: 4 }}>
                      Selected
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderRadius: 18,
                        borderWidth: 1,
                        borderColor: selectedMoreCategory.color,
                        backgroundColor: `${selectedMoreCategory.color}15`,
                        padding: 14,
                        marginBottom: 14,
                      }}
                    >
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 16,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#fff',
                          marginRight: 12,
                          borderWidth: 1,
                          borderColor: `${selectedMoreCategory.color}35`,
                        }}
                      >
                        <Ionicons name={selectedMoreCategory.icon} size={26} color={selectedMoreCategory.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: '800', color: '#0f172a' }}>
                          {selectedMoreCategory.label}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* MAP OF MORE CATEGORIES */}
                <View style={styles.categoryContainer}>
                  {moreCategories.map((group) => (
                    <View key={group.groupId} style={styles.groupCard}>
                      <View
                        style={[
                          styles.groupHeader,
                          { backgroundColor: group.bgColor },
                        ]}
                      >
                        <Text
                          style={[
                            styles.groupTitle,
                            { color: group.color },
                          ]}
                        >
                          {group.title}
                        </Text>
                      </View>

                      <View style={styles.categoryGrid}>
                        {group.categories.map((item) => {
                          const isSelected = selectedCategory === item.label;
                          return (
                            <Pressable
                              key={item.id}
                              style={styles.categoryItem}
                              onPress={() => {
                                setSelectedCategory(item.label);
                                setSelectedCategoryID(item.id);
                                setShowMoreCategories(false);
                              }}
                            >
                              <View
                                style={[
                                  styles.categoryItemIcon,
                                  {
                                    backgroundColor: isSelected ? `${item.color}18` : '#F8FAFC',
                                    borderWidth: 1,
                                    borderColor: item.color,
                                  },
                                ]}
                              >
                                <Ionicons
                                  name={item.icon as any}
                                  size={28}
                                  color={item.color}
                                />
                              </View>

                              <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.categoryItemLabel, { color: item.color, fontWeight: isSelected ? '700' : '600' }]}>
                                {item.label}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Pressable
          style={[styles.confirmButton, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}           // Ngăn click khi đang loading
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.confirmButtonText}>
              Add {type === 'expense' ? 'Expense' : 'Income'}
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}
