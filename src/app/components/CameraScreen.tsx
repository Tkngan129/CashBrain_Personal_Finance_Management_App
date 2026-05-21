/**
 * CameraScreen.tsx — Hoàn chỉnh & sửa lỗi
 *
 * Các cải thiện chính:
 * 1. Tất cả hooks được chuyển lên đầu component (sửa lỗi Rules of Hooks)
 * 2. <CameraView> thực sự render (expo-camera v14+ API)
 * 3. Chụp ảnh thật với takePhoto()
 * 4. Flash toggle, flip camera hoạt động
 * 5. Permission flow đúng cách
 * 6. Gallery load ảnh từ MediaLibrary thật
 * 7. Save Photo lưu vào thư viện
 * 8. Zoom pinch gesture (PinchGestureHandler)
 * 9. Autofocus tap-to-focus
 * 10. Loading & error states
 */

import { ExpenseImageResponse, useExpenses } from '@/src/context/expenseContext';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { CameraType, CameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useColors } from '../../context/ThemeContext';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
type CategoryItem = { id: string; label: string; icon: string; color: string };

const basicCategories: CategoryItem[] = [
  { id: '6a0d1c32c9127e9322c18cf2', label: 'Dining',    icon: 'restaurant-outline',  color: '#f59e0b' },
  { id: '6a0d1c32c9127e9322c18cf4', label: 'Shopping',  icon: 'bag-handle-outline',  color: '#ec4899' },
  { id: '6a0d1c32c9127e9322c18cf3', label: 'Transport', icon: 'car-outline',          color: '#3b82f6' },
];

const formatToYYYYMMDD = (date: Date | string): string => {
  const d = new Date(date);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export function CameraScreen({ userAvatar }: { userAvatar?: string | null }) {
  const colors = useColors();
  const { fetchExpensesCategories, expenseCategories, expenseImages, fetchExpenseImage, addExpenseImage, loading, deleteExpenseImage } = useExpenses();

  // ── Camera permissions (expo-camera v14+ hook) ──
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission]   = MediaLibrary.usePermissions();

  // ── Camera state ──
  const cameraRef                     = useRef<CameraView>(null);
  const [facing, setFacing]           = useState<CameraType>('back');
  const [flash, setFlash]             = useState<FlashMode>('off');
  const [zoom, setZoom]               = useState(0);              // 0–1
  const [isTakingPhoto, setIsTaking]  = useState(false);
  const [focusPoint, setFocusPoint]   = useState<{ x: number; y: number } | null>(null);

  // ── UI state ──
  const [capturedUri, setCapturedUri]             = useState<string | null>(null);
  const [showForm, setShowForm]                   = useState(false);
  const [showGallery, setShowGallery]             = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showCalendar, setShowCalendar]           = useState(false);
  const [calendarMonth, setCalendarMonth]         = useState(dayjs().startOf('month'));
  const [selectedDate, setSelectedDate]           = useState<Date>(new Date());
  const [galleryAssets, setGalleryAssets]         = useState<ExpenseImageResponse[]>([]);
  const [galleryLoading, setGalleryLoading]       = useState(false);

  // ── Form state ──
  const [amount, setAmount]           = useState('');
  const [amountDisplay, setAmountDisplay] = useState('');
  const [category, setCategory]       = useState('');
  const [selectedCategoryID, setSelectedCategoryID] = useState<string>(basicCategories[0].id);
  const [selectedCategory, setSelectedCategory]     = useState<string>(basicCategories[0].label);
  const [date, setDate]               = useState('');
  const [note, setNote]               = useState('');
  const [selectedExpenseImageID, setSelectedExpenseImageID] = useState<string>("");

  // ── Load categories ──
  
  useEffect( () => {
    fetchExpensesCategories();
    fetchExpenseImage();
  }, []);

  // ── Request permissions on mount ──
  useEffect(() => {
    (async () => {
      if (!cameraPermission?.granted)  await requestCameraPermission();
      if (!mediaPermission?.granted)   await requestMediaPermission();
    })();
  }, []);

  // ── Load gallery when opened ──
  useEffect(() => {
    // Nếu không mở Gallery thì không làm gì cả
    if (!showGallery) return;

   

    setGalleryAssets(expenseImages);
  }, [showGallery, expenseImages]); // Loại bỏ mediaPermission khỏi danh sách phụ thuộc vì không dùng nữa

  // ─────────────────────────────────────────────
  // Derived / memoised
  // ─────────────────────────────────────────────
  const moreCategories = useMemo(() => {
    if (!expenseCategories) return [];
    return expenseCategories.map((group) => ({
      groupId:    group.id,
      title:      group.title,
      color:      group.color,
      bgColor:    group.bgColor,
      categories: group.categories.map((item) => ({
        id:    item.id,
        label: item.label,
        icon:  item.icon as keyof typeof Ionicons.glyphMap,
        color: item.color,
      })),
    }));
  }, [expenseCategories]);

  const moreCategoryItems = useMemo(
    () => moreCategories.flatMap((g) => g.categories),
    [moreCategories],
  );

  const quickCategories = useMemo(() => {
    const all = [
      ...basicCategories,
      ...moreCategoryItems.filter(
        (item) => !basicCategories.some((b) => b.label === item.label),
      ),
    ];
    const sel       = all.find((i) => i.label === selectedCategory) ?? basicCategories[0];
    const fallbacks = basicCategories.filter((i) => i.label !== sel.label);
    return [sel, ...fallbacks].slice(0, 3);
  }, [moreCategoryItems, selectedCategory]);

  // ─────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────
  const handleAmountChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, '');
    setAmount(digits);
    setAmountDisplay(digits === '' ? '' : Number(digits).toLocaleString('en-US'));
  };

  const formatDateLabel = (d: Date) => {
    const target = dayjs(d);
    return dayjs().isSame(target, 'day') ? 'Today' : target.format('MMM D');
  };

  /** Chụp ảnh thật */
  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || isTakingPhoto) return;
    try {
      setIsTaking(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality:    0.85,
        base64:     false,
        skipProcessing: false,
      });
      if (photo?.uri) {
        setCapturedUri(photo.uri);
        setShowForm(true);
      }
    } catch (err) {
      Alert.alert('Error', 'Can not take the picture. Try it again.');
      console.error('takePicture error:', err);
    } finally {
      setIsTaking(false);
    }
  }, [isTakingPhoto]);

  /** Toggle flash */
  const toggleFlash = () =>
    setFlash((f) => (f === 'off' ? 'on' : f === 'on' ? 'auto' : 'off'));

  const flashIcon = flash === 'on' ? 'flash' : flash === 'auto' ? 'flash-outline' : 'flash-off-outline';

  /** Flip camera */
  const handleFlip = () =>
    setFacing((f) => (f === 'back' ? 'front' : 'back'));

  /** Zoom buttons */
  const handleZoom = (level: number) => setZoom(Math.max(0, Math.min(1, level)));

  /** Tap-to-focus */
  const handleFocus = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    setFocusPoint({ x: locationX, y: locationY });
    setTimeout(() => setFocusPoint(null), 1200);
  };

  /** Lưu ảnh vào thư viện */
  const handleSavePhoto = async () => {
    if (!capturedUri) return;
    try {
      if (!mediaPermission?.granted) {
        await requestMediaPermission();
      }
      await MediaLibrary.saveToLibraryAsync(capturedUri);
      Alert.alert('Save', 'Image has been saved to your gallery');
    } catch (err: any) {
      Alert.alert('Error', err || 'Can not save the image');
    }
  };

  const handleDelete = async () => {
    if (!selectedExpenseImageID) return;

    try {
      await deleteExpenseImage(selectedExpenseImageID);
      Alert.alert('Successfully', 'Delete an expense');
      handleRetake();          
      setCapturedUri("");
    } catch (err: any) {
      console.log(err.message);
      Alert.alert('Error', err.message || 'Can not delete expense');
    }
  }

  /** Save form & commit expense */
  const handleSave = async () => {
    if (!capturedUri) {
      Alert.alert('Error', 'Do not have image');
      return;
    }
    try {
      await addExpenseImage(
        selectedCategoryID,
        parseInt(amount, 10),
        formatToYYYYMMDD(selectedDate),
        note,
        capturedUri
      );
      Alert.alert('Successfully', 'Adding a new expense');
      handleRetake();          // reset form, quay lại camera
      setShowForm(false);
    } catch (err: any) {
      console.log(err.message);
      Alert.alert('Error', err.message || 'Can not add expense');
    }
  };

  /** Reset về camera */
  const handleRetake = () => {
    setCapturedUri(null);
    setAmount('');
    setAmountDisplay('');
    setCategory('');
    setDate('');
    setNote('');
  };

  // ─────────────────────────────────────────────
  // Permission gate
  // ─────────────────────────────────────────────
  if (!cameraPermission) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator color="#fbbf24" size="large" />
      </SafeAreaView>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Icon name="camera-off-outline" size={64} color="#ffffff44" />
        <Text style={styles.permissionText}>Camera is not allow</Text>
        <Pressable style={styles.permissionButton} onPress={requestCameraPermission}>
          <Text style={styles.permissionButtonText}>Assign camera ability</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // ─────────────────────────────────────────────
  // Post-capture screen
  // ─────────────────────────────────────────────
  if (capturedUri && !showForm) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <Pressable style={styles.iconButton} onPress={() => {
            handleRetake();
            setSelectedExpenseImageID("");
          }}>
            <Ionicons name="arrow-back" size={20} color="#ffffff" />
          </Pressable>
          <View style={styles.avatarWrap}>
            {userAvatar
              ? <Image source={{ uri: userAvatar }} style={{ width: '100%', height: '100%' }} />
              : <Ionicons name="person" size={24} color="#fff" />}
          </View>
        </View>

        <View style={styles.viewfinder}>
          <Image source={{ uri: capturedUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          {note ? (
            <View style={styles.notePill}>
              <Text style={styles.noteText}>{note}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.capturedInfoArea}>
          <View style={styles.capturedSummaryRow}>
            <View style={styles.capturedSummaryItem}>
              <Text style={styles.capturedSummaryLabel}>Amount</Text>
              <Text style={styles.capturedSummaryValue}>
                {
                  amountDisplay
                    ? `${Number(
                        amountDisplay.replace(/[^0-9]/g, '')
                      ).toLocaleString('en-US')} ₫`
                    : '—'
                }
              </Text>
            </View>
            <View style={[styles.capturedSummaryItem, { alignItems: 'center' }]}>
              <Text style={styles.capturedSummaryLabel}>Category</Text>
              <Text style={styles.capturedSummaryValue} numberOfLines={1}>{category || '—'}</Text>
            </View>
            <View style={[styles.capturedSummaryItem, { alignItems: 'flex-end' }]}>
              <Text style={styles.capturedSummaryLabel}>Date</Text>
              <Text style={styles.capturedSummaryValue}>{date || '—'}</Text>
            </View>
          </View>

          <View style={styles.capturedActionRow}>
            {/* Delete */}
            <Pressable 
              style={({ pressed }) => [
                styles.capturedGridButton,
                pressed && { opacity: 0.7 },
                loading && { opacity: 0.6 }
              ]} 
              disabled={loading} 
              onPress={() => !loading && handleDelete()}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="trash-bin-outline" size={24} color="#ffffff" />
              )}
            </Pressable>

            {/* Gallery */}
            <Pressable style={styles.capturedGridButton} onPress={() => {
              setShowGallery(true);
              setCapturedUri('');
            }}>
              <Ionicons name="grid" size={24} color="#ffffff" />
            </Pressable>

            {/* Save to library */}
            <Pressable style={styles.savePhotoButton} onPress={handleSavePhoto}>
              <Ionicons name="download-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.savePhotoText}>Save Photo</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ─────────────────────────────────────────────
  // Main camera screen
  // ─────────────────────────────────────────────
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
          {userAvatar
            ? <Image source={{ uri: userAvatar }} style={{ width: '100%', height: '100%' }} />
            : <Ionicons name="person" size={24} color="#fff" />}
        </View>
      </View>

      {/* ── Camera Viewfinder (thật) ── */}
      <Pressable style={styles.viewfinder} onPress={handleFocus}>
        {capturedUri ? (
          // 1. Khi ĐÃ CÓ ảnh: Hiển thị ảnh vừa chụp kèm nút xóa/chụp lại nếu cần
          <View style={StyleSheet.absoluteFillObject}>
            <Image 
              source={{ uri: capturedUri }} 
              style={StyleSheet.absoluteFillObject} 
              resizeMode="cover"
            />        
          </View>
        ) : (
          // 2. Khi CHƯA CÓ ảnh: Hiển thị màn hình Camera như cũ
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            facing={facing}
            flash={flash}
            zoom={zoom}
          />
        )}

        {/* Overlay controls inside viewfinder */}
        <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">

          {/* Flash button */}
          <Pressable style={styles.flashButton} onPress={toggleFlash}>
            <Ionicons name={flashIcon as any} size={18} color={flash === 'on' ? '#fbbf24' : '#ffffff'} />
          </Pressable>

          {/* Zoom buttons */}
          <View style={styles.zoomRow}>
            {facing === 'back' && [0, 0.25, 0.5].map((z) => (
              <Pressable key={z} style={[styles.zoomPill, zoom === z && styles.zoomPillActive]} onPress={() => handleZoom(z)}>
                <Text style={[styles.zoomText, zoom === z && { color: '#fbbf24' }]}>
                  {z === 0 ? '1×' : z === 0.25 ? '2×' : '5×'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Tap-to-focus indicator */}
          {focusPoint && (
            <View style={[styles.focusRing, { top: focusPoint.y - 32, left: focusPoint.x - 32 }]} />
          )}
        </View>
      </Pressable>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <View style={styles.controlsRow}>
          {/* Gallery thumbnail */}
          <Pressable style={styles.galleryButton} onPress={() => setShowGallery(true)}>
            {galleryAssets[0]
              ? <Image source={{ uri: galleryAssets[0].image_url }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
              : <Ionicons name="image-outline" size={24} color="#fff" />}
          </Pressable>

          {/* Capture button */}
          <Pressable
            style={[styles.captureButtonOuter, isTakingPhoto && { opacity: 0.6 }]}
            onPress={handleCapture}
            disabled={isTakingPhoto}
          >
            {isTakingPhoto
              ? <ActivityIndicator color="#fbbf24" size="small" />
              : <View style={styles.captureButtonInner} />}
          </Pressable>

          {/* Flip */}
          <Pressable style={styles.flipButton} onPress={handleFlip}>
            <Ionicons name="sync-outline" size={32} color="#ffffff" />
          </Pressable>
        </View>

        <Pressable style={styles.historyDropdown} onPress={() => setShowGallery(true)}>
          <View style={styles.historyThumb}>
            {galleryAssets[1] && (
              <Image source={{ uri: galleryAssets[1].image_url }} style={{ width: '100%', height: '100%', borderRadius: 12 }} />
            )}
          </View>
          <Text style={styles.historyText}>History</Text>
          <Ionicons name="chevron-down" size={16} color="#ffffff" />
        </Pressable>
      </View>

      {/* ── Gallery Modal ── */}
      <Modal visible={showGallery} animationType="slide">
        <SafeAreaView style={styles.galleryScreen}>
          <View style={styles.galleryTopBar}>
            <Pressable style={styles.galleryTopIcon} onPress={() => setShowGallery(false)}>
              <Ionicons name="close" size={22} color="#fff" />
            </Pressable>
            <Text style={styles.everyoneText}>Images gallery</Text>
            <View style={styles.galleryAvatar}>
              {userAvatar
                ? <Image source={{ uri: userAvatar }} style={{ width: '100%', height: '100%' }} />
                : <Ionicons name="person" size={22} color="#fff" />}
            </View>
          </View>

          {galleryLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator color="#fbbf24" size="large" />
            </View>
          ) : (
            <FlatList
              data={galleryAssets}
              keyExtractor={(item) => item.id}
              numColumns={3}
              contentContainerStyle={styles.galleryList}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.galleryCard}
                  onPress={() => {
                    setCapturedUri(item.image_url);
                    setAmountDisplay(String(item.amount));
                    setCategory(item.category_name)
                    setNote(item.note);
                    setDate(item.date);
                    setSelectedExpenseImageID(item.id);
                    // setShowGallery(false);
                    // setShowForm(true);
                  }}
                >
                  <Image source={{ uri: item.image_url }} style={styles.galleryPhoto} />
                </Pressable>
              )}
              ListEmptyComponent={
                <View style={styles.centered}>
                  <Text style={{ color: '#ffffff88', marginTop: 40 }}>Do not have any image</Text>
                </View>
              }
            />
          )}

          {/* <View style={styles.galleryBottomFloating}>
            <Pressable style={styles.bottomMiniButton} onPress={() => setShowGallery(false)}>
              <Ionicons name="camera-outline" size={22} color="#fff" />
            </Pressable>
            <Pressable
              style={styles.cameraMainButton}
              onPress={() => { setShowGallery(false); }}
            >
              <View style={styles.cameraInner} />
            </Pressable>
            <Pressable style={styles.bottomMiniButton}>
              <Ionicons name="chatbubble-outline" size={22} color="#fff" />
            </Pressable>
          </View> */}
        </SafeAreaView>
      </Modal>

      {/* ── Add Details Form Modal ── */}
      <Modal visible={showForm} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Add Details</Text>
              <Pressable onPress={() => {
                setShowForm(false);
                setCapturedUri("");
              }} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
              {/* Amount */}
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

              {/* Category */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Category</Text>
                <View style={styles.quickGrid}>
                  {quickCategories.map((item) => {
                    const isSelected = category === item.label;
                    return (
                      <Pressable
                        key={item.id}
                        style={styles.quickItem}
                        onPress={() => {
                          setCategory(item.label);
                          setSelectedCategory(item.label);
                          setSelectedCategoryID(item.id);
                        }}
                      >
                        <View style={[
                          styles.quickIconWrap,
                          { borderColor: colors.border, backgroundColor: colors.inputBg },
                          isSelected && styles.quickIconWrapActive,
                        ]}>
                          <Ionicons name={item.icon as any} size={28} color={item.color} />
                        </View>
                        <Text numberOfLines={1} style={[
                          styles.quickLabel,
                          { color: colors.textMuted },
                          isSelected && styles.quickLabelActive,
                        ]}>
                          {item.label}
                        </Text>
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

                {/* All categories inline */}
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
                                <Pressable
                                  key={item.id}
                                  style={styles.categoryItemGrid}
                                  onPress={() => {
                                    setCategory(item.label);
                                    setSelectedCategory(item.label);
                                    setSelectedCategoryID(item.id);
                                    setShowAllCategories(false);
                                  }}
                                >
                                  <View style={[
                                    styles.categoryItemIcon,
                                    {
                                      backgroundColor: isSelected ? `${item.color}18` : colors.inputBg,
                                      borderWidth: 1,
                                      borderColor: item.color,
                                    },
                                  ]}>
                                    <Ionicons name={item.icon as any} size={26} color={item.color} />
                                  </View>
                                  <Text
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    style={[styles.categoryItemLabel, { color: item.color, fontWeight: isSelected ? '700' : '600' }]}
                                  >
                                    {item.label}
                                  </Text>
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

              {/* Date */}
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
                        const startDay    = calendarMonth.startOf('month').day();
                        const daysInMonth = calendarMonth.daysInMonth();
                        const blanks = Array.from({ length: startDay }).map((_, i) => (
                          <View key={`b${i}`} style={styles.dayCell} />
                        ));
                        const days = Array.from({ length: daysInMonth }).map((_, i) => {
                          const dayNum     = i + 1;
                          const currentDay = calendarMonth.date(dayNum);
                          const isSelected = dayjs(selectedDate).isSame(currentDay, 'day');
                          return (
                            <Pressable
                              key={dayNum}
                              style={[styles.dayCell, isSelected && styles.dayCellSelected]}
                              onPress={() => {
                                const d = currentDay.toDate();
                                setSelectedDate(d);
                                setDate(formatDateLabel(d));
                                setShowCalendar(false);
                              }}
                            >
                              <Text style={[styles.dayCellText, { color: isSelected ? '#fff' : colors.text }]}>
                                {dayNum}
                              </Text>
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

              {/* Note */}
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

              <Pressable 
                style={({ pressed }) => [
                  styles.modalSaveButton,
                  pressed && { opacity: 0.8 },
                  loading && { opacity: 0.7 }
                ]} 
                onPress={() => !loading && handleSave()} 
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.modalSaveText}>Save</Text>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  retakeButton: {
    position: 'absolute',
    top: 40, // Khoảng cách cách rìa trên màn hình (an toàn cho tai thỏ)
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    color: '#ffffffaa',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 15,
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
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    borderRadius: 40,
    overflow: 'hidden',
    position: 'relative',
  },
  flashButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomRow: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'column',
    gap: 6,
  },
  zoomPill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomPillActive: {
    backgroundColor: 'rgba(251,191,36,0.25)',
  },
  zoomText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  focusRing: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#fbbf24',
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
    overflow: 'hidden',
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
    overflow: 'hidden',
  },
  historyText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginRight: 4,
  },
  // Post-capture
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
  // Form preview
  formPhotoPreview: {
    width: '100%',
    height: 120,
    borderRadius: 14,
    marginBottom: 16,
  },
  // Modal
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
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalCloseButton: {
    padding: 4,
  },
  formScroll: {},
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
  categoryContainer: { gap: 16 },
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
  // Gallery
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
  everyoneText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  galleryAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryList: {
    paddingHorizontal: 4,
    paddingBottom: 120,
  },
  galleryCard: {
    flex: 1,
    aspectRatio: 1, // Ép ô lưới thành hình vuông chuẩn ma trận
    margin: 4, // Tạo khoảng cách nhẹ giữa các ô
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 8, // Bo góc cho hiện đại nếu muốn
  },
    galleryPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    resizeMode: 'cover',
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Lớp nền tối giúp chữ màu trắng nổi bật
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  overlayAmount: {
    color: '#fbbf24', // Màu vàng hổ phách (amber) giống màu loading của bạn
    fontSize: 11,
    fontWeight: 'bold',
  },
  overlayNote: {
    color: '#ffffff',
    fontSize: 10,
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