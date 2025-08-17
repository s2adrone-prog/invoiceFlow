"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { initializeUserInvoices } from '@/lib/data';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
        if(name && email && password) {
            const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
            if (storedUsers[email]) {
                toast({
                    title: 'Error',
                    description: 'An account with this email already exists.',
                    variant: 'destructive',
                });
                setIsLoading(false);
                return;
            }

            storedUsers[email] = { name, password };
            localStorage.setItem('users', JSON.stringify(storedUsers));
            
            // Initialize invoices for the new user
            initializeUserInvoices(email);

            toast({
              title: 'Success',
              description: 'Account created successfully. You can now log in.',
            });
            router.push('/login');
        } else {
            toast({
                title: 'Error',
                description: 'Please fill in all fields.',
                variant: 'destructive',
            });
            setIsLoading(false);
        }
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
                <Logo />
            </div>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Enter your details to get started.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
          <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="••••••••"
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <p className="text-sm text-muted-foreground">
                Already have an account? <Link href="/login" className="font-semibold text-primary hover:underline">Sign In</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
