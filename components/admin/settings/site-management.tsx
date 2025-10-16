'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Building2, MapPin, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { Site } from '@/lib/types';

export function SiteManagement() {
  const { token } = useAuthStore();
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  const { data: sites, isLoading } = useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      apiClient.setToken(token);
      return apiClient.get<Site[]>('/sites');
    },
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Site Management</CardTitle>
            <CardDescription>
              Manage your organization's physical locations and sites
            </CardDescription>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Site
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {sites && sites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No sites configured</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Add your first site to get started
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Site
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sites?.map((site) => (
              <Card key={site.id} className="cursor-pointer transition-colors hover:bg-accent">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{site.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Code: {site.code}
                        </p>
                      </div>
                      {site.isHeadquarters && (
                        <Badge variant="default">Headquarters</Badge>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {site.address}
                        </span>
                      </div>
                      {site.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {site.phone}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        disabled={site.isHeadquarters}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
