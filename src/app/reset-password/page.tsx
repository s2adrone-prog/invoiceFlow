
"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/icons';
import { Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { verifyPasswordResetCode } from 'firebase/auth';


const formSchema = z.object({
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});


function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
  
    const [oobCode, setOobCode] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const code = searchParams.get('oobCode');
        if (!code) {
          setError("Invalid reset link. The link is missing the required token.");
          setIsVerifying(false);
          return;
        }

        setOobCode(code);

        verifyPasswordResetCode(auth, code)
        .then(() => {
            setIsVerifying(false);
        }).catch((err) => {
            console.error("Invalid oobCode:", err);
            setError("Your password reset link is invalid or has expired. Please request a new one.");
            setIsVerifying(false);
        });
    }, [searchParams]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    });

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!oobCode) return;
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/confirm-password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oobCode, newPassword: values.password }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'An unexpected error occurred.');
            }

            toast({
                title: 'Success!',
                description: 'Your password has been reset. You can now sign in with your new password.',
            });
            router.push('/login');

        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }

    if (isVerifying) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="mb-4 flex justify-center">
                        <Logo />
                    </div>
                    <CardTitle>Reset Your Password</CardTitle>
                    <CardDescription>
                        {error ? 'Please try again.' : 'Enter your new password below.'}
                    </CardDescription>
                </CardHeader>
                {error ? (
                     <CardContent>
                        <p className="text-center text-red-500">{error}</p>
                     </CardContent>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="********" {...field} disabled={isLoading} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm New Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="********" {...field} disabled={isLoading} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter className="flex-col gap-4">
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                )}
                <CardFooter>
                     <Link href="/login" passHref className="w-full">
                        <Button variant="link" className="w-full">Back to Sign In</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}


export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}
