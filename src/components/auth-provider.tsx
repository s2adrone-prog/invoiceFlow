"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ['/login', '/signup', '/forgot-password'];

  useEffect(() => {
    // This effect should only run on the client
    if (typeof window === 'undefined') {
      return;
    }
  
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const pathIsPublic = publicPaths.includes(pathname);
  
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      // If the user is logged in and tries to access a public page,
      // redirect them to the home page.
      if (pathIsPublic) {
        router.replace('/');
      }
    } else if (!pathIsPublic) {
      // If the user is not logged in and the path is not public,
      // redirect them to the login page.
      router.replace('/login');
    }
  
    setLoading(false);
  
  }, [pathname, router]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const pathIsPublic = publicPaths.includes(pathname);

  // While loading, or if a user is not authenticated on a protected route, show a loader.
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
