'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { useAuthStore } from '@/lib/stores/auth-store';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@/lib/types';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', data.email)
        .maybeSingle();

      if (error || !userData) {
        toast.error('Invalid email or password');
        return;
      }

      if (data.password !== 'password123') {
        toast.error('Invalid email or password');
        return;
      }

      const user: User = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        employeeId: userData.employee_id,
        firstName: userData.first_name,
        lastName: userData.last_name,
        avatar: userData.avatar,
      };

      setAuth(user, 'demo-token-' + userData.id);

      toast.success('Login successful!');

      if (
        user.role === 'super_admin' ||
        user.role === 'hr_admin' ||
        user.role === 'payroll_admin'
      ) {
        router.push('/admin');
      } else {
        router.push('/ess');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">QuantumHR</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@company.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <Button variant="link" className="text-muted-foreground">
              Forgot password?
            </Button>
          </div>

          <div className="mt-6 rounded-lg bg-muted p-4 text-sm">
            <p className="mb-2 font-medium">Demo Credentials:</p>
            <p className="text-muted-foreground">
              Admin: admin@quantumhr.com / password123
            </p>
            <p className="text-muted-foreground">
              Employee: employee@quantumhr.com / password123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
