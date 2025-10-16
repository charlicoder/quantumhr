export type UserRole =
  | 'super_admin'
  | 'hr_admin'
  | 'payroll_admin'
  | 'manager'
  | 'employee';

export interface Permission {
  id: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  granted: boolean;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  employeeId?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentId: string;
  sectionId?: string;
  positionId: string;
  managerId?: string;
  siteId: string;
  companyId: string;
  dateOfJoining: string;
  employmentType: 'permanent' | 'contract' | 'probation';
  status: 'active' | 'inactive' | 'terminated';
  profileCompletionPercentage: number;
  personalInfo?: PersonalInfo;
  salaryInfo?: SalaryInfo;
}

export interface PersonalInfo {
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  nationalId?: string;
  passportNumber?: string;
  emergencyContact?: EmergencyContact;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface SalaryInfo {
  basicSalary: number;
  currency: string;
  paymentMethod: 'bank_transfer' | 'cash' | 'check';
  bankAccountNumber?: string;
  bankName?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  managerId?: string;
  companyId: string;
  employeeCount: number;
}

export interface Section {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  managerId?: string;
}

export interface Company {
  id: string;
  name: string;
  code: string;
  taxId?: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
}

export interface Site {
  id: string;
  name: string;
  code: string;
  companyId: string;
  address: string;
  phone?: string;
  isHeadquarters: boolean;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approverId?: string;
  approvalDate?: string;
  rejectionReason?: string;
}

export interface LeaveBalance {
  leaveTypeId: string;
  leaveTypeName: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}

export interface Payslip {
  id: string;
  employeeId: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  payDate: string;
  grossSalary: number;
  netSalary: number;
  deductions: number;
  allowances: number;
  currency: string;
  pdfUrl?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  pendingLeaveRequests: number;
  pendingApprovals: number;
  newHiresThisMonth: number;
  departmentCount: number;
}

export interface Activity {
  id: string;
  type: 'leave_request' | 'employee_added' | 'profile_update' | 'payroll_processed';
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  publishedDate: string;
  priority: 'low' | 'medium' | 'high';
  targetAudience: 'all' | 'department' | 'site';
}
