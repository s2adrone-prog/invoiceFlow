
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

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

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
        const actionCodeSettings = {
            url: `${window.location.origin}/`,
            handleCodeInApp: true,
        };
        await sendSignInLinkToEmail(auth, values.email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', values.email);
        setIsSubmitted(true);
        toast({
            title: 'Check your email',
            description: `A sign-in link has been sent to ${values.email}.`,
        });
    } catch (error: any) {
        toast({
            title: 'Error',
            description: 'Could not send sign-in link. Please try again.',
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
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            {isSubmitted 
              ? "Check your email for a magic link to sign in."
              : "Enter your email below to receive a sign-in link."
            }
          </CardDescription>
        </CardHeader>
        {!isSubmitted ? (
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
                </CardContent>
                <CardFooter className="flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin"/> : 'Send Sign-In Link'}
                </Button>
                </CardFooter>
            </form>
            </Form>
        ) : (
            <CardContent>
                <p className="text-center text-sm text-muted-foreground">You can close this tab.</p>
            </CardContent>
        )}
      </Card>
    </div>
  );
}
