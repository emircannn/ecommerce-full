import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import api, { fetchCsrfToken } from '@/api/api';
import LoadingScreen from '@/components/UIX/LoadingScreen';

interface LoginResponse {
  message: string;
  error?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<LoginResponse>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const login = async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
      const csrfToken = await fetchCsrfToken();
      const response = await api.post('/auth/login', credentials, {
        headers: {
          'X-CSRF-Token': csrfToken
        }
      });
      if (response.data.error) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }

      return response.data
  };

  const logout = async() => {
    setIsAuthenticated(false);
    await api.get('/auth/logout');
  };

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/auth/check');
      setIsAuthenticated(response.data.valid);
    } catch (error) {
      console.error('Auth durumu kontrol hatası:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
      checkAuthStatus();
  }, [isAuthenticated]);

  if (loading) {
    return <LoadingScreen/>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
