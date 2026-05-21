import { BASE_URL } from '@/data';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState
} from 'react';

interface UserProfileType{
  created_at: string,
  email: string,
  id: string,
  role: string,
  username: string
}

interface ExpenseContextType {
  accessToken: string,
  refreshToken: string,
  userProfile: UserProfileType | undefined,
  loading: boolean,
  error: string|null,

  fetchUserLogin: (username: string, password: string) => Promise<void>,
  fetchUserRegister: (username: string, email: string, password: string) => Promise<void>,
  fetchUserProfile: () => Promise<void>,
}

const AuthContext = createContext<ExpenseContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [userProfile, setUserProfile] = useState<UserProfileType | undefined>();

  // ===============================
  // FETCH USER LOGIN 
  // ===============================
  const fetchUserLogin = useCallback(async (username: string, password: string) => {
    try{
      setLoading(true);
      setError(null);

      if (!username){
        throw new Error('Have to enter your username!');
      }else if (!password){
        throw new Error('Have to enter your password!');
      }

      const response = await fetch(
        `${BASE_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({username, password})
        }
      );

      const data = await response.json()

      console.log(data.data);

      if (!response.ok){
        throw new Error( data.message || 'Failed to login' );
      }

      

      setAccessToken(data.data.access_token);
      setRefreshToken(data.data.refresh_token);
    }catch(err: any){
      setError(err.message);
    }finally{
      setLoading(false);
    }
  }, []);


  // ===============================
  // FETCH USER REGISTER
  // ===============================
  const fetchUserRegister = useCallback(async (username: string, email: string, password: string) => {
    try{
      setLoading(true);
      setError(null);

      if (!username){
        throw new Error('Have to enter your username!');
      }else if (!password){
        throw new Error('Have to enter your password!');
      }else if (!email){
        throw new Error('Have to enter your email!');
      }

      const response = await fetch(
        `${BASE_URL}/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({username, email, password})
        }
      );

      if (!response.ok){
        throw new Error('Failed to register');
      }

      const data = await response.json()

      setAccessToken(data.data.access_token);
      setRefreshToken(data.data.refresh_token);
    }catch(err: any){
      setError(err.message);
    }finally{
      setLoading(false);
    }
  }, []);

  // ===============================
  // FETCH USER PROFILE
  // ===============================
  const fetchUserProfile = useCallback( async() => {
    try{
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${BASE_URL}/auth/profile`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok){
        throw new Error('Failed to register');
      }

      const data = await response.json()

      console.log("\n\n\nUSER PROFILE\n\n" + data.data);
      setUserProfile(data.data);
    }catch(err: any){
      setError(err.message);
    }finally{
      setLoading(false);
    }
  }, [accessToken, refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        userProfile,
        loading,
        error,

        fetchUserLogin,
        fetchUserRegister,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// custom hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAnalysis must be used inside AnalysisProvider'
    );
  }

  return context;
}