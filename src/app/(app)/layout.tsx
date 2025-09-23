'use client';
import { useAuth } from '@/hooks/useAuth';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app/app-sidebar';
import { AppHeader } from '@/components/app/app-header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isPublic } = useAuth();

  if (isPublic) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
