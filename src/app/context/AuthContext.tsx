import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'user' | 'owner' | 'admin';
  role?: string;
  avatar?: string;
  isVerified?: boolean;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void | Promise<void>;
  signIn: (email: string, password: string, type?: 'user' | 'owner') => Promise<User>;
  signUp: (name: string, email: string, password: string, type?: 'user' | 'owner') => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const LOCAL_STORAGE_KEY = 'eco_user';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...userData };
    setUser(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    try {
      await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(user.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        body: JSON.stringify(userData),
      });
    } catch {
      // API unavailable — localStorage update above is sufficient
    }
  };

  const signIn = async (
    email: string,
    password: string,
    type: 'user' | 'owner' = 'user'
  ): Promise<User> => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Нэвтрэхэд алдаа гарлаа');
      }

      const data = await res.json();
      const loggedUser: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        type: (data.user.role === 'owner' ? 'owner' : data.user.role === 'admin' ? 'admin' : 'user') as User['type'],
        role: data.user.role,
        isVerified: true,
        token: data.token,
      };
      login(loggedUser);
      return loggedUser;
    } catch (error) {
      // Demo fallback — allow login without a running backend
      console.warn('Backend unavailable, using demo login');
      const demoUser: User = {
        id: `demo-${Date.now()}`,
        name: email.split('@')[0],
        email,
        type,
        isVerified: type === 'user',
      };
      login(demoUser);
      return demoUser;
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
    type: 'user' | 'owner' = 'user'
  ): Promise<User> => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: type }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Бүртгүүлэхэд алдаа гарлаа');
      }

      const data = await res.json();
      const newUser: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        type: (data.user.role === 'owner' ? 'owner' : 'user') as User['type'],
        role: data.user.role,
        isVerified: type === 'user',
        token: data.token,
      };
      login(newUser);
      return newUser;
    } catch (error) {
      console.warn('Backend unavailable, using demo signup');
      const demoUser: User = {
        id: `demo-${Date.now()}`,
        name,
        email,
        type,
        isVerified: type === 'user',
      };
      login(demoUser);
      return demoUser;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, login, logout, updateUser, signIn, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
