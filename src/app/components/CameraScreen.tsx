import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { categoryGroups } from '../../../constants/categories';
import { useColors } from '../../context/ThemeContext';

// ---- Category data (stable constants outside component) ----
type CategoryItem = { id: number; label: string; icon: string; color: string };
const basicCategories: CategoryItem[] = [
  { id: 1, label: 'Dining', icon: 'restaurant-outline', color: '#f59e0b' },
  { id: 2, label: 'Shopping', icon: 'bag-handle-outline', color: '#ec4899' },
  { id: 3, label: 'Transport', icon: 'car-outline', color: '#3b82f6' },
];
const moreCategories = categoryGroups.map((group) => ({
  groupId: group.id,
  title: group.title,
  color: group.color,
  bgColor: group.bgColor,
  categories: group.categories.map((item) => ({
    id: item.id, label: item.label, icon: item.icon, color: item.color,
  })),
}));
const moreCategoryItemsConst = moreCategories.flatMap((g) => g.categories);
// ------------------------------------------------------------

export function CameraScreen({ userAvatar }: { userAvatar?: string | null }) {
  const colors = useColors();
  const [showForm, setShowForm] = useState(false);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const [amount, setAmount] = useState('');
  const [amountDisplay, setAmountDisplay] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  const handleAmountChange = (text: string) => {
    // Strip everything except digits
    const digits = text.replace(/[^0-9]/g, '');
    setAmount(digits);
    // Format with thousand separators
    if (digits === '') {
      setAmountDisplay('');
    } else {
      setAmountDisplay(Number(digits).toLocaleString('en-US'));
    }
  };

  const quickCategories = useMemo(() => {
    const all = [...basicCategories, ...moreCategoryItemsConst.filter((i) => !basicCategories.some((b) => b.label === i.label))];
    const selected = all.find((i) => i.label === category) ?? basicCategories[0];
    const rest = basicCategories.filter((i) => i.label !== selected.label);
    return [selected, ...rest].slice(0, 3);
  }, [category]);
  const selectedMoreCategory = useMemo(() => moreCategoryItemsConst.find((i) => i.label === category), [category]);

  const [showCalendar, setShowCalendar] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(dayjs().startOf('month'));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const formatDateLabel = (d: Date) => {
    const today = dayjs();
    const target = dayjs(d);
    if (today.isSame(target, 'day')) return 'Today';
    return target.format('MMM D');
  };

  const handleCapture = () => {
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setIsCaptured(true);
  };

  if (isCaptured) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.iconButton} />
          <View style={styles.avatarWrap}>
            {userAvatar ? (
              <Image source={{ uri: userAvatar }} style={{ width: '100%', height: '100%' }} />
            ) : (
              <Ionicons name="person" size={24} color="#fff" />
            )}
          </View>
        </View>

        {/* Captured image inside viewfinder frame */}
        <View style={styles.viewfinder}>
          <Image
            source={require('../../../assets/images/receipt_placeholder.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          {note ? (
            <View style={styles.notePill}>
              <Text style={styles.noteText}>{note}</Text>
            </View>
          ) : null}
        </View>

        {/* Post-capture info & actions */}
        <View style={styles.capturedInfoArea}>

          {/* Transaction summary */}
          <View style={styles.capturedSummaryRow}>
            <View style={styles.capturedSummaryItem}>
              <Text style={styles.capturedSummaryLabel}>Amount</Text>
              <Text style={styles.capturedSummaryValue}>
                {amountDisplay ? `${amountDisplay} ₫` : '—'}
              </Text>
            </View>
            <View style={[styles.capturedSummaryItem, { alignItems: 'center' }]}>
              <Text style={styles.capturedSummaryLabel}>Category</Text>
              <Text style={styles.capturedSummaryValue} numberOfLines={1}>
                {category || '—'}
              </Text>
            </View>
            <View style={[styles.capturedSummaryItem, { alignItems: 'flex-end' }]}>
              <Text style={styles.capturedSummaryLabel}>Date</Text>
              <Text style={styles.capturedSummaryValue}>{date || '—'}</Text>
            </View>
          </View>

          {/* Action row: grid + save */}
          <View style={styles.capturedActionRow}>
            <Pressable style={styles.capturedGridButton} onPress={() => setShowGallery(true)}>
              <Ionicons name="grid" size={24} color="#ffffff" />
            </Pressable>

            <Pressable style={styles.savePhotoButton} onPress={() => { }}>
              <Ionicons name="download-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.savePhotoText}>Save Photo</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Pressable style={styles.iconButton}>
          <Ionicons name="megaphone" size={20} color="#ffffff" />
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        </Pressable>
        <View style={styles.avatarWrap}>
          {userAvatar ? (
            <Image source={{ uri: userAvatar }} style={{ width: '100%', height: '100%' }} />
          ) : (
            <Ionicons name="person" size={24} color="#fff" />
          )}
        </View>
      </View>

      {/* Camera Viewfinder */}
      <View style={styles.viewfinder}>
        <Pressable style={styles.flashButton}>
          <Ionicons name="flash" size={18} color="#ffffff" />
        </Pressable>
        <View style={styles.zoomPill}>
          <Text style={styles.zoomText}>1x</Text>
        </View>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <View style={styles.controlsRow}>
          <Pressable style={styles.galleryButton} onPress={() => setShowGallery(true)}>
            <Image source={require('../../../assets/images/receipt_placeholder.png')} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
          </Pressable>

          <Pressable style={styles.captureButtonOuter} onPress={handleCapture}>
            <View style={styles.captureButtonInner} />
          </Pressable>

          <Pressable style={styles.flipButton}>
            <Ionicons name="sync-outline" size={32} color="#ffffff" />
          </Pressable>
        </View>

        <Pressable style={styles.historyDropdown}>
          <View style={styles.historyThumb}>
            <Image source={require('../../../assets/images/receipt_placeholder.png')} style={{ width: '100%', height: '100%', borderRadius: 12 }} />
          </View>
          <Text style={styles.historyText}>History</Text>
          <Ionicons name="chevron-down" size={16} color="#ffffff" />
        </Pressable>
      </View>

      {/* Gallery Modal */}
      <Modal visible={showGallery} animationType="slide">
        <SafeAreaView style={styles.galleryScreen}>

          {/* TOP BAR */}
          <View style={styles.galleryTopBar}>
            <Pressable style={styles.galleryTopIcon}>
              <Ionicons name="megaphone-outline" size={20} color="#fff" />
            </Pressable>

            <View style={styles.everyonePill}>
              <Text style={styles.everyoneText}>Everyone</Text>
              <Ionicons name="chevron-down" size={16} color="#fff" />
            </View>

            <View style={styles.galleryAvatar}>
              {userAvatar ? (
                <Image
                  source={{ uri: userAvatar }}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <Ionicons name="person" size={22} color="#fff" />
              )}
            </View>
          </View>

          {/* GALLERY GRID */}
          <FlatList
            data={[...Array(18)]}
            keyExtractor={(_, index) => index.toString()}
            numColumns={3}
            contentContainerStyle={styles.galleryList}
            renderItem={({ index }) => (
              <View style={styles.galleryCard}>
                <Image
                  source={{
                    uri: `https://picsum.photos/300/300?random=${index}`,
                  }}
                  style={styles.galleryPhoto}
                />
              </View>
            )}
          />

          {/* BOTTOM BAR */}
          <View style={styles.galleryBottomFloating}>

            <Pressable style={styles.bottomMiniButton}>
              <Ionicons name="grid" size={22} color="#fff" />
            </Pressable>

            <Pressable style={styles.cameraMainButton}>
              <View style={styles.cameraInner} />
            </Pressable>

            <Pressable style={styles.bottomMiniButton}>
              <Ionicons name="chatbubble-outline" size={22} color="#fff" />
            </Pressable>

            <Pressable style={styles.bottomMiniButton}>
              <Ionicons name="play-outline" size={24} color="#fff" />
            </Pressable>
          </View>

        </SafeAreaView>
      </Modal>

      {/* Add Details Form Modal */}
      <Modal visible={showForm} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Add Details</Text>
              <Pressable onPress={() => setShowForm(false)} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="number-pad"
                  value={amountDisplay}
                  onChangeText={handleAmountChange}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Category</Text>
                {/* Quick grid — same as AddExpenseScreen */}
                <View style={styles.quickGrid}>
                  {quickCategories.map((item) => {
                    const isSelected = category === item.label;
                    return (
                      <Pressable key={item.id} style={styles.quickItem} onPress={() => setCategory(item.label)}>
                        <View style={[styles.quickIconWrap, { borderColor: colors.border, backgroundColor: colors.inputBg }, isSelected && styles.quickIconWrapActive]}>
                          <Ionicons name={item.icon as any} size={28} color={item.color} />
                        </View>
                        <Text numberOfLines={1} style={[styles.quickLabel, { color: colors.textMuted }, isSelected && styles.quickLabelActive]}>{item.label}</Text>
                      </Pressable>
                    );
                  })}
                  <Pressable style={styles.quickItem} onPress={() => setShowAllCategories(true)}>
                    <View style={[styles.quickIconWrap, { borderColor: colors.border, backgroundColor: colors.inputBg }]}>
                      <Ionicons name="grid-outline" size={28} color="#ec4899" />
                    </View>
                    <Text style={[styles.moreButtonLabel, { color: colors.text }]}>More</Text>
                  </Pressable>
                </View>

                {/* Inline all-categories panel */}
                {showAllCategories && (
                  <View style={[styles.inlinePanel, { borderColor: colors.border }]}>
                    <Pressable style={styles.inlinePanelHeader} onPress={() => setShowAllCategories(false)}>
                      <Text style={[styles.inlinePanelTitle, { color: colors.text }]}>All Categories</Text>
                      <Ionicons name="chevron-up" size={18} color={colors.textMuted} />
                    </Pressable>
                    <View style={styles.categoryContainer}>
                      {moreCategories.map((group) => (
                        <View key={group.groupId} style={styles.groupCard}>
                          <View style={[styles.groupHeader, { backgroundColor: group.bgColor }]}>
                            <Text style={[styles.groupTitle, { color: group.color }]}>{group.title}</Text>
                          </View>
                          <View style={styles.categoryGrid}>
                            {group.categories.map((item) => {
                              const isSelected = category === item.label;
                              return (
                                <Pressable key={item.id} style={styles.categoryItemGrid}
                                  onPress={() => { setCategory(item.label); setShowAllCategories(false); }}
                                >
                                  <View style={[styles.categoryItemIcon, { backgroundColor: isSelected ? `${item.color}18` : colors.inputBg, borderWidth: 1, borderColor: item.color }]}>
                                    <Ionicons name={item.icon as any} size={26} color={item.color} />
                                  </View>
                                  <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.categoryItemLabel, { color: item.color, fontWeight: isSelected ? '700' : '600' }]}>{item.label}</Text>
                                </Pressable>
                              );
                            })}
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Date</Text>
                <Pressable
                  style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
                  onPress={() => setShowCalendar((v) => !v)}
                >
                  <Text style={{ color: date ? colors.text : colors.textMuted, fontSize: 16 }}>
                    {date || 'Select Date'}
                  </Text>
                  <Ionicons name={showCalendar ? 'chevron-up' : 'calendar-outline'} size={18} color={colors.textMuted} />
                </Pressable>

                {/* Inline calendar */}
                {showCalendar && (
                  <View style={[styles.inlineCalendar, { borderColor: colors.border, backgroundColor: colors.inputBg }]}>
                    <View style={styles.calendarHeader}>
                      <Pressable onPress={() => setCalendarMonth((m) => m.subtract(1, 'month'))}>
                        <Ionicons name="chevron-back" size={22} color="#1C4D8D" />
                      </Pressable>
                      <Text style={[styles.monthText, { color: colors.text }]}>{calendarMonth.format('MMMM YYYY')}</Text>
                      <Pressable onPress={() => setCalendarMonth((m) => m.add(1, 'month'))}>
                        <Ionicons name="chevron-forward" size={22} color="#1C4D8D" />
                      </Pressable>
                    </View>
                    <View style={styles.weekRow}>
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((w) => (
                        <Text key={w} style={[styles.weekDay, { color: colors.textMuted }]}>{w}</Text>
                      ))}
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {(() => {
                        const startDay = calendarMonth.startOf('month').day();
                        const daysInMonth = calendarMonth.daysInMonth();
                        const blanks = Array.from({ length: startDay }).map((_, i) => (
                          <View key={`b${i}`} style={styles.dayCell} />
                        ));
                        const days = Array.from({ length: daysInMonth }).map((_, i) => {
                          const dayNum = i + 1;
                          const currentDay = calendarMonth.date(dayNum);
                          const isSelected = dayjs(selectedDate).isSame(currentDay, 'day');
                          return (
                            <Pressable key={dayNum} style={[styles.dayCell, isSelected && styles.dayCellSelected]}
                              onPress={() => {
                                const d = currentDay.toDate();
                                setSelectedDate(d);
                                setDate(formatDateLabel(d));
                                setShowCalendar(false);
                              }}
                            >
                              <Text style={[styles.dayCellText, { color: isSelected ? '#fff' : colors.text }]}>{dayNum}</Text>
                            </Pressable>
                          );
                        });
                        return [...blanks, ...days];
                      })()}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                      <Pressable onPress={() => { const t = new Date(); setSelectedDate(t); setDate(formatDateLabel(t)); setShowCalendar(false); }}>
                        <Text style={{ color: '#1C4D8D', fontWeight: '700', padding: 8 }}>Today</Text>
                      </Pressable>
                      <Pressable onPress={() => setShowCalendar(false)}>
                        <Text style={{ color: colors.textMuted, padding: 8 }}>Cancel</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Note</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                  placeholder="Add a note..."
                  placeholderTextColor={colors.textMuted}
                  value={note}
                  onChangeText={setNote}
                />
              </View>

              <Pressable style={styles.modalSaveButton} onPress={handleSave}>
                <Text style={styles.modalSaveText}>Save</Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  newBadge: {
    position: 'absolute',
    top: -4,
    left: 4,
    backgroundColor: '#fbbf24',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#000000',
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  viewfinder: {
    flex: 1,
    backgroundColor: '#381617', // Dark red tone from screenshot
    marginHorizontal: 16,
    borderRadius: 40,
    position: 'relative',
    overflow: 'hidden',
  },
  flashButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomPill: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  bottomControls: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  galleryButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  captureButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fbbf24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
  },
  flipButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  historyThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginRight: 8,
  },
  historyText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginRight: 4,
  },
  // Post-Capture View Styles
  capturedOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    // Gradient-like fade at the bottom
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingTop: 24,
  },
  capturedImageContainer: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
  },
  notePill: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  noteText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  capturedInfoArea: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
  },
  capturedSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  capturedSummaryItem: {
    flex: 1,
    alignItems: 'flex-start',
  },
  capturedSummaryLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  capturedSummaryValue: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '700',
  },
  capturedActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  capturedGridButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savePhotoButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#1C4D8D',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savePhotoText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  capturedDetails: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  capturedDateText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  activityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  activityText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginRight: 12,
  },
  activityAvatars: {
    flexDirection: 'row',
  },
  activityAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000000',
  },
  capturedBottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    width: '100%',
  },
  chatBadge: {
    position: 'absolute',
    top: -8,
    right: -10,
    backgroundColor: '#fbbf24',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  chatBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000000',
  },

  // Modal Form Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalCloseButton: {
    padding: 4,
  },
  formScroll: {
    // scrollview styles
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
  },
  // Quick grid category styles (AddExpenseScreen pattern)
  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  quickIconWrapActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  quickLabel: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
  quickLabelActive: {
    color: '#1C4D8D',
  },
  moreButtonLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  // Inline expand panels
  inlinePanel: {
    borderWidth: 1,
    borderRadius: 14,
    marginTop: 12,
    overflow: 'hidden',
  },
  inlinePanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  inlinePanelTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  // Inline calendar
  inlineCalendar: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthText: {
    fontSize: 15,
    fontWeight: '700',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
  },
  weekDay: {
    width: 36,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
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
    fontWeight: '600',
    fontSize: 14,
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
  categoryItemGrid: {
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
  modalSaveButton: {
    backgroundColor: '#fbbf24',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  modalSaveText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800',
  },
  // Gallery Styles
  galleryModalContainer: {
    flex: 1,
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  galleryTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  galleryCloseButton: {
    padding: 5,
  },
  galleryGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
  },
  galleryItem: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 2,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  galleryBottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderTopWidth: 0.5,
    borderTopColor: '#333',
    backgroundColor: '#000',
  },
  galleryCaptureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryCaptureIconInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
  },
  galleryScreen: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },

  galleryTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 16,
  },

  galleryTopIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  everyonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 30,
  },

  everyoneText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 6,
  },

  galleryAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
    backgroundColor: '#222',
  },

  galleryList: {
    paddingHorizontal: 4,
    paddingBottom: 120,
  },

  galleryCard: {
    flex: 1,
    height: Math.random() * 80 + 180,
    padding: 4,
  },

  galleryPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },

  galleryBottomFloating: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    height: 74,

    backgroundColor: 'rgba(40,40,40,0.95)',
    borderRadius: 40,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',

    paddingHorizontal: 18,
  },

  bottomMiniButton: {
    width: 42,
    alignItems: 'center',
  },

  cameraMainButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: '#fbbf24',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
  },

  cameraInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
  },
});
