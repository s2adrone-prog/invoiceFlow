
"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import type { User } from '@/lib/types';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  login: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ['/login', '/signup', '/forgot-password'];

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('loggedInUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user && publicPaths.includes(pathname)) {
        router.replace('/');
      } else if (!user && !publicPaths.includes(pathname)) {
        router.replace('/login');
      }
    }
  }, [user, loading, pathname, router]);


  const login = (loggedInUser: User) => {
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
    router.push('/login');
  };

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
             <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    )
  }
  
  return (
    <AuthContext.Provider value={{ user, loading, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
