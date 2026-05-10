
export const QUICK_CATEGORIES = [
  'Food',
  'Shopping',
  'Transport',
];

export const categoryGroups = [
  {
    id: 1,
    title: 'Daily Expenses',
    color: '#ea8a1a',
    bgColor: '#fff4e8',

    categories: [
      {
        id: 101,
        label: 'Groceries',
        icon: 'basket-outline',
        color: '#f97316',
      },
      {
        id: 102,
        label: 'Food & Drinks',
        icon: 'restaurant-outline',
        color: '#f59e0b',
      },
      {
        id: 103,
        label: 'Transportation',
        icon: 'car-outline',
        color: '#4f9cf2',
      },
    ],
  },

  {
    id: 2,
    title: 'Extra Expenses',
    color: '#f2b300',
    bgColor: '#fff9e6',

    categories: [
      {
        id: 201,
        label: 'Shopping',
        icon: 'bag-handle-outline',
        color: '#f59e0b',
      },
      {
        id: 202,
        label: 'Entertainment',
        icon: 'film-outline',
        color: '#fb7185',
      },
      {
        id: 203,
        label: 'Beauty',
        icon: 'sparkles-outline',
        color: '#ec4899',
      },
      {
        id: 204,
        label: 'Healthcare',
        icon: 'medical-outline',
        color: '#f43f5e',
      },
      {
        id: 205,
        label: 'Miscellaneous',
        icon: 'apps-outline',
        color: '#8b5cf6',
      },
    ],
  },

  {
    id: 3,
    title: 'Fixed Expenses',
    color: '#2f7ee6',
    bgColor: '#edf4ff',

    categories: [
      {
        id: 301,
        label: 'Rent',
        icon: 'home-outline',
        color: '#34d399',
      },
      {
        id: 302,
        label: 'Bills',
        icon: 'receipt-outline',
        color: '#2dd4bf',
      },
      {
        id: 303,
        label: 'Family',
        icon: 'people-outline',
        color: '#f472b6',
      },
    ],
  },

  {
    id: 4,
    title: 'Investment & Savings',
    color: '#22b8a8',
    bgColor: '#ebfbf8',

    categories: [
      {
        id: 401,
        label: 'Investment',
        icon: 'trending-up-outline',
        color: '#2dd4bf',
      },
      {
        id: 402,
        label: 'Education',
        icon: 'school-outline',
        color: '#a78bfa',
      },
    ],
  },
];

export type CategoryMeta = {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  groupId: number;
  groupTitle: string;
};

const flatCategoryMeta: CategoryMeta[] = categoryGroups.flatMap((group) =>
  group.categories.map((item) => ({
    label: item.label,
    icon: item.icon,
    color: item.color,
    bgColor: group.bgColor,
    groupId: group.id,
    groupTitle: group.title,
  })),
);

const categoryAliases: Record<string, string> = {
  Food: 'Food & Drinks',
  Transport: 'Transportation',
};

const categoryMetaByLabel = flatCategoryMeta.reduce<Record<string, CategoryMeta>>((acc, item) => {
  acc[item.label] = item;
  return acc;
}, {});

const defaultExpenseMeta: CategoryMeta = {
  label: 'Miscellaneous',
  icon: 'apps-outline',
  color: '#8b5cf6',
  bgColor: '#fff9e6',
  groupId: 2,
  groupTitle: 'Extra Expenses',
};

const incomeMeta: CategoryMeta = {
  label: 'Income',
  icon: 'wallet-outline',
  color: '#22c55e',
  bgColor: '#ecfdf5',
  groupId: 0,
  groupTitle: 'Income',
};

export const resolveCategoryMeta = (category: string): CategoryMeta => {
  if (category === 'Income') {
    return incomeMeta;
  }

  const normalized = categoryAliases[category] ?? category;
  return categoryMetaByLabel[normalized] ?? defaultExpenseMeta;
};