'use client';

import { useQuery } from '@tanstack/react-query';
import { FileText, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { Payslip } from '@/lib/types';

export default function PayslipsPage() {
  const payslips: Payslip[] = [];
  const isLoading = false;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">My Payslips</h1>
        <p className="text-muted-foreground">
          View and download your salary payslips
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : payslips && payslips.length > 0 ? (
        <div className="space-y-4">
          {payslips.map((payslip) => (
            <Card key={payslip.id}>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {new Date(payslip.payPeriodStart).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Pay Period: {new Date(payslip.payPeriodStart).toLocaleDateString()} -{' '}
                      {new Date(payslip.payPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">
                    Paid on {new Date(payslip.payDate).toLocaleDateString()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Gross Salary</p>
                      <p className="text-xl font-semibold">
                        {formatCurrency(payslip.grossSalary, payslip.currency)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Deductions</p>
                      <p className="text-xl font-semibold text-red-600">
                        -{formatCurrency(payslip.deductions, payslip.currency)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Net Salary</p>
                      <p className="text-xl font-semibold text-green-600">
                        {formatCurrency(payslip.netSalary, payslip.currency)}
                      </p>
                    </div>
                  </div>

                  {payslip.allowances > 0 && (
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-sm">
                        <span className="font-medium">Allowances:</span>{' '}
                        {formatCurrency(payslip.allowances, payslip.currency)}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button className="flex-1" variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    <Button className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No payslips available</h3>
            <p className="text-sm text-muted-foreground">
              Your payslips will appear here once they are processed
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
