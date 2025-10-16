'use client';

import { useState } from 'react';
import { DollarSign, Calendar, FileText, Download, Play } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function PayrollPage() {
  const [selectedMonth, setSelectedMonth] = useState('2025-10');

  const mockPayrollData = [
    {
      id: '1',
      employeeName: 'Admin User',
      employeeNumber: 'EMP001',
      basicSalary: 5000,
      allowances: 1000,
      deductions: 500,
      netSalary: 5500,
      status: 'processed',
    },
    {
      id: '2',
      employeeName: 'John Doe',
      employeeNumber: 'EMP002',
      basicSalary: 4500,
      allowances: 800,
      deductions: 450,
      netSalary: 4850,
      status: 'processed',
    },
    {
      id: '3',
      employeeName: 'Jane Smith',
      employeeNumber: 'EMP003',
      basicSalary: 4800,
      allowances: 900,
      deductions: 480,
      netSalary: 5220,
      status: 'processed',
    },
  ];

  const totalPayroll = mockPayrollData.reduce((sum, emp) => sum + emp.netSalary, 0);
  const totalDeductions = mockPayrollData.reduce((sum, emp) => sum + emp.deductions, 0);
  const totalAllowances = mockPayrollData.reduce((sum, emp) => sum + emp.allowances, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
          <p className="text-muted-foreground">
            Process and manage employee payroll
          </p>
        </div>
        <Button>
          <Play className="mr-2 h-4 w-4" />
          Process Payroll
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPayroll)}</div>
            <p className="text-xs text-muted-foreground">
              {mockPayrollData.length} employees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Allowances</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAllowances)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDeductions)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payroll Status</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="default">Processed</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payroll Details</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025-10">October 2025</SelectItem>
                    <SelectItem value="2025-09">September 2025</SelectItem>
                    <SelectItem value="2025-08">August 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead className="text-right">Basic Salary</TableHead>
                <TableHead className="text-right">Allowances</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayrollData.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{emp.employeeName}</div>
                      <div className="text-sm text-muted-foreground">
                        {emp.employeeNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(emp.basicSalary)}
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    +{formatCurrency(emp.allowances)}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    -{formatCurrency(emp.deductions)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(emp.netSalary)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">Processed</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
