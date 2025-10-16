'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase/client';
import { AddEmployeeDialog } from '@/components/admin/employees/add-employee-dialog';
import { ViewEmployeeDialog } from '@/components/admin/employees/view-employee-dialog';
import type { Employee } from '@/lib/types';

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(emp => ({
        id: emp.id,
        employeeNumber: emp.employee_number,
        firstName: emp.first_name,
        lastName: emp.last_name,
        email: emp.email,
        phone: emp.phone,
        departmentId: emp.department_id || 'Not Assigned',
        sectionId: emp.section_id,
        positionId: emp.position_id || 'Not Assigned',
        managerId: emp.manager_id,
        siteId: emp.site_id,
        companyId: emp.company_id,
        dateOfJoining: emp.date_of_joining,
        employmentType: emp.employment_type,
        status: emp.status,
        profileCompletionPercentage: emp.profile_completion_percentage,
      })) as Employee[];
    },
  });

  const filteredEmployees = employees?.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'terminated':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage your organization's employees
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search employees by name, ID, or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
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
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No employees found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees?.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        {employee.employeeNumber}
                      </TableCell>
                      <TableCell>
                        {employee.firstName} {employee.lastName}
                      </TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.departmentId}</TableCell>
                      <TableCell>{employee.positionId}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(employee.status)}>
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(employee.dateOfJoining).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setViewDialogOpen(true);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddEmployeeDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <ViewEmployeeDialog
        employee={selectedEmployee}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </div>
  );
}
