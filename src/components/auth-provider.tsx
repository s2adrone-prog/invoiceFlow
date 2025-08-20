
"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  displayName: string | null;
  email: string | null;
  uid: string;
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
  const { toast } = useToast();

  const publicPaths = ['/login'];

  useEffect(() => {
    // Handle the email link sign-in
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      if(email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then((result) => {
            window.localStorage.removeItem('emailForSignIn');
            setUser({
              displayName: result.user.displayName,
              email: result.user.email,
              uid: result.user.uid
            });
            router.replace('/');
          })
          .catch((error) => {
            toast({
              title: "Sign In Error",
              description: "The sign-in link is invalid or has expired.",
              variant: "destructive"
            });
            router.replace('/login');
          });
      }
    }


    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
            displayName: firebaseUser.displayName || firebaseUser.email,
            email: firebaseUser.email,
            uid: firebaseUser.uid
        });
        if (publicPaths.includes(pathname)) {
            router.replace('/');
        }
      } else {
        setUser(null);
        if (!publicPaths.includes(pathname)) {
          router.replace('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router, toast]);

  const logout = () => {
    auth.signOut().then(() => {
      router.push('/login');
    });
  };

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
             <Loader2 className="h-16 w-16 animate-spin text-primary" />
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
