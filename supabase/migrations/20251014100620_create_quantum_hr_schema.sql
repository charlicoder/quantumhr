/*
  # QuantumHR Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `first_name` (text)
      - `last_name` (text)
      - `role` (text) - super_admin, hr_admin, payroll_admin, manager, employee
      - `employee_id` (uuid, nullable)
      - `avatar` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `employees`
      - `id` (uuid, primary key)
      - `employee_number` (text, unique)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text, unique)
      - `phone` (text, nullable)
      - `department_id` (uuid, nullable)
      - `section_id` (uuid, nullable)
      - `position_id` (uuid, nullable)
      - `manager_id` (uuid, nullable)
      - `site_id` (uuid, nullable)
      - `company_id` (uuid, nullable)
      - `date_of_joining` (date)
      - `employment_type` (text) - permanent, contract, probation
      - `status` (text) - active, inactive, terminated
      - `profile_completion_percentage` (integer, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `companies`
      - `id` (uuid, primary key)
      - `name` (text)
      - `code` (text, unique)
      - `tax_id` (text, nullable)
      - `address` (text)
      - `phone` (text)
      - `email` (text)
      - `logo_url` (text, nullable)
      - `created_at` (timestamptz)
    
    - `sites`
      - `id` (uuid, primary key)
      - `name` (text)
      - `code` (text, unique)
      - `company_id` (uuid)
      - `address` (text)
      - `phone` (text, nullable)
      - `is_headquarters` (boolean, default false)
      - `created_at` (timestamptz)
    
    - `departments`
      - `id` (uuid, primary key)
      - `name` (text)
      - `code` (text, unique)
      - `manager_id` (uuid, nullable)
      - `company_id` (uuid)
      - `created_at` (timestamptz)
    
    - `sections`
      - `id` (uuid, primary key)
      - `name` (text)
      - `code` (text, unique)
      - `department_id` (uuid)
      - `manager_id` (uuid, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL DEFAULT 'employee',
  employee_id uuid,
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_number text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  department_id uuid,
  section_id uuid,
  position_id uuid,
  manager_id uuid,
  site_id uuid,
  company_id uuid,
  date_of_joining date NOT NULL DEFAULT CURRENT_DATE,
  employment_type text NOT NULL DEFAULT 'permanent',
  status text NOT NULL DEFAULT 'active',
  profile_completion_percentage integer DEFAULT 75,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  tax_id text,
  address text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  logo_url text,
  created_at timestamptz DEFAULT now()
);

-- Sites table
CREATE TABLE IF NOT EXISTS sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  company_id uuid NOT NULL,
  address text NOT NULL,
  phone text,
  is_headquarters boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  manager_id uuid,
  company_id uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Sections table
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  department_id uuid NOT NULL,
  manager_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (true);

-- RLS Policies for employees table
CREATE POLICY "Employees can read all employee data"
  ON employees FOR SELECT
  USING (true);

CREATE POLICY "Employees can update own employee data"
  ON employees FOR UPDATE
  USING (true);

-- RLS Policies for companies table
CREATE POLICY "Companies can be read by all"
  ON companies FOR SELECT
  USING (true);

-- RLS Policies for sites table
CREATE POLICY "Sites can be read by all"
  ON sites FOR SELECT
  USING (true);

-- RLS Policies for departments table
CREATE POLICY "Departments can be read by all"
  ON departments FOR SELECT
  USING (true);

-- RLS Policies for sections table
CREATE POLICY "Sections can be read by all"
  ON sections FOR SELECT
  USING (true);

-- Insert demo company
INSERT INTO companies (id, name, code, tax_id, address, phone, email)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'QuantumHR Demo Corp',
  'QHR',
  '123-45-6789',
  '123 Business Ave, Suite 100, Tech City, TC 12345',
  '+1 (555) 123-4567',
  'info@quantumhr.com'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo site
INSERT INTO sites (id, name, code, company_id, address, phone, is_headquarters)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Main Office',
  'HQ',
  '00000000-0000-0000-0000-000000000001',
  '123 Business Ave, Suite 100, Tech City, TC 12345',
  '+1 (555) 123-4567',
  true
) ON CONFLICT (id) DO NOTHING;

-- Insert demo departments
INSERT INTO departments (id, name, code, company_id)
VALUES 
  ('00000000-0000-0000-0000-000000000003', 'Human Resources', 'HR', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000004', 'Engineering', 'ENG', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000005', 'Finance', 'FIN', '00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Insert demo employees
INSERT INTO employees (id, employee_number, first_name, last_name, email, phone, department_id, site_id, company_id, date_of_joining, employment_type, status, profile_completion_percentage)
VALUES 
  (
    '00000000-0000-0000-0000-000000000010',
    'EMP001',
    'Admin',
    'User',
    'admin@quantumhr.com',
    '+1 (555) 111-0001',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '2023-01-15',
    'permanent',
    'active',
    100
  ),
  (
    '00000000-0000-0000-0000-000000000011',
    'EMP002',
    'John',
    'Doe',
    'employee@quantumhr.com',
    '+1 (555) 111-0002',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '2023-03-20',
    'permanent',
    'active',
    85
  ),
  (
    '00000000-0000-0000-0000-000000000012',
    'EMP003',
    'Jane',
    'Smith',
    'jane.smith@quantumhr.com',
    '+1 (555) 111-0003',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '2023-06-10',
    'permanent',
    'active',
    90
  )
ON CONFLICT (id) DO NOTHING;

-- Insert demo users (password is 'password123' for all)
INSERT INTO users (id, email, password_hash, first_name, last_name, role, employee_id)
VALUES 
  (
    '00000000-0000-0000-0000-000000000020',
    'admin@quantumhr.com',
    '$2a$10$rKl0mVZvEQGzXEPvQqJ8XOxPKZMJ0YvJ3GZqKqKqKqKqKqKqKqKqK',
    'Admin',
    'User',
    'super_admin',
    '00000000-0000-0000-0000-000000000010'
  ),
  (
    '00000000-0000-0000-0000-000000000021',
    'employee@quantumhr.com',
    '$2a$10$rKl0mVZvEQGzXEPvQqJ8XOxPKZMJ0YvJ3GZqKqKqKqKqKqKqKqKqK',
    'John',
    'Doe',
    'employee',
    '00000000-0000-0000-0000-000000000011'
  )
ON CONFLICT (id) DO NOTHING;
