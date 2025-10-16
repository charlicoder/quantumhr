'use client';

import { useState } from 'react';
import { Download, FileText, TrendingUp, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateCustomReportDialog } from '@/components/admin/reports/create-custom-report-dialog';

export default function ReportsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const reportCategories = [
    {
      title: 'Employee Reports',
      icon: Users,
      reports: [
        { name: 'Employee List', description: 'Complete list of all employees' },
        { name: 'Employee Directory', description: 'Contact information directory' },
        { name: 'New Hires Report', description: 'Recent employee additions' },
        { name: 'Terminations Report', description: 'Employee exit records' },
      ],
    },
    {
      title: 'Attendance Reports',
      icon: Calendar,
      reports: [
        { name: 'Monthly Attendance', description: 'Employee attendance by month' },
        { name: 'Leave Summary', description: 'Leave taken by employees' },
        { name: 'Absence Report', description: 'Unauthorized absences' },
        { name: 'Overtime Report', description: 'Overtime hours worked' },
      ],
    },
    {
      title: 'Payroll Reports',
      icon: TrendingUp,
      reports: [
        { name: 'Payroll Summary', description: 'Monthly payroll breakdown' },
        { name: 'Tax Deductions', description: 'Tax withholding summary' },
        { name: 'Benefits Report', description: 'Employee benefits overview' },
        { name: 'Salary Analysis', description: 'Compensation analysis' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download various HR reports
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <FileText className="mr-2 h-4 w-4" />
          Create Custom Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Standard reports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generated This Month</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Reports downloaded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Reports</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Created reports
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="employee" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employee">Employee</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>

        {reportCategories.map((category, idx) => (
          <TabsContent key={idx} value={category.title.toLowerCase().split(' ')[0]}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5" />
                  {category.title}
                </CardTitle>
                <CardDescription>
                  Select a report to generate and download
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {category.reports.map((report, reportIdx) => (
                    <Card key={reportIdx} className="transition-colors hover:bg-accent">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{report.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {report.description}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            PDF
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            Excel
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            CSV
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <CreateCustomReportDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
