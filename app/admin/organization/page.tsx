'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Building, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase/client';
import { AddDepartmentDialog } from '@/components/admin/organization/add-department-dialog';
import type { Department } from '@/lib/types';

export default function OrganizationPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) throw error;

      return data?.map(dept => ({
        id: dept.id,
        name: dept.name,
        code: dept.code,
        managerId: dept.manager_id,
        companyId: dept.company_id,
        employeeCount: 0,
      })) as Department[];
    },
  });

  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*');

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization Structure</h1>
          <p className="text-muted-foreground">
            Manage your organization's structure and hierarchy
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {companies && companies.length > 0 ? (
              <div className="space-y-4">
                {companies.map((company) => (
                  <div key={company.id} className="rounded-lg border p-4">
                    <h3 className="font-semibold">{company.name}</h3>
                    <p className="text-sm text-muted-foreground">Code: {company.code}</p>
                    <p className="text-sm text-muted-foreground">{company.address}</p>
                    <p className="text-sm text-muted-foreground">{company.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No company information available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Department Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Departments</span>
                <span className="text-2xl font-bold">{departments?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Employees</span>
                <span className="text-2xl font-bold">
                  {departments?.reduce((acc, d) => acc + d.employeeCount, 0) || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No departments found
                    </TableCell>
                  </TableRow>
                ) : (
                  departments?.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>{dept.code}</TableCell>
                      <TableCell>{dept.managerId || 'Not assigned'}</TableCell>
                      <TableCell>{dept.employeeCount}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddDepartmentDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </div>
  );
}
