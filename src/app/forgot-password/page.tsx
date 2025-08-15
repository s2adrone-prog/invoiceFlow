"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // In a real app, you'd send a reset link to the user's email.
    // Here, we just simulate the success state.
    setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
        toast({
            title: 'Password Reset Simulation',
            description: 'In a real app, an email would be sent if the account exists.',
        });
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
                <Logo />
            </div>
          <CardTitle>Forgot Your Password?</CardTitle>
          <CardDescription>
            {isSubmitted 
              ? "If an account with this email exists, a password reset link would have been sent."
              : "No problem. Enter your email below and we'll send you a link to reset it."
            }
            </CardDescription>
        </CardHeader>
        {!isSubmitted && (
            <form onSubmit={handleSubmit}>
            <CardContent>
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
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
            </CardFooter>
            </form>
        )}
        <div className="p-6 pt-0 text-center">
          <Link href="/login" passHref>
             <Button variant="link" className="text-sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
             </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
