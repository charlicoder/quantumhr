import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { Permission } from '@/lib/types';

export function usePermissions() {
  const { user, token, setPermissions } = useAuthStore();

  return useQuery({
    queryKey: ['permissions', user?.id],
    queryFn: async () => {
      if (!user?.id || !token) {
        throw new Error('User not authenticated');
      }

      apiClient.setToken(token);
      const permissions = await apiClient.get<Permission[]>(
        `/auth/permissions/${user.id}`
      );

      setPermissions(permissions);
      return permissions;
    },
    enabled: !!user?.id && !!token,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
