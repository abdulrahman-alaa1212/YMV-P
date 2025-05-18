
"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Added useRouter
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Home, ClipboardCheck, List, ShieldCheck, LogIn, LogOut } from 'lucide-react'; // Added LogOut
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Added supabase client

const mainNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/diagnostic', label: 'Diagnostic Tool', icon: ClipboardCheck },
  { href: '/providers', label: 'Providers', icon: List },
];

const authNavItems = [
  { href: '/login', label: 'Login', icon: LogIn },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter(); // Added router instance
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isSupabaseUserLoggedIn, setIsSupabaseUserLoggedIn] = useState(false); // State for Supabase user

  useEffect(() => {
    const checkAdminStatus = () => {
      const adminAuth = localStorage.getItem('isAdminAuthenticated');
      setIsAdminLoggedIn(adminAuth === 'true');
    };

    const checkSupabaseUserStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsSupabaseUserLoggedIn(!!session);
    };

    checkAdminStatus();
    checkSupabaseUserStatus();

    window.addEventListener('storage', checkAdminStatus);
    const handleAdminAuthChange = () => {
        checkAdminStatus();
    };
    window.addEventListener('adminAuthChanged', handleAdminAuthChange);

    // Listen for Supabase auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsSupabaseUserLoggedIn(!!session);
      // If user logs out, and was admin, clear admin state too
      if (event === 'SIGNED_OUT' && isAdminLoggedIn) {
        localStorage.removeItem('isAdminAuthenticated');
        setIsAdminLoggedIn(false);
        window.dispatchEvent(new Event('adminAuthChanged'));
      }
    });

    return () => {
      window.removeEventListener('storage', checkAdminStatus);
      window.removeEventListener('adminAuthChanged', handleAdminAuthChange);
      authListener?.subscription.unsubscribe(); // Unsubscribe from Supabase auth listener
    };
  }, [isAdminLoggedIn]); // Added isAdminLoggedIn to dependency array

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      // Optionally show an error message to the user
    } else {
      // Clear admin state if it was set, as Supabase logout should be primary
      if (localStorage.getItem('isAdminAuthenticated')) {
        localStorage.removeItem('isAdminAuthenticated');
        window.dispatchEvent(new Event('adminAuthChanged'));
      }
      setIsSupabaseUserLoggedIn(false); // Update state immediately
      router.push('/login'); // Redirect to login page
    }
  };

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
          <Image src="/yura-1.png" alt="Yura Mid-Vision Logo" width={32} height={32} className="h-8 w-8 dark:bg-slate-100 dark:p-0.5 dark:rounded-sm" />
          <h1 className="text-xl font-bold">Yura Mid-Vision</h1>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} legacyBehavior passHref>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    "text-sm font-medium",
                    isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="mr-0 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            );
          })}
          {isAdminLoggedIn && (
            <Link href="/admin" legacyBehavior passHref>
              <Button
                variant={pathname === '/admin' ? 'default' : 'ghost'}
                className={cn(
                  "text-sm font-medium",
                  pathname === '/admin' ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <ShieldCheck className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </Link>
          )}
          {!isSupabaseUserLoggedIn && !isAdminLoggedIn && authNavItems.map((item) => { // Conditionally render login if no user/admin
            const isActive = pathname === item.href || (item.href === '/login' && (pathname === '/register' || pathname === '/forgot-password'));
            return (
              <Link key={item.href} href={item.href} legacyBehavior passHref>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    "text-sm font-medium",
                    isActive ? "bg-secondary text-secondary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="mr-0 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            );
          })}
          {isSupabaseUserLoggedIn && (
            <Button
              variant={'ghost'}
              className={cn(
                "text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={handleLogout}
            >
              <LogOut className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
