/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import request from '@/utils/request';
import { IUser } from '@/types';

interface UserContextType {
    user: IUser | undefined;
    handleGetUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser>();
  

  const handleGetUser = useCallback(async() => {
    try {
        const res = await request({url: `/users/user`, method: 'get'})
        setUser(res.data)
    } catch (error: any) {
        throw new Error(error)
    }
  }, [])

  useEffect(() => {
    handleGetUser()
  }, [handleGetUser])
  

  return (
    <UserContext.Provider value={{ user, handleGetUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('user must be used within a UserProvider');
  }
  return context;
};