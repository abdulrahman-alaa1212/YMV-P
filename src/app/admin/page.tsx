
"use client"; 

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, LayoutList, FileText, LogOut } from 'lucide-react';
import { Loader2 } from 'lucide-react'; 

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const adminAuth = localStorage.getItem('isAdminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    } else {
      router.push('/login'); 
    }
    setIsLoading(false); 
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    window.dispatchEvent(new Event('adminAuthChanged')); // Notify navbar
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-10">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-6" />
        <p className="text-xl font-semibold text-primary">Verifying access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // This ideally should not be reached if redirect works, but as a fallback
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-10">
            <p className="text-xl font-semibold text-destructive">Access Denied.</p>
            <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-3xl font-bold text-primary">Admin Dashboard</CardTitle>
            <CardDescription className="text-lg">
              Manage your Yura Mid-Vision application settings and content.
            </CardDescription>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <LayoutList className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Manage Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 min-h-[60px]">
                Add, edit, or remove AR/MR solution providers from the directory.
              </p>
              <Button disabled className="w-full">Go to Provider Management (Soon)</Button>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Manage Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 min-h-[60px]">
                Update text and images on the landing page and other informational sections.
              </p>
              <Button disabled className="w-full">Go to Content Management (Soon)</Button>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <Settings className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Site Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 min-h-[60px]">
                Configure general site settings, themes, or integrations.
              </p>
              <Button disabled className="w-full">Go to Site Settings (Soon)</Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
       <p className="text-center text-muted-foreground pt-4">
        Note: This is a basic admin dashboard. A real-world implementation would require robust authentication and dedicated interfaces for each management task.
      </p>
    </div>
  );
}
