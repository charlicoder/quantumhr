'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { Company } from '@/lib/types';

const companySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  code: z.string().min(2, 'Company code is required'),
  taxId: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export function CompanySetup() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      apiClient.setToken(token);
      return apiClient.get<Company[]>('/companies');
    },
    enabled: !!token,
  });

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: companies?.[0]?.name || '',
      code: companies?.[0]?.code || '',
      taxId: companies?.[0]?.taxId || '',
      address: companies?.[0]?.address || '',
      phone: companies?.[0]?.phone || '',
      email: companies?.[0]?.email || '',
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CompanyFormValues) => {
      apiClient.setToken(token);
      return apiClient.post('/companies', data);
    },
    onSuccess: () => {
      toast.success('Company created successfully');
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      form.reset();
    },
    onError: () => {
      toast.error('Failed to create company');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: CompanyFormValues) => {
      apiClient.setToken(token);
      return apiClient.put(`/companies/${companies?.[0]?.id}`, data);
    },
    onSuccess: () => {
      toast.success('Company updated successfully');
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
    onError: () => {
      toast.error('Failed to update company');
    },
  });

  const onSubmit = (data: CompanyFormValues) => {
    if (companies && companies.length > 0) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>
          Configure your company details and contact information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corporation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Code</FormLabel>
                    <FormControl>
                      <Input placeholder="ACME" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax ID</FormLabel>
                    <FormControl>
                      <Input placeholder="123-45-6789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="contact@acme.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="123 Business Ave, Suite 100, City, State 12345"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {companies && companies.length > 0 ? 'Update' : 'Create'} Company
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
