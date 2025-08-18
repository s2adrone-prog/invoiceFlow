
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    // The timeout simulates a network request.
    setTimeout(() => {
      // Ensure this code only runs on the client-side.
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }
      
      const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
      const userAccount = storedUsers[values.email];

      if (userAccount && userAccount.password === values.password) {
        // Success: User exists and password matches
        const user = { name: userAccount.name, email: values.email };
        localStorage.setItem('token', 'fake-jwt-token');
        localStorage.setItem('user', JSON.stringify(user));
        
        toast({
          title: 'Success',
          description: 'Logged in successfully.',
        });
        
        // Redirect to dashboard. Using window.location.href ensures a full page reload 
        // which can help in re-initializing the app state and auth context correctly.
        window.location.href = '/';
      } else {
        // Failure: User doesn't exist or password incorrect
        toast({
          title: 'Error',
          description: 'Invalid email or password.',
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
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="m@example.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <FormControl>
                      <Input 
                        type="password" 
                        {...field}
                        disabled={isLoading}
                        placeholder="••••••••"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin"/> : 'Sign In'}
              </Button>
              <p className="text-sm text-muted-foreground">
                  Don&apos;t have an account? <Link href="/signup" className="font-semibold text-primary hover:underline">Sign up</Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
