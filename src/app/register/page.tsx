
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
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const registerSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
    .regex(/\d/, { message: 'Password must contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ['confirmPassword'], // path of error
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    setServerError(null);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Registration submitted:', values);
    // In a real app, you'd call your auth API (e.g., Firebase createUserWithEmailAndPassword)
    // Example:
    // try {
    //   const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
    //   // Update user profile with fullName if necessary
    //   // await updateProfile(userCredential.user, { displayName: values.fullName });
    //   // Send email verification
    //   // await sendEmailVerification(userCredential.user);
    //   alert('Account created. Please check your email to verify your account.');
    //   router.push('/login'); 
    // } catch (error: any) {
    //   if (error.code === 'auth/email-already-in-use') {
    //     setServerError('This email address is already in use.');
    //   } else {
    //     setServerError('Failed to create account. Please try again.');
    //   }
    //   console.error("Registration error:", error);
    // }
    setIsLoading(false);
    // For demonstration:
    alert('Account created successfully (simulated). Please login. (In a real app, email verification would be sent).');
    router.push('/login');
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Create Your Account</CardTitle>
          <CardDescription className="text-lg">
            Join Yura Mid-Vision to revolutionize your healthcare services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-md"><User className="mr-2 h-4 w-4 text-primary" />Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Dr. Jane Doe" {...field} className="text-base" />
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
                    <FormLabel className="flex items-center text-md"><Mail className="mr-2 h-4 w-4 text-primary" />Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} className="text-base"/>
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
                      <Input type="password" placeholder="••••••••" {...field} className="text-base"/>
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
                    <FormLabel className="flex items-center text-md"><Lock className="mr-2 h-4 w-4 text-primary" />Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="text-base"/>
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
                  <UserPlus className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 h-5 w-5" />
                )}
                Create Account
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" legacyBehavior>
              <a className="font-medium text-primary hover:underline">Sign in</a>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
