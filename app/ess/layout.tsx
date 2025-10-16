'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { usePermissions } from '@/hooks/use-permissions';
import { EssNav } from '@/components/layout/ess-nav';
import { AiAssistantWidget } from '@/components/layout/ai-assistant-widget';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function EssLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  usePermissions();

  const userInitials = user
    ? `${user.firstName[0]}${user.lastName[0]}`
    : 'U';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <EssNav />
            </div>
            <div>
              <h1 className="text-xl font-bold">Selfy</h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Employee Self-Service
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Avatar>
              <AvatarImage src={user?.avatar} alt={user?.firstName} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl">
        <div className="flex gap-6 p-4 md:p-6">
          <aside className="hidden w-64 md:block">
            <div className="sticky top-20 space-y-4">
              <EssNav />
            </div>
          </aside>

          <main className="flex-1">{children}</main>
        </div>
      </div>

      <AiAssistantWidget />
    </div>
  );
}
