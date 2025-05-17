"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Home, ClipboardCheck, List, Bot } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/diagnostic', label: 'Diagnostic Tool', icon: ClipboardCheck },
  { href: '/providers', label: 'Providers', icon: List },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
          <Bot className="h-8 w-8" />
          <h1 className="text-xl font-bold">AR/MR Advisor</h1>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {navItems.map((item) => {
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
        </nav>
      </div>
    </header>
  );
}
