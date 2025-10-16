'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase/client';
import { ApplyLeaveDialog } from '@/components/ess/apply-leave-dialog';

export default function LeavesPage() {
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);

  const { data: leaveRequests, isLoading } = useQuery({
    queryKey: ['leave-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .order('applied_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: leaveBalance } = useQuery({
    queryKey: ['leave-balance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_types')
        .select('*');

      if (error) throw error;
      return data;
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">My Leaves</h1>
          <p className="text-muted-foreground">
            View and manage your leave requests
          </p>
        </div>
        <Button onClick={() => setApplyDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Apply for Leave
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {leaveBalance?.map((leave) => {
          const used = leaveRequests?.filter(
            req => req.leave_type_name === leave.name && req.status === 'approved'
          ).reduce((sum, req) => sum + req.days_count, 0) || 0;

          const remaining = leave.days_allowed - used;

          return (
            <Card key={leave.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{leave.name}</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{remaining}</div>
                <p className="text-xs text-muted-foreground">
                  of {leave.days_allowed} days remaining
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
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
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!leaveRequests || leaveRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No leave requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  leaveRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          {request.leave_type_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(request.start_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(request.end_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{request.days_count}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {request.reason || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {new Date(request.applied_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ApplyLeaveDialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen} />
    </div>
  );
}
