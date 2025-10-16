'use client';

import { useQuery } from '@tanstack/react-query';
import { Calendar, FileText, Clock, Award, TrendingUp, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleProgress } from '@/components/ui/simple-progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { Employee } from '@/lib/types';

export default function EssDashboard() {
  const { user } = useAuthStore();

  const { data: employee, isLoading: employeeLoading } = useQuery({
    queryKey: ['employee-profile', user?.employeeId],
    queryFn: async () => {
      if (!user?.employeeId) return null;

      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', user.employeeId)
        .maybeSingle();

      if (error) throw error;

      return data ? {
        id: data.id,
        employeeNumber: data.employee_number,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone,
        departmentId: data.department_id,
        sectionId: data.section_id,
        positionId: data.position_id,
        managerId: data.manager_id,
        siteId: data.site_id,
        companyId: data.company_id,
        dateOfJoining: data.date_of_joining,
        employmentType: data.employment_type,
        status: data.status,
        profileCompletionPercentage: data.profile_completion_percentage,
      } as Employee : null;
    },
    enabled: !!user?.employeeId,
  });

  const profileCompletion = employee?.profileCompletionPercentage || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your profile
        </p>
      </div>

      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold">Profile Completion</h3>
                <p className="text-sm text-muted-foreground">
                  Complete your profile to unlock all features
                </p>
              </div>
              {profileCompletion === 100 && (
                <Award className="h-8 w-8 text-yellow-500" />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{profileCompletion}% Complete</span>
                {profileCompletion < 100 && (
                  <Button variant="link" size="sm" className="h-auto p-0">
                    Complete Now
                  </Button>
                )}
              </div>
              <SimpleProgress value={profileCompletion} className="h-3" />
            </div>

            {profileCompletion === 100 && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">
                  Congratulations! Your profile is complete!
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Leave Balance
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">
                Days remaining this year
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Latest Payslip
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">Available</div>
              <Button variant="link" size="sm" className="h-auto p-0">
                View Payslips
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Leave Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Annual Leave</span>
                  <span className="text-muted-foreground">10 / 20 days</span>
                </div>
                <SimpleProgress value={50} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Sick Leave</span>
                  <span className="text-muted-foreground">5 / 10 days</span>
                </div>
                <SimpleProgress value={50} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Company Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2 rounded-lg border p-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold leading-tight">
                    Welcome to QuantumHR
                  </h4>
                  <Badge variant="default">medium</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Welcome to your new HR portal. Explore all the features available to you.
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
