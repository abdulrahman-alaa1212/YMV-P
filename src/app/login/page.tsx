
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
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LogIn, Mail, Lock } from 'lucide-react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  rememberMe: z.boolean().default(false).optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    setServerError(null);

    // Simulate Admin Login
    if (values.email === 'admin' && values.password === 'admin') {
      await new Promise(resolve => setTimeout(resolve, 500)); // Short delay for simulation
      localStorage.setItem('isAdminAuthenticated', 'true'); // Set admin auth flag
      window.dispatchEvent(new Event('adminAuthChanged')); // Notify navbar
      setIsLoading(false);
      router.push('/admin');
      return;
    }

    // Simulate regular API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Login submitted:', values);
    // In a real app, you'd call your auth API here.
    // Example with Firebase:
    // try {
    //   if (values.rememberMe) {
    //     await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    //   } else {
    //     await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
    //   }
    //   const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
    //   if (userCredential.user) {
    //      router.push('/'); // Redirect to dashboard or home
    //   }
    // } catch (error: any) {
    //   if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
    //     setServerError("Invalid email or password.");
    //   } else if (error.code === 'auth/too-many-requests') {
    //     setServerError("Too many failed login attempts. Please try again later or reset your password.");
    //   }
    //   else {
    //     setServerError("An unexpected error occurred. Please try again.");
    //   }
    //   console.error("Login error:", error);
    // }
    setIsLoading(false);
    // For demonstration, let's assume login is successful for regular users
    localStorage.removeItem('isAdminAuthenticated'); // Ensure admin flag is cleared for non-admin logins
    window.dispatchEvent(new Event('adminAuthChanged')); // Notify navbar
    alert('Login successful (simulated for regular user). Redirecting...');
    router.push('/'); 
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Welcome Back!</CardTitle>
          <CardDescription className="text-lg">
            Sign in to access your Yura Mid-Vision account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-md"><Mail className="mr-2 h-4 w-4 text-primary" />Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com or 'admin'" {...field} className="text-base"/>
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
                    <FormLabel className="flex items-center text-md"><Lock className="mr-2 h-4 w-4 text-primary" />Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="•••••••• or 'admin'" {...field} className="text-base"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />


              {serverError && (
                <p className="text-sm font-medium text-destructive">{serverError}</p>
              )}

              <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
                {isLoading ? (
                  <LogIn className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-5 w-5" />
                )}
                Sign In
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            <Link href="/forgot-password" legacyBehavior>
              <a className="font-medium text-primary hover:underline">Forgot your password?</a>
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" legacyBehavior>
              <a className="font-medium text-primary hover:underline">Create one now</a>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
