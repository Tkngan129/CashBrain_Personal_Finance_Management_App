import { BASE_URL } from '@/data';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState
} from 'react';
import { useAuth } from './authContext';

interface AIChatbotContextType {
  AIChatbotPromptPreviewResponse: string;
  loading: boolean;
  error: string | null;
  // Sửa kiểu trả về thành Promise<string> để UI nhận được data trực tiếp
  fetchAIChatbotPromptPreview: (message: string) => Promise<string | undefined>; 
}

const AIChatbotContext = createContext<AIChatbotContextType | undefined>(undefined);

export function AIChatbotProvider({ children }: { children: ReactNode }) {
  const [AIChatbotPromptPreviewResponse, setAIChatbotPromptPreviewResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuth();

  // ===============================
  // FETCH AI CHATBOT RESPONSE
  // ===============================
  const fetchAIChatbotPromptPreview = useCallback(async (message: string) => {
    if (!accessToken) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${BASE_URL}/chat/prompt-preview`,
        {
          method: 'POST', // 1. BẮT BUỘC: Thêm phương thức POST
          headers: {
            'Content-Type': 'application/json', // 2. BẮT BUỘC: Thêm header định dạng JSON
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ message }) // 3. Gửi dưới dạng object chuẩn 
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch AI chatbot response'); // Sửa log lỗi copy-paste
      }

      const data = await response.json();
      
      setAIChatbotPromptPreviewResponse(data.ai_preview_response);
      return data.ai_preview_response; // 4. Trả về data trực tiếp để UI xử lý nhanh
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  return (
    <AIChatbotContext.Provider
      value={{
        fetchAIChatbotPromptPreview,
        loading,
        error,
        AIChatbotPromptPreviewResponse,
      }}
    >
      {children}
    </AIChatbotContext.Provider>
  );
}

// Custom hook
export function useAIChatbot() {
  const context = useContext(AIChatbotContext);
  if (!context) {
    throw new Error('useAIChatbot must be used inside AIChatbotProvider'); // Sửa lỗi gọi nhầm tên Provider
  }
  return context;
}