'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  FileText,
  Calendar,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RoleBasedWrapper } from '@/components/auth/role-based-wrapper';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles?: Array<'super_admin' | 'hr_admin' | 'payroll_admin'>;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Employees',
    href: '/admin/employees',
    icon: Users,
    allowedRoles: ['super_admin', 'hr_admin'],
  },
  {
    title: 'Organization',
    href: '/admin/organization',
    icon: Building2,
    allowedRoles: ['super_admin', 'hr_admin'],
  },
  {
    title: 'Leave Management',
    href: '/admin/leave',
    icon: Calendar,
    allowedRoles: ['super_admin', 'hr_admin'],
  },
  {
    title: 'Payroll',
    href: '/admin/payroll',
    icon: DollarSign,
    allowedRoles: ['super_admin', 'payroll_admin'],
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: BarChart3,
  },
  {
    title: 'Documents',
    href: '/admin/documents',
    icon: FileText,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    allowedRoles: ['super_admin'],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold">QuantumHR</h1>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <RoleBasedWrapper key={item.href} allowedRoles={item.allowedRoles}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Link>
              </RoleBasedWrapper>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
