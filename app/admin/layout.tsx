'use client';

import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { AdminHeader } from '@/components/layout/admin-header';
import { usePermissions } from '@/hooks/use-permissions';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  usePermissions();

  return (
    <div className="min-h-screen bg-muted/40">
      <AdminSidebar />
      <div className="pl-64">
        <AdminHeader />
        <main className="pt-16">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
