export const QUICK_CATEGORIES = ['Food', 'Shopping', 'Transport'] as const;

export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface CategoryGroup {
  id: string;
  title: string;
  color: string;
  bgColor: string;
  categories: Category[];
}

export const categoryGroups: CategoryGroup[] = [
  {
    id: "6a09f98cf503df6fa9d2ff0e",
    title: "Daily Expenses",
    color: "#ea8a1a",
    bgColor: "#fff4e8",
    categories: [
      {
        id: "6a09f98cf503df6fa9d2ff12",
        label: "Groceries",
        icon: "basket-outline",
        color: "#f97316",
      },
      {
        id: "6a09f98cf503df6fa9d2ff13",
        label: "Food & Drinks",
        icon: "restaurant-outline",
        color: "#f3ac33",
      },
      {
        id: "6a09f98cf503df6fa9d2ff14",
        label: "Transportation",
        icon: "car-outline",
        color: "#F48F68",
      },
    ],
  },
  {
    id: "6a09f98cf503df6fa9d2ff0f",
    title: "Extra Expenses",
    color: "#f472b6",
    bgColor: "#FFCEE3",
    categories: [
      {
        id: "6a09f98cf503df6fa9d2ff15",
        label: "Shopping",
        icon: "bag-handle-outline",
        color: "#BF4646",
      },
      {
        id: "6a09f98cf503df6fa9d2ff16",
        label: "Entertainment",
        icon: "film-outline",
        color: "#fb7185",
      },
      {
        id: "6a09f98cf503df6fa9d2ff17",
        label: "Beauty",
        icon: "sparkles-outline",
        color: "#ec4899",
      },
      {
        id: "6a09f98cf503df6fa9d2ff18",
        label: "Healthcare",
        icon: "medical-outline",
        color: "#f43f5e",
      },
      {
        id: "6a09f98cf503df6fa9d2ff19",
        label: "Miscellaneous",
        icon: "apps-outline",
        color: "#F13E93",
      },
    ],
  },
  {
    id: "6a09f98cf503df6fa9d2ff10",
    title: "Fixed Expenses",
    color: "#2f7ee6",
    bgColor: "#edf4ff",
    categories: [
      {
        id: "6a09f98cf503df6fa9d2ff1a",
        label: "Rent",
        icon: "home-outline",
        color: "#4f9cf2",
      },
      {
        id: "6a09f98cf503df6fa9d2ff1b",
        label: "Bills",
        icon: "receipt-outline",
        color: "#2FA4D7",
      },
      {
        id: "6a09f98cf503df6fa9d2ff1c",
        label: "Family",
        icon: "people-outline",
        color: "#134E8E",
      },
    ],
  },
  {
    id: "6a09f98cf503df6fa9d2ff11",
    title: "Investment & Savings",
    color: "#9B5DE0",
    bgColor: "#FFDBFD",
    categories: [
      {
        id: "6a09f98cf503df6fa9d2ff1d",
        label: "Investment",
        icon: "trending-up-outline",
        color: "#696FC7",
      },
      {
        id: "6a09f98cf503df6fa9d2ff1e",
        label: "Education",
        icon: "school-outline",
        color: "#a78bfa",
      },
    ],
  },
];


// ==================== CATEGORY META ====================

export type CategoryMeta = {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  groupId: string;
  groupTitle: string;
};

// Tạo flat list và map (chỉ chạy 1 lần)
const createCategoryMetaMap = () => {
  const flat = categoryGroups.flatMap((group) =>
    group.categories.map((item) => ({
      label: item.label,
      icon: item.icon,
      color: item.color,
      bgColor: group.bgColor,
      groupId: group.id,
      groupTitle: group.title,
    }))
  );

  const map = flat.reduce<Record<string, CategoryMeta>>((acc, item) => {
    acc[item.label] = item;
    return acc;
  }, {});

  console.log('✅ CategoryMeta loaded:', Object.keys(map)); // Debug
  return map;
};

const categoryMetaByLabel = createCategoryMetaMap();

// Alias
const categoryAliases: Record<string, string> = {
  Food: 'Food & Drinks',
  Transport: 'Transportation',
};

// Default
const defaultExpenseMeta: CategoryMeta = {
  label: 'Miscellaneous',
  icon: 'apps-outline',
  color: '#8b5cf6',
  bgColor: '#fff9e6',
  groupId: '6a09f98cf503df6fa9d2ff0f',
  groupTitle: 'Extra Expenses',
};

const incomeMeta: CategoryMeta = {
  label: 'Income',
  icon: 'wallet-outline',
  color: '#22c55e',
  bgColor: '#ecfdf5',
  groupId: 'income',
  groupTitle: 'Income',
};

// ==================== MAIN FUNCTION ====================

export const resolveCategoryMeta = (category: string): CategoryMeta => {
  if (!category) return defaultExpenseMeta;

  if (category === 'Income' || category.toLowerCase() === 'income') {
    return incomeMeta;
  }

  const normalized = categoryAliases[category] ?? category;

  const result = categoryMetaByLabel[normalized] ?? defaultExpenseMeta;

  // Debug (bạn có thể xóa sau)
  if (result.label === 'Miscellaneous' && normalized !== 'Miscellaneous') {
    console.warn(`⚠️ Không tìm thấy category: "${normalized}"`);
  }

  return result;
};