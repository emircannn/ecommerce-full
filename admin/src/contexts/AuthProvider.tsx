import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import api, { fetchCsrfToken } from '@/api/api';
import { Hourglass } from 'lucide-react';

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
      const response = await api.post('/admin/login', credentials, {
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
    await api.get('/admin/logout');
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
  }, []);

  if (loading) {
    return <div className='bg-thirth inset-0 fixed z-50 flex items-center justify-center'>
      <Hourglass size={50} className='animate-spin'/>
    </div>;
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
