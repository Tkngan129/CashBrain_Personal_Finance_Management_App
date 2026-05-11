import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useColors } from '../../context/ThemeContext';

export interface Category {
  id: number;
  label: string;
  icon: string;
  color: string;
}

interface EditCategoryScreenProps {
  category: Category;
  onCancel: () => void;
  onSave: (updatedCategory: Category) => void;
}

export function EditCategoryScreen({ category, onCancel, onSave }: EditCategoryScreenProps) {
  const colors = useColors();
  const [name, setName] = useState(category.label);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={onCancel} style={styles.headerButton}>
          <Text style={[styles.headerButtonText, { color: colors.textMuted }]}>Cancel</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Category</Text>
        <Pressable onPress={() => onSave({ ...category, label: name })} style={styles.headerButton}>
          <Text style={[styles.headerButtonText, { color: '#1C4D8D', fontWeight: '700' }]}>Save</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: category.color + '20' }]}>
            <Ionicons name={category.icon as any} size={40} color={category.color} />
          </View>
        </View>

        <View style={[styles.inputCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textMuted }]}>Category Name</Text>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={name}
            onChangeText={setName}
            placeholder="Enter category name"
            placeholderTextColor={colors.textMuted}
            autoFocus
          />
        </View>
      </View>
    </SafeAreaView>
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
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  headerButton: {
    padding: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 8,
  },
});
