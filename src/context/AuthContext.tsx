import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    address?: string;
    dietaryPreference?: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: {
    name?: string;
    phone?: string;
    address?: string;
    dietaryPreference?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'amma_pastries_user';
const TOKEN_STORAGE_KEY = 'amma_pastries_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (e) {
      console.error('Failed to parse saved auth', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
    localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
    setIsAuthModalOpen(false);
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    address?: string;
    dietaryPreference?: string;
  }) => {
    const res = await api.register(data);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
    localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  const updateProfile = async (data: {
    name?: string;
    phone?: string;
    address?: string;
    dietaryPreference?: string;
  }) => {
    if (!user) return;
    const res = await api.updateProfile({ id: user.id, ...data });
    setUser(res.user);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
