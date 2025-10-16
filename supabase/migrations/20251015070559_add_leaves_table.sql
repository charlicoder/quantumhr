/*
  # Add Leaves Table

  1. New Tables
    - `leave_types`
      - `id` (uuid, primary key)
      - `name` (text)
      - `days_allowed` (integer)
      - `requires_approval` (boolean)
      - `created_at` (timestamptz)
    
    - `leave_requests`
      - `id` (uuid, primary key)
      - `employee_id` (uuid)
      - `leave_type_id` (uuid, references leave_types)
      - `leave_type_name` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `days_count` (integer)
      - `reason` (text)
      - `status` (text)
      - `applied_date` (timestamptz)
      - `approved_by` (uuid, nullable)
      - `approved_date` (timestamptz, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS leave_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  days_allowed integer NOT NULL DEFAULT 0,
  requires_approval boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid,
  leave_type_id uuid REFERENCES leave_types(id),
  leave_type_name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  days_count integer NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'pending',
  applied_date timestamptz DEFAULT now(),
  approved_by uuid,
  approved_date timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leave types can be read by all authenticated users"
  ON leave_types FOR SELECT
  USING (true);

CREATE POLICY "Leave requests can be read by all authenticated users"
  ON leave_requests FOR SELECT
  USING (true);

CREATE POLICY "Leave requests can be inserted by authenticated users"
  ON leave_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Leave requests can be updated by authenticated users"
  ON leave_requests FOR UPDATE
  USING (true);

-- Insert sample leave types
INSERT INTO leave_types (name, days_allowed, requires_approval)
VALUES 
  ('Annual Leave', 20, true),
  ('Sick Leave', 10, false),
  ('Emergency Leave', 5, true),
  ('Maternity Leave', 90, true),
  ('Paternity Leave', 7, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample leave requests
INSERT INTO leave_requests (employee_id, leave_type_name, start_date, end_date, days_count, reason, status, applied_date)
VALUES 
  (
    '00000000-0000-0000-0000-000000000001',
    'Annual Leave',
    '2025-11-15',
    '2025-11-19',
    5,
    'Family vacation',
    'approved',
    '2025-10-10'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Sick Leave',
    '2025-10-05',
    '2025-10-06',
    2,
    'Medical appointment',
    'approved',
    '2025-10-03'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Emergency Leave',
    '2025-12-20',
    '2025-12-22',
    3,
    'Personal emergency',
    'pending',
    '2025-10-14'
  )
ON CONFLICT (id) DO NOTHING;
