"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: any;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ['/login', '/signup', '/forgot-password'];

  useEffect(() => {
    // This check is to prevent errors during server-side rendering
    if (typeof window === 'undefined') {
        setLoading(false);
        return;
    }

    const token = localStorage.getItem('token');
    const pathIsPublic = publicPaths.includes(pathname);

    if (token) {
      setUser({ isAuthenticated: true }); // Indicate authenticated
      if (pathIsPublic) {
        router.push('/');
      }
    } else if (!pathIsPublic) {
      router.push('/login');
    }
    setLoading(false);
  }, [pathname, router]);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const pathIsPublic = publicPaths.includes(pathname);

  if (loading || (!user && !pathIsPublic)) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
    )
  }
  
  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
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
