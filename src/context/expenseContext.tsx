import { BASE_URL } from '@/data';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { Transaction as UITransactionType } from '../app/components/TransactionDetailScreen';
import { useAuth } from './authContext';

// ... Các interface giữ nguyên không thay đổi ...
interface Expense { amount: number; category_id: string; date: string; note?: string; }
interface Income { amount: number; date: string; note?: string; }
interface ExpenseResponse { id: string; note: string; category_name: string; amount: number; date: string; category_color: string; category_icon: string; category_bg_color: string; type: string; }
interface ExpenseCategoriesResponse { bgColor: string; color: string; id: string; title: number; categories: CategoryMetaData[] }
interface CategoryMetaData { color: string; icon: string; id: string; label: string }
interface IncomeResponse { id: string; note: string; amount: number; date: string; type: string; category_name: 'Income'; category_color: '#22c55e'; category_icon: 'wallet-outline'; category_bg_color: '#ecfdf5'; }
type Transaction = (ExpenseResponse | IncomeResponse) & { type: 'Expense' | 'Income'; amount: number; };

export interface ExpenseImageResponse {
  id: string;          // Bắt buộc phải có để FlatList phân biệt các item
  amount: number;      // Số tiền chi tiêu
  image_url: string;   // Link ảnh từ Cloudinary để hiển thị
  note: string;        // Ghi chú (ví dụ: "Mua RTX 5090")
  date: string;
  category_name: string;
}

interface ExpenseContextType {
  expenses: ExpenseResponse[];
  incomes: IncomeResponse[];
  transactions: Transaction[];
  expenseCategories: ExpenseCategoriesResponse[];
  expenseImages: ExpenseImageResponse[]
  loading: boolean;
  error: string | null;
  fetchExpenses: () => Promise<void>;
  fetchIncomes: () => Promise<void>;
  fetchExpensesCategories: () => Promise<void>;
  addExpense: (expense: Expense) => Promise<void>;
  addIncome: (income: Income) => Promise<void>;
  fetchExpenseImage: () => Promise<void>;
  addExpenseImage: (category_id: string, amount: number, date: string, note: string, capturedUri: string  ) => Promise<void>;
  deleteExpenseImage: (expenseImageID: string) => Promise<void>;
  updateTransaction: (updatedTx: UITransactionType, type: string) => Promise<void>;
  deleteTransaction: (transactionID: string,  type: string) => Promise<void>
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [incomes, setIncomes] = useState<IncomeResponse[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategoriesResponse[]>([]);
  const [expenseImages, setExpenseImages] = useState<ExpenseImageResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Lấy trực tiếp accessToken từ authContext
  const { accessToken } = useAuth(); 

  // ===============================
  // FETCH USER EXPENSE DATA
  // ===============================
  const fetchExpenses = useCallback(async () => {
    // Nếu chưa có token thì không fetch để tránh lỗi 401 bừa bãi
    if (!accessToken) return; 

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/expense/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}` // Dùng trực tiếp accessToken ở đây
        }
      });

      if (!response.ok) throw new Error('Failed to fetch all expenses');

      const data = await response.json();

      setExpenses(data.data);
    } catch (err: any) {
      console.log(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken]); // BẮT BUỘC: Thêm accessToken vào đây để hàm cập nhật khi token thay đổi

  // ===============================
  // FETCH USER INCOME DATA
  // ===============================
  const fetchIncomes = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/income/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch all incomes');

      const data = await response.json();
      setIncomes(data.data);
    } catch (err: any) {
      console.log(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken]); // Thêm phụ thuộc accessToken

  // ======================
  // CONCAT INCOMES AND EXPENSE SORT TRANSACTIONS
  // ======================
  useEffect(() => {
    setTransactions( () => {
      const allTransactions: any[] = [];

      expenses.forEach(exp => {
        allTransactions.push({
          ...exp,
          type: 'Expense' as const,
          amount: Math.abs(Number(exp.amount)),
        });
      });

      incomes.forEach(inc => {
        allTransactions.push({
          ...inc,
          type: 'Income' as const,
          amount: Math.abs(Number(inc.amount)),
        });
      });

      return allTransactions.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
    });
  }, [expenses, incomes]);

  // ===============================
  // FETCH EXPENSE CATEGORIES DATA
  // ===============================
  const fetchExpensesCategories = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/expense/categories`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch expense categories');

      const data = await response.json();
      setExpenseCategories(data.data);
    } catch (err: any) {
      console.log(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken]); // Thêm phụ thuộc accessToken

  // ===============================
  // ADD USER EXPENSE DATA
  // ===============================
  const addExpense = useCallback(async (expense: Expense) => {
    if (!accessToken) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/expense/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(expense),
      });

      if (!response.ok) throw new Error('Failed to add expense');

      const newExpense = await response.json();
      setExpenses(prev => [newExpense.data, ...prev]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // ===============================
  // GET USER EXPENSE IMAGE
  // ===============================
  const fetchExpenseImage = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${BASE_URL}/expense/image`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get expense image');
      }

      const data = await response.json();

      // Update state
      setExpenseImages(data.data);

      // Log dữ liệu ngay sau khi fetch
      data.data.forEach((item: any, index: number) => {
        console.log(`${index}: ${item.image_url}`);
      });

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // ===============================
  // ADD USER EXPENSE IMAGE
  // ===============================
  const addExpenseImage = useCallback(
    async (
      category_id: string,
      amount: number,
      date: string,        // định dạng 'YYYY-MM-DD'
      note: string,
      capturedUri: string   // uri từ camera hoặc thư viện (dạng file://...)
    ) => {
      try {
        setError(null);
        setLoading(true);

        // Tạo FormData
        const formData = new FormData();
        formData.append('category_id', category_id);
        formData.append('amount', amount.toString());
        formData.append('date', date);
        formData.append('note', note);

        // Xử lý file ảnh
        // Lấy tên file từ uri
        const filename = capturedUri.split('/').pop() || 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const fileType = match ? `image/${match[1]}` : 'image/jpeg';

        // @ts-ignore - React Native FormData chấp nhận object này
        formData.append('image', {
          uri: capturedUri,
          name: filename,
          type: fileType,
        });

        const response = await fetch(`${BASE_URL}/expense/image`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // Không set 'Content-Type' để fetch tự động thêm multipart boundary
          },
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to add an expense with image');
        }

        // Cập nhật state expenses (thêm mới)
        setExpenses(prev => [result.data, ...prev]);

        // Nếu bạn có state riêng cho images (không cần thiết nếu đã gắn vào expense)
        setExpenseImages(prev => [...prev, { 
          id: result.data.id,        
          amount: result.data.amount,      
          image_url: result.data.image_url,   
          note: result.data.note,        
          date: result.data.date,
          category_name: result.data.category_name,
        }]);

        console.log('Successfully add a new expense with image:', result.data);
        return result.data;
      } catch (error: any) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
  },[accessToken]);

  // ===============================
  // ADD USER EXPENSE IMAGE
  // ===============================
  // Trong expenseContext.tsx (hoặc nơi quản lý expense)

const deleteExpenseImage = useCallback(async (expenseImageID: string) => {
    try {
      setError(null);
      setLoading(true);

      if (!expenseImageID){
        throw new Error("Please select an expense to delete")
      }
      const DESTINATION_PATH = `/expense/${expenseImageID}`
      const response = await fetch(`${BASE_URL}${DESTINATION_PATH}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add an expense with image');
      }

      setExpenseImages( (prev) => {
        const NewArray = prev.filter((item) => item.id !== expenseImageID);

        return NewArray;
      });

    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  },[accessToken]);

  // ===============================
  // ADD USER INCOME DATA
  // ===============================
  const addIncome = useCallback(async (income: Income) => {
    if (!accessToken) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/income/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(income),
      });

      if (!response.ok) throw new Error('Failed to add income');

      const newIncome = await response.json();
      setIncomes(prev => [newIncome.data, ...prev]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // ===============================
  // UPDATE USER TRANSACTION DATA
  // ===============================

  const updateTransaction = useCallback( async (updatedTx: UITransactionType, type: string) => {
    if (!accessToken) return;

    try {
      setLoading(true);
      setError(null);

      const inputAmount = Math.abs(parseFloat(updatedTx.amount as any));

      const finalAmount = type === 'Income' ? inputAmount : inputAmount;

      let body;
      if (updatedTx.category_id !== "null" && updatedTx.category_id !== "" ) {
        body = JSON.stringify({
          amount: String(finalAmount), 
          category_id: updatedTx.category_id ?? "",
          date: updatedTx.date,
          note: updatedTx.title || "",
        })
      }else{
        body = JSON.stringify({
          amount: String(finalAmount), 
          date: updatedTx.date,
          note: updatedTx.title || "",
        })
      }

      const response = await fetch(`${BASE_URL}/${type === "Income" ? 'income' : 'expense'}/${updatedTx.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: body
      });

      console.log("\n\n\nUPDATE TRANSACTION" + JSON.stringify({amount: String(finalAmount), 
          category_id: updatedTx.category_id ?? "",
          date: updatedTx.date,
          note: updatedTx.title || "",}))

      if (!response.ok) throw new Error('Failed to update transaction');

      const newIncome = await response.json();
      setTransactions(prev => [newIncome.data, ...prev]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  } , [accessToken]);
  
  // ===============================
  // UPDATE USER TRANSACTION DATA
  // ===============================

  const deleteTransaction = useCallback( async (transactionID: string,  type: string) => {
    if (!accessToken) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/${type === "Income" ? 'income' : 'expense'}/${transactionID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if (!response.ok) throw new Error('Failed to delete transaction');

      setTransactions( (prev) => {
        return prev.filter((item) => item.id!==transactionID);
      })

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  } , [accessToken]);
    




  return (
    <ExpenseContext.Provider
      value={{
        expenseCategories,
        expenses,
        incomes,
        expenseImages,
        transactions,
        loading,
        error,
        fetchExpenses,
        fetchIncomes,
        fetchExpensesCategories,
        addExpense,
        addIncome,
        fetchExpenseImage,
        addExpenseImage,
        deleteExpenseImage,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error('useExpenses must be used inside ExpenseProvider');
  return context;
}