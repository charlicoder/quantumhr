'use client';

import { useQuery } from '@tanstack/react-query';
import { Users, UserCheck, Clock, AlertCircle, TrendingUp, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { DashboardStats, Activity } from '@/lib/types';
import { RoleBasedWrapper } from '@/components/auth/role-based-wrapper';

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { count: empCount } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true });

      const { count: deptCount } = await supabase
        .from('departments')
        .select('*', { count: 'exact', head: true });

      return {
        totalEmployees: empCount || 3,
        activeEmployees: empCount || 3,
        pendingLeaveRequests: 2,
        pendingApprovals: 5,
        newHiresThisMonth: 1,
        departmentCount: deptCount || 3,
      } as DashboardStats;
    },
  });

  const activities: Activity[] = [
    {
      id: '1',
      type: 'employee_added',
      description: 'New employee John Doe added to Engineering department',
      timestamp: new Date().toISOString(),
      userId: '1',
      userName: 'Admin User',
    },
    {
      id: '2',
      type: 'leave_request',
      description: 'Leave request submitted by Jane Smith',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      userId: '2',
      userName: 'Jane Smith',
    },
  ];

  const activitiesLoading = false;

  const statCards = [
    {
      title: 'Total Employees',
      value: stats?.totalEmployees ?? 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Employees',
      value: stats?.activeEmployees ?? 0,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pending Leave Requests',
      value: stats?.pendingLeaveRequests ?? 0,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Pending Approvals',
      value: stats?.pendingApprovals ?? 0,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'New Hires This Month',
      value: stats?.newHiresThisMonth ?? 0,
      icon: TrendingUp,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
    },
    {
      title: 'Total Departments',
      value: stats?.departmentCount ?? 0,
      icon: Building2,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your HR operations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-full p-2 ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <RoleBasedWrapper allowedRoles={['super_admin', 'hr_admin']}>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Add New Employee
              </Button>
            </RoleBasedWrapper>
            <RoleBasedWrapper allowedRoles={['super_admin', 'hr_admin']}>
              <Button className="w-full justify-start" variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Review Leave Requests
              </Button>
            </RoleBasedWrapper>
            <RoleBasedWrapper allowedRoles={['super_admin', 'payroll_admin']}>
              <Button className="w-full justify-start" variant="outline">
                Process Payroll
              </Button>
            </RoleBasedWrapper>
            <RoleBasedWrapper allowedRoles={['super_admin']}>
              <Button className="w-full justify-start" variant="outline">
                <Building2 className="mr-2 h-4 w-4" />
                Manage Organization
              </Button>
            </RoleBasedWrapper>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {activities?.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No recent activities
                  </p>
                ) : (
                  activities?.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="leading-tight">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.userName} • {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
