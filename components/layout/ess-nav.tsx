'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  User,
  Calendar,
  FileText,
  Clock,
  LogOut,
  Menu
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/lib/supabase/client';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/ess',
    icon: Home,
  },
  {
    title: 'My Profile',
    href: '/ess/profile',
    icon: User,
  },
  {
    title: 'My Leaves',
    href: '/ess/leaves',
    icon: Calendar,
  },
  {
    title: 'My Payslips',
    href: '/ess/payslips',
    icon: FileText,
  },
  {
    title: 'Attendance',
    href: '/ess/attendance',
    icon: Clock,
  },
];

export function EssNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    setOpen(false);
    router.push('/login');
  };

  const NavContent = () => (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
            {item.title}
          </Link>
        );
      })}
      <Button
        variant="ghost"
        className="w-full justify-start text-muted-foreground"
        onClick={handleLogout}
      >
        <LogOut className="mr-3 h-5 w-5" />
        Logout
      </Button>
    </nav>
  );

  return (
    <>
      <div className="hidden md:block">
        <NavContent />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <div className="mb-6">
            <h2 className="text-xl font-bold">Selfy</h2>
            <p className="text-sm text-muted-foreground">
              Employee Self-Service
            </p>
          </div>
          <NavContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
