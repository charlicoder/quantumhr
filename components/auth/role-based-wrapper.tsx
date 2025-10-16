'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import type { UserRole } from '@/lib/types';

interface RoleBasedWrapperProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  resource?: string;
  action?: 'create' | 'read' | 'update' | 'delete';
  fallback?: React.ReactNode;
}

export function RoleBasedWrapper({
  children,
  allowedRoles,
  resource,
  action,
  fallback = null,
}: RoleBasedWrapperProps) {
  const { user, hasPermission } = useAuthStore();

  if (!user) {
    return <>{fallback}</>;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  if (resource && action && !hasPermission(resource, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
