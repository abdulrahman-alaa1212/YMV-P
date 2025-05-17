
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Settings, LayoutList, FileText } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="space-y-8 py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Admin Dashboard</CardTitle>
          <CardDescription className="text-lg">
            Manage your Yura Mid-Vision application settings and content.
          </CardDescription>
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
              {/* <Link href="/admin/providers" passHref>
                <Button>Go to Provider Management</Button>
              </Link> */}
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
               {/* <Link href="/admin/content" passHref>
                <Button>Go to Content Management</Button>
              </Link> */}
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
              {/* <Link href="/admin/settings" passHref>
                <Button>Go to Site Settings</Button>
              </Link> */}
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
