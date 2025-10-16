'use client';

import { useQuery } from '@tanstack/react-query';
import { Plus, Building, FolderTree } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { Department, Section } from '@/lib/types';

export function OrganizationStructure() {
  const { token } = useAuthStore();

  const { data: departments, isLoading: departmentsLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      apiClient.setToken(token);
      return apiClient.get<Department[]>('/departments');
    },
    enabled: !!token,
  });

  const { data: sections, isLoading: sectionsLoading } = useQuery({
    queryKey: ['sections'],
    queryFn: async () => {
      apiClient.setToken(token);
      return apiClient.get<Section[]>('/sections');
    },
    enabled: !!token,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Structure</CardTitle>
        <CardDescription>
          Manage your organization's departments and sections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="departments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
          </TabsList>

          <TabsContent value="departments" className="space-y-4">
            <div className="flex justify-end">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Department
              </Button>
            </div>

            {departmentsLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : departments && departments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Building className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  No departments configured
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Create departments to organize your workforce
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Department
                </Button>
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
                  {departments?.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>{dept.code}</TableCell>
                      <TableCell>
                        {dept.managerId || 'Not assigned'}
                      </TableCell>
                      <TableCell>{dept.employeeCount}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="sections" className="space-y-4">
            <div className="flex justify-end">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Section
              </Button>
            </div>

            {sectionsLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : sections && sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FolderTree className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  No sections configured
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Create sections within departments for better organization
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Section
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Section Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sections?.map((section) => (
                    <TableRow key={section.id}>
                      <TableCell className="font-medium">
                        {section.name}
                      </TableCell>
                      <TableCell>{section.code}</TableCell>
                      <TableCell>{section.departmentId}</TableCell>
                      <TableCell>
                        {section.managerId || 'Not assigned'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
