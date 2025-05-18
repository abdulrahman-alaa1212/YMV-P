
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
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client

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

    // Simulate Admin Login - This part can remain if you have a separate admin login flow
    // Or be removed/adapted if admin login also goes through Supabase
    if (values.email === 'admin' && values.password === 'admin') {
      await new Promise(resolve => setTimeout(resolve, 500)); 
      localStorage.setItem('isAdminAuthenticated', 'true'); 
      window.dispatchEvent(new Event('adminAuthChanged')); 
      setIsLoading(false);
      router.push('/admin');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        throw error;
      }

      // Handle successful login
      // You might want to store user session or redirect
      console.log('Supabase login successful:', data);
      localStorage.removeItem('isAdminAuthenticated'); // Ensure admin flag is cleared
      window.dispatchEvent(new Event('adminAuthChanged'));
      alert('Login successful! Redirecting...');
      router.push('/'); // Redirect to dashboard or home

    } catch (error: any) {
      console.error("Login error:", error);
      setServerError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  } // Corrected end of onSubmit function. The extraneous code block previously here has been removed.

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
} // Corrected end of LoginPage component, ensuring no trailing characters or syntax errors.
