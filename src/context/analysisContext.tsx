import { BASE_URL } from '@/data';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useAuth } from './authContext'; // 1. Thêm import này

interface MonthlyAnalysisResponse {
  total_income: number;
  total_expense: number;
  balance: number;
  month: string;
  number_of_expense_image: number,
  number_of_transactions: number,
  percentage_transaction_against_last_month: number,
  number_image_against_last_month: number,
}

interface WeeklyAnalysisResponse {
  active: boolean;
  amount: number;
  day: string;
}

export interface CalendarAnalysisResponse {
  amount: number;
  category: number;
  day: number;
  id: string;
  time: string;
  title: string;
}

interface OverviewTransactionResponse {
  amount: string;
  date: number[];
}

// Đổi tên thành AnalysisContextType cho đúng ngữ cảnh và sửa kiểu hàm fetchCalendarAnalysis
interface AnalysisContextType {
  monthlyAnalysis: MonthlyAnalysisResponse | undefined;
  weeklyAnalysis: WeeklyAnalysisResponse[];
  calendarAnalysis: CalendarAnalysisResponse[];
  overviewTransactionsAnalysis: OverviewTransactionResponse[];
  loading: boolean;
  error: string | null;

  fetchMonthlyAnalysis: () => Promise<void>;
  fetchWeeklyAnalysis: () => Promise<void>;
  fetchCalendarAnalysis: (date?: string) => Promise<void>; // Sửa để nhận tham số date optional
  fetchOverviewTransactionsAnalysis: () => Promise<void>;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(
  undefined
);

export function AnalysisProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [monthlyAnalysis, setMonthlyAnalysis] = useState<MonthlyAnalysisResponse>();
  const [weeklyAnalysis, setWeeklyAnalysis] = useState<WeeklyAnalysisResponse[]>([]);
  const [calendarAnalysis, setCalendarAnalysis] = useState<CalendarAnalysisResponse[]>([]);
  const [overviewTransactionsAnalysis, setOverviewTransactionsAnalysis] = useState<OverviewTransactionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Lấy trực tiếp accessToken từ authContext
  const { accessToken } = useAuth();

  // ===============================
  // FETCH MONTHLY ANALYSIS
  // ===============================
  const fetchMonthlyAnalysis = useCallback(async () => {
    if (!accessToken) return; // Chặn request khi chưa có token

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${BASE_URL}/analysis/monthly`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}` // Đổi thành accessToken
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch monthly analysis');
      }

      const data = await response.json();

      setMonthlyAnalysis(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken]); // 3. Thêm dependency vào đây

  // ===============================
  // FETCH WEEKLY ANALYSIS
  // ===============================
  const fetchWeeklyAnalysis = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${BASE_URL}/analysis/weekly`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weekly analysis');
      }

      const data = await response.json();

      setWeeklyAnalysis(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // ===============================
  // FETCH CALENDAR ANALYSIS
  // ===============================
  const fetchCalendarAnalysis = useCallback(async (date: string = "") => {
    if (!accessToken) return;

    try {
      setLoading(true);
      setError(null);

      let TARGET_URL = "/analysis/calendar-month";
      if (date !== ""){
        TARGET_URL += "?date=" + date;
      }

      const response = await fetch(
        `${BASE_URL}${TARGET_URL}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch financial calendar month');
      }

      const data = await response.json();
      setCalendarAnalysis(data.transactions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // ===============================
  // FETCH OVERVIEW-TRANSACTIONS ANALYSIS
  // ===============================
  const fetchOverviewTransactionsAnalysis = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${BASE_URL}/analysis/overview-transactions`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch financial overview transactions');
      }

      const data = await response.json();
      console.log("\n\n\nOVERVIEW TRANSACTIONS \n" + data.data);
      setOverviewTransactionsAnalysis(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  return (
    <AnalysisContext.Provider
      value={{
        monthlyAnalysis,
        weeklyAnalysis,
        calendarAnalysis,
        overviewTransactionsAnalysis,
        loading,
        error,
        fetchMonthlyAnalysis,
        fetchWeeklyAnalysis,
        fetchCalendarAnalysis,
        fetchOverviewTransactionsAnalysis,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

// custom hook
export function useAnalysis() {
  const context = useContext(AnalysisContext);

  if (!context) {
    throw new Error(
      'useAnalysis must be used inside AnalysisProvider'
    );
  }

  return context;
}