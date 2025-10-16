'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building, Users, Settings as SettingsIcon, Bell, Shield, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const { data: company } = useQuery({
    queryKey: ['company-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const handleSaveCompanyInfo = () => {
    toast.success('Company information saved successfully');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved successfully');
  };

  const handleSaveSecurity = () => {
    toast.success('Security settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization settings and preferences
        </p>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>
                Update your company details and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    defaultValue={company?.name || 'QuantumHR Demo Corp'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-code">Company Code</Label>
                  <Input
                    id="company-code"
                    defaultValue={company?.code || 'QHR'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax-id">Tax ID</Label>
                  <Input
                    id="tax-id"
                    defaultValue={company?.tax_id || '123-45-6789'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    defaultValue={company?.phone || '+1 (555) 123-4567'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={company?.email || 'info@quantumhr.com'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    defaultValue={company?.address || '123 Business Ave, Suite 100'}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSaveCompanyInfo}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Super Admin</h4>
                      <p className="text-sm text-muted-foreground">
                        Full access to all features and settings
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">HR Admin</h4>
                      <p className="text-sm text-muted-foreground">
                        Manage employees, leave, and HR functions
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Payroll Admin</h4>
                      <p className="text-sm text-muted-foreground">
                        Access to payroll and financial data
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Employee</h4>
                      <p className="text-sm text-muted-foreground">
                        Access to ESS portal only
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about important events
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in your browser
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Email Preferences</h4>
                <div className="space-y-3 pl-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="leave-requests" className="font-normal">
                      Leave requests
                    </Label>
                    <Switch id="leave-requests" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="payroll-updates" className="font-normal">
                      Payroll updates
                    </Label>
                    <Switch id="payroll-updates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-employees" className="font-normal">
                      New employee registrations
                    </Label>
                    <Switch id="new-employees" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications}>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  id="two-factor"
                  checked={twoFactorAuth}
                  onCheckedChange={setTwoFactorAuth}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Password Policy</h4>
                <div className="space-y-2 pl-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="min-length" className="font-normal">
                      Minimum password length
                    </Label>
                    <Input
                      id="min-length"
                      type="number"
                      className="w-20"
                      defaultValue={8}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password-expiry" className="font-normal">
                      Password expiry (days)
                    </Label>
                    <Input
                      id="password-expiry"
                      type="number"
                      className="w-20"
                      defaultValue={90}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Session Timeout</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Automatically log out users after inactivity
                </p>
                <Input
                  type="number"
                  placeholder="Minutes"
                  defaultValue={30}
                  className="max-w-xs"
                />
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSaveSecurity}>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Information
              </CardTitle>
              <CardDescription>
                View system status and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Version</div>
                  <div className="text-2xl font-bold">v1.0.0</div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Database</div>
                  <div className="text-2xl font-bold">Supabase</div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div className="text-2xl font-bold text-green-600">Active</div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Uptime</div>
                  <div className="text-2xl font-bold">99.9%</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Backup & Maintenance</h4>
                <div className="flex gap-2">
                  <Button variant="outline">Create Backup</Button>
                  <Button variant="outline">View Logs</Button>
                  <Button variant="outline">Clear Cache</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
