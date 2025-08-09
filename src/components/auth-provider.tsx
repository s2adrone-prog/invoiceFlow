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

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const publicPaths = ['/login', '/signup'];
    const pathIsPublic = publicPaths.includes(pathname);

    if (currentUser) {
      setUser(currentUser);
    } else if (!pathIsPublic) {
      router.push('/login');
    }
    
    setLoading(false);
  }, [pathname, router]);

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    router.push('/login');
  };

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
    )
  }

  const publicPaths = ['/login', '/signup'];
  const pathIsPublic = publicPaths.includes(pathname);

  if (pathIsPublic && user) {
    router.push('/');
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
    )
  }

  if (pathIsPublic || user) {
    return (
      <AuthContext.Provider value={{ user, loading, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return null;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
