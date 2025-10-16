'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, Calendar, Briefcase, MapPin } from 'lucide-react';
import type { Employee } from '@/lib/types';

interface ViewEmployeeDialogProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewEmployeeDialog({ employee, open, onOpenChange }: ViewEmployeeDialogProps) {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {employee.firstName} {employee.lastName}
              </h2>
              <p className="text-muted-foreground">{employee.positionId}</p>
            </div>
            <Badge
              variant={
                employee.status === 'active'
                  ? 'default'
                  : employee.status === 'inactive'
                  ? 'secondary'
                  : 'destructive'
              }
            >
              {employee.status}
            </Badge>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold">Contact Information</h3>

              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{employee.email}</p>
                </div>
              </div>

              {employee.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{employee.phone}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Employment Details</h3>

              <div className="flex items-start gap-3">
                <Briefcase className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Employee Number</p>
                  <p className="text-sm text-muted-foreground">{employee.employeeNumber}</p>
                </div>
              </div>

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
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Organization</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium">Department</p>
                <p className="text-sm text-muted-foreground">{employee.departmentId}</p>
              </div>

              {employee.sectionId && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Section</p>
                  <p className="text-sm text-muted-foreground">{employee.sectionId}</p>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-sm font-medium">Site</p>
                <p className="text-sm text-muted-foreground">{employee.siteId}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Employment Type</p>
                <Badge variant="outline">{employee.employmentType}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Profile Completion</span>
              <span className="text-muted-foreground">
                {employee.profileCompletionPercentage}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${employee.profileCompletionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
