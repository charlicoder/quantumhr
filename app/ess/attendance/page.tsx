'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, Calendar, LogIn, LogOut as LogOutIcon, TrendingUp } from 'lucide-react';
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
import { useAuthStore } from '@/lib/stores/auth-store';
import { toast } from 'sonner';

export default function AttendancePage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const { data: attendanceRecords, isLoading } = useQuery({
    queryKey: ['attendance-records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;
      return data;
    },
  });

  const { data: todayRecord } = useQuery({
    queryKey: ['today-attendance'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const checkInMutation = useMutation({
    mutationFn: async () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];

      const { error } = await supabase.from('attendance_records').insert({
        employee_id: user?.employeeId || '00000000-0000-0000-0000-000000000001',
        employee_name: `${user?.firstName} ${user?.lastName}` || 'John Doe',
        date: today,
        check_in: now.toISOString(),
        status: 'present',
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Checked in successfully');
      queryClient.invalidateQueries({ queryKey: ['attendance-records'] });
      queryClient.invalidateQueries({ queryKey: ['today-attendance'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to check in');
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: async () => {
      if (!todayRecord) throw new Error('No check-in record found');

      const now = new Date();
      const checkIn = new Date(todayRecord.check_in);
      const hoursWorked = (now.getTime() - checkIn.getTime()) / (1000 * 60 * 60);

      const { error } = await supabase
        .from('attendance_records')
        .update({
          check_out: now.toISOString(),
          hours_worked: hoursWorked.toFixed(2),
        })
        .eq('id', todayRecord.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Checked out successfully');
      queryClient.invalidateQueries({ queryKey: ['attendance-records'] });
      queryClient.invalidateQueries({ queryKey: ['today-attendance'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to check out');
    },
  });

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      await checkInMutation.mutateAsync();
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setIsCheckingOut(true);
    try {
      await checkOutMutation.mutateAsync();
    } finally {
      setIsCheckingOut(false);
    }
  };

  const stats = {
    totalDays: attendanceRecords?.length || 0,
    presentDays: attendanceRecords?.filter(r => r.status === 'present').length || 0,
    avgHours: attendanceRecords
      ? (attendanceRecords.reduce((sum, r) => sum + (parseFloat(r.hours_worked) || 0), 0) / attendanceRecords.length).toFixed(1)
      : '0',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Attendance</h1>
        <p className="text-muted-foreground">
          Track your attendance and working hours
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              {todayRecord ? (
                <>
                  <div className="flex items-center gap-2">
                    <LogIn className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Check In</p>
                      <p className="text-2xl font-bold">
                        {new Date(todayRecord.check_in).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  {todayRecord.check_out && (
                    <div className="flex items-center gap-2">
                      <LogOutIcon className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="text-sm font-medium">Check Out</p>
                        <p className="text-2xl font-bold">
                          {new Date(todayRecord.check_out).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                  {todayRecord.hours_worked && (
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground">
                        Hours worked: <span className="font-semibold">{parseFloat(todayRecord.hours_worked).toFixed(1)}h</span>
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">You haven&apos;t checked in today</p>
              )}
            </div>

            <div className="flex gap-2">
              {!todayRecord ? (
                <Button onClick={handleCheckIn} disabled={isCheckingIn} size="lg">
                  <LogIn className="mr-2 h-5 w-5" />
                  {isCheckingIn ? 'Checking In...' : 'Check In'}
                </Button>
              ) : !todayRecord.check_out ? (
                <Button onClick={handleCheckOut} disabled={isCheckingOut} variant="destructive" size="lg">
                  <LogOutIcon className="mr-2 h-5 w-5" />
                  {isCheckingOut ? 'Checking Out...' : 'Check Out'}
                </Button>
              ) : (
                <Badge variant="secondary" className="px-4 py-2 text-base">
                  Completed for Today
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDays}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Days</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.presentDays}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalDays > 0 ? ((stats.presentDays / stats.totalDays) * 100).toFixed(0) : 0}% attendance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Hours/Day</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgHours}h</div>
            <p className="text-xs text-muted-foreground">Average working hours</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
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
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Hours Worked</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!attendanceRecords || attendanceRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No attendance records found
                    </TableCell>
                  </TableRow>
                ) : (
                  attendanceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        {new Date(record.check_in).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>
                        {record.check_out
                          ? new Date(record.check_out).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {record.hours_worked ? `${parseFloat(record.hours_worked).toFixed(1)}h` : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.status === 'present' ? 'default' : 'secondary'}>
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
