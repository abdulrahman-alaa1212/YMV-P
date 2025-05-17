
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Home, ClipboardCheck, List, ShieldCheck, LogIn } from 'lucide-react';
import React, { useState, useEffect } from 'react';

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
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const checkAdminStatus = () => {
      const adminAuth = localStorage.getItem('isAdminAuthenticated');
      setIsAdminLoggedIn(adminAuth === 'true');
    };

    checkAdminStatus(); // Check on initial load

    // Listen for storage changes to update status if login/logout happens in another tab/window
    window.addEventListener('storage', checkAdminStatus);

    // Listen for a custom event that can be dispatched from the login/logout pages
    // This helps update the navbar immediately without a page reload
    const handleAdminAuthChange = () => {
        checkAdminStatus();
    };
    window.addEventListener('adminAuthChanged', handleAdminAuthChange);


    return () => {
      window.removeEventListener('storage', checkAdminStatus);
      window.removeEventListener('adminAuthChanged', handleAdminAuthChange);
    };
  }, []);

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
          {authNavItems.map((item) => {
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
        </nav>
      </div>
    </header>
  );
}
