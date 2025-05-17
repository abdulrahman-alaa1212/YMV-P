
"use client";

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Send } from 'lucide-react';
import React, { useState } from 'react';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsLoading(true);
    setServerError(null);
    setIsSuccess(false);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Forgot password submitted for:', values.email);
    // In a real app, you'd call your auth API (e.g., Firebase sendPasswordResetEmail)
    // Example:
    // try {
    //   await sendPasswordResetEmail(auth, values.email);
    //   setIsSuccess(true);
    // } catch (error: any) {
    //   if (error.code === 'auth/user-not-found') {
    //     setServerError('No user found with this email address.');
    //   } else {
    //     setServerError('Failed to send password reset email. Please try again.');
    //   }
    //   console.error("Forgot password error:", error);
    // }
    setIsLoading(false);
    // For demonstration:
    setIsSuccess(true);
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Reset Your Password</CardTitle>
          <CardDescription className="text-lg">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center space-y-4">
              <Send className="h-12 w-12 text-green-500 mx-auto" />
              <p className="text-lg font-medium">Password reset link sent!</p>
              <p className="text-muted-foreground">
                Please check your email inbox (and spam folder) for instructions to reset your password.
              </p>
              <Button asChild className="w-full text-lg py-6">
                <Link href="/login">Back to Sign In</Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-md"><Mail className="mr-2 h-4 w-4 text-primary" />Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} className="text-base"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {serverError && (
                  <p className="text-sm font-medium text-destructive">{serverError}</p>
                )}
                <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
                  {isLoading ? (
                    <Send className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-5 w-5" />
                  )}
                  Send Reset Link
                </Button>
              </form>
            </Form>
          )}
          {!isSuccess && (
            <div className="mt-6 text-center text-sm">
              Remember your password?{' '}
              <Link href="/login" legacyBehavior>
                <a className="font-medium text-primary hover:underline">Sign in</a>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
