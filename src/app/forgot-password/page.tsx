
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    // This is a mock implementation. In a real app, you'd call your backend/Firebase here.
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast({
        title: 'Check your email',
        description: `If an account exists for ${values.email}, a password reset link has been sent.`,
      });
      setTimeout(() => router.push('/login'), 3000);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
                <Logo />
            </div>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            {isSubmitted 
              ? "You can close this tab now."
              : "Enter your email to receive a password reset link."
            }
          </CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <CardContent className="space-y-4">
                {!isSubmitted ? (
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
                ) : (
                    <p className="text-center text-sm text-green-600">Password reset link sent! You will be redirected shortly.</p>
                )}
                </CardContent>
                <CardFooter className="flex-col gap-4">
                {!isSubmitted && (
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin"/> : 'Send Reset Link'}
                    </Button>
                )}
                <Link href="/login" passHref>
                  <span className="text-sm font-medium text-primary hover:underline cursor-pointer">
                    Back to Sign In
                  </span>
                </Link>
                </CardFooter>
            </form>
            </Form>
      </Card>
    </div>
  );
}
