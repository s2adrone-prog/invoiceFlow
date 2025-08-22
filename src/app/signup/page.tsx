
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { collection, query, where, getDocs, getDoc, doc, setDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/icons';
import { Loader2 } from 'lucide-react';
import type { User } from '@/lib/types';
import { useAuth } from '@/components/auth-provider';
import { db } from '@/lib/firebase';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  customerPhone: z.string().min(10, { message: "Phone must be at least 10 digits"}).optional(),
});

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      customerPhone: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
        // 1. Check if the email is in the allowedUsers collection
        const q = query(collection(db, "allowedUsers"), where("email", "==", values.email));
        const allowedUserSnap = await getDocs(q);

        if (allowedUserSnap.empty) {
            toast({
                title: 'Error',
                description: 'This email address is not authorized for sign up.',
                variant: 'destructive',
            });
            setIsLoading(false);
            return;
        }

        // 2. Check if a user account already exists in localStorage
        let users: User[] = [];
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            users = JSON.parse(storedUsers);
        }

        const userExists = users.some(u => u.email === values.email);

        if (userExists) {
            toast({
                title: 'Error',
                description: 'An account with this email already exists. Please sign in.',
                variant: 'destructive',
            });
            setIsLoading(false);
            return;
        }

        // 3. Create new user in localStorage
        const allowedUserData = allowedUserSnap.docs[0].data();
        const newUser: User = {
            id: Date.now().toString(),
            name: values.name,
            email: values.email,
            password: values.password,
            customerPhone: allowedUserData.phone || "", // Get phone from allowed user list
        };

        const updatedUsers = [...users, newUser];
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        const { password, ...userToLogin } = newUser;
        login(userToLogin);

        toast({
            title: 'Success',
            description: 'Account created successfully.',
        });

    } catch (error) {
        console.error("Signup error:", error);
        toast({
            title: 'Error',
            description: 'An unexpected error occurred during sign up.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
                <Logo />
            </div>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Enter your details to get started.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <CardContent className="space-y-4">
              <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin"/> : 'Sign Up'}
              </Button>
              <div className="text-sm">
                Already have an account?{' '}
                <Link href="/login" passHref>
                  <span className="font-medium text-primary hover:underline cursor-pointer">
                    Sign in
                  </span>
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
