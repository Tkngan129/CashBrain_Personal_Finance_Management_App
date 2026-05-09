import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ─── Shared photo-expense type ───────────────────────────────────────────────
export type PhotoTransaction = {
  id: string;
  title: string;
  amount: number;        // always negative (expense)
  category: string;
  categoryColor: string;
  categoryBg: string;
  note: string;
  date: string;          // display: 'Apr 11'
  dateISO: string;       // sort/calendar: 'YYYY-MM-DD'
  imageDataUrl: string;
  createdAt: Date;
};

type TransactionContextType = {
  photoTransactions: PhotoTransaction[];
  addPhotoTransaction: (tx: Omit<PhotoTransaction, 'id' | 'createdAt'>) => void;
  streak: number;
};

const TransactionContext = createContext<TransactionContextType | null>(null);

// ─── Streak helper ────────────────────────────────────────────────────────────
function calcStreak(txs: PhotoTransaction[]): number {
  if (!txs.length) return 0;
  const dateSet = new Set(txs.map(t => t.dateISO));
  let count = 0;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (dateSet.has(d.toISOString().split('T')[0])) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function TransactionProvider({ children }: { children: ReactNode }) {
  const [photoTransactions, setPhotoTransactions] = useState<PhotoTransaction[]>([]);

  const addPhotoTransaction = useCallback(
    (tx: Omit<PhotoTransaction, 'id' | 'createdAt'>) => {
      setPhotoTransactions(prev => [
        { ...tx, id: `photo-${Date.now()}`, createdAt: new Date() },
        ...prev,
      ]);
    },
    [],
  );

  return (
    <TransactionContext.Provider
      value={{
        photoTransactions,
        addPhotoTransaction,
        streak: calcStreak(photoTransactions),
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
const defaultCtx: TransactionContextType = {
  photoTransactions: [],
  addPhotoTransaction: () => {},
  streak: 0,
};

export function useTransactions(): TransactionContextType {
  const ctx = useContext(TransactionContext);
  // Gracefully fall back to empty state when rendered outside the provider
  // (e.g. Figma Make component-level previews)
  return ctx ?? defaultCtx;
}