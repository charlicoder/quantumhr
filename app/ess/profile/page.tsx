'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Edit, Mail, Phone, MapPin, Briefcase, Calendar, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/stores/auth-store';
import { RequestEditDialog } from '@/components/ess/request-edit-dialog';
import type { Employee } from '@/lib/types';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: employee, isLoading } = useQuery({
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
        departmentId: data.department_id || 'Human Resources',
        sectionId: data.section_id,
        positionId: data.position_id || 'Employee',
        managerId: data.manager_id,
        siteId: data.site_id || 'Main Office',
        companyId: data.company_id,
        dateOfJoining: data.date_of_joining,
        employmentType: data.employment_type,
        status: data.status,
        profileCompletionPercentage: data.profile_completion_percentage,
      } as Employee : null;
    },
    enabled: !!user?.employeeId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!employee) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Profile information not available
          </p>
        </CardContent>
      </Card>
    );
  }

  const userInitials = `${employee.firstName[0]}${employee.lastName[0]}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">My Profile</h1>
        <Button onClick={() => setEditDialogOpen(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Request Edit
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600" />
        <CardContent className="relative pt-16">
          <Avatar className="absolute -top-16 left-6 h-32 w-32 border-4 border-background">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-3xl">{userInitials}</AvatarFallback>
          </Avatar>

          <div className="ml-40 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">
                {employee.firstName} {employee.lastName}
              </h2>
              <p className="text-muted-foreground">{employee.positionId}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                ID: {employee.employeeNumber}
              </Badge>
              <Badge
                variant={
                  employee.status === 'active'
                    ? 'default'
                    : 'secondary'
                }
              >
                {employee.status}
              </Badge>
              <Badge variant="outline">
                {employee.employmentType}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{employee.email}</p>
              </div>
            </div>

            {employee.phone && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{employee.phone}</p>
                  </div>
                </div>
              </>
            )}

            {employee.personalInfo?.emergencyContact && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Emergency Contact</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.personalInfo.emergencyContact.name} (
                      {employee.personalInfo.emergencyContact.relationship})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {employee.personalInfo.emergencyContact.phone}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Briefcase className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Department</p>
                <p className="text-sm text-muted-foreground">
                  {employee.departmentId}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Work Site</p>
                <p className="text-sm text-muted-foreground">{employee.siteId}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Date of Joining</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(employee.dateOfJoining).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {employee.managerId && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <Briefcase className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Reports To</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.managerId}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {employee.personalInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {employee.personalInfo.dateOfBirth && (
                <div className="flex justify-between">
                  <p className="text-sm font-medium">Date of Birth</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(employee.personalInfo.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
              )}

              {employee.personalInfo.gender && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Gender</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.personalInfo.gender}
                    </p>
                  </div>
                </>
              )}

              {employee.personalInfo.maritalStatus && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Marital Status</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.personalInfo.maritalStatus}
                    </p>
                  </div>
                </>
              )}

              {employee.personalInfo.nationality && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Nationality</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.personalInfo.nationality}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <RequestEditDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} />
    </div>
  );
}
