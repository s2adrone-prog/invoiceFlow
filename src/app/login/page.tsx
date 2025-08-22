
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInWithPhoneNumber, RecaptchaVerifier, type ConfirmationResult } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/icons';
import { Loader2 } from 'lucide-react';
import type { User } from '@/lib/types';
import { useAuth } from '@/components/auth-provider';
import { auth, db } from '@/lib/firebase';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const { toast } = useToast();
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handlePasswordLogin = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setTimeout(() => {
        let users: User[] = [];
        try {
            const storedUsers = localStorage.getItem('users');
            if (storedUsers) {
                const parsedUsers = JSON.parse(storedUsers);
                if (Array.isArray(parsedUsers)) {
                    users = parsedUsers;
                }
            }
        } catch (e) {
            console.error("Failed to parse users from localStorage", e);
        }

        const user = users.find(u => u.email === values.email && u.password === values.password);

        if (user) {
            const { password, ...userToLogin } = user;
            login(userToLogin);
            toast({
                title: 'Success',
                description: 'Logged in successfully.',
            });
        } else {
            toast({
                title: 'Error',
                description: 'Invalid email or password.',
                variant: 'destructive',
            });
        }
        setIsLoading(false);
    }, 1000);
  };

  const requestOtp = async () => {
    setIsLoading(true);
    try {
        const q = query(collection(db, "allowedUsers"), where("phone", "==", phone));
        const snap = await getDocs(q);
        if (snap.empty) {
          toast({ title: "Error", description: "This phone number is not authorized.", variant: "destructive" });
          setIsLoading(false);
          return;
        }

        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
        const appVerifier = (window as any).recaptchaVerifier;
        const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
        setConfirmationResult(confirmation);
        toast({ title: "OTP Sent", description: "An OTP has been sent to your phone." });
    } catch (error: any) {
        console.error("OTP Error:", error);
        toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setIsLoading(false);
  }

  const verifyOtp = async () => {
    if (!confirmationResult) return;
    setIsLoading(true);
    try {
        await confirmationResult.confirm(otp);
        
        let users: User[] = [];
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            const parsedUsers = JSON.parse(storedUsers);
            if (Array.isArray(parsedUsers)) {
                users = parsedUsers;
            }
        }
        
        const user = users.find(u => u.customerPhone === phone);

        if (user) {
            const { password, ...userToLogin } = user;
            login(userToLogin);
            toast({ title: 'Success', description: 'Logged in successfully.' });
        } else {
            // Fallback if user not found in localstorage, which shouldn't happen if they are in allowedUsers
            toast({ title: 'Error', description: 'Could not find user data for this phone number.', variant: 'destructive' });
        }

    } catch (error: any) {
        console.error("OTP Verification Error:", error);
        toast({ title: "Error", description: "Invalid OTP. Please try again.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
                <Logo />
            </div>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Choose your sign in method.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="phone">Phone</TabsTrigger>
                </TabsList>
                <TabsContent value="email">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(handlePasswordLogin)} className="space-y-4 pt-4">
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
                                <div className="flex justify-between">
                                <FormLabel>Password</FormLabel>
                                <Link href="/forgot-password" passHref>
                                    <span className="text-sm font-medium text-primary hover:underline cursor-pointer">
                                    Forgot password?
                                    </span>
                                </Link>
                                </div>
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
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin"/> : 'Sign In'}
                        </Button>
                    </form>
                    </Form>
                </TabsContent>
                <TabsContent value="phone">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4 pt-4">
                        {!confirmationResult ? (
                            <div className="space-y-4">
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+1 234 567 890"
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                </FormItem>
                                <Button onClick={requestOtp} className="w-full" disabled={isLoading || !phone}>
                                    {isLoading ? <Loader2 className="animate-spin"/> : 'Send OTP'}
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <FormItem>
                                    <FormLabel>Enter OTP</FormLabel>
                                    <FormControl>
                                        <Input
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="123456"
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                </FormItem>
                                <Button onClick={verifyOtp} className="w-full" disabled={isLoading || !otp}>
                                    {isLoading ? <Loader2 className="animate-spin"/> : 'Verify OTP & Sign In'}
                                </Button>
                            </div>
                        )}
                        <div id="recaptcha-container"></div>
                    </form>
                </TabsContent>
            </Tabs>
        </CardContent>
        <CardFooter className="flex-col gap-4">
            <div className="text-sm">
            Don't have an account?{' '}
            <Link href="/signup" passHref>
                <span className="font-medium text-primary hover:underline cursor-pointer">
                Sign up
                </span>
            </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
