/*
  # Add Attendance Table

  1. New Tables
    - `attendance_records`
      - `id` (uuid, primary key)
      - `employee_id` (uuid)
      - `employee_name` (text)
      - `date` (date)
      - `check_in` (timestamptz)
      - `check_out` (timestamptz, nullable)
      - `status` (text)
      - `hours_worked` (numeric, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on attendance_records table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid,
  employee_name text NOT NULL,
  date date NOT NULL,
  check_in timestamptz NOT NULL,
  check_out timestamptz,
  status text NOT NULL DEFAULT 'present',
  hours_worked numeric,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Attendance records can be read by all authenticated users"
  ON attendance_records FOR SELECT
  USING (true);

CREATE POLICY "Attendance records can be inserted by authenticated users"
  ON attendance_records FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Attendance records can be updated by authenticated users"
  ON attendance_records FOR UPDATE
  USING (true);

-- Insert sample attendance records
INSERT INTO attendance_records (employee_id, employee_name, date, check_in, check_out, status, hours_worked)
VALUES 
  (
    '00000000-0000-0000-0000-000000000001',
    'John Doe',
    '2025-10-15',
    '2025-10-15 09:00:00',
    '2025-10-15 17:30:00',
    'present',
    8.5
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'John Doe',
    '2025-10-14',
    '2025-10-14 08:45:00',
    '2025-10-14 17:15:00',
    'present',
    8.5
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'John Doe',
    '2025-10-13',
    '2025-10-13 09:10:00',
    '2025-10-13 17:00:00',
    'present',
    7.83
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'John Doe',
    '2025-10-12',
    '2025-10-12 09:00:00',
    '2025-10-12 18:00:00',
    'present',
    9.0
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'John Doe',
    '2025-10-11',
    '2025-10-11 08:55:00',
    '2025-10-11 17:30:00',
    'present',
    8.58
  )
ON CONFLICT (id) DO NOTHING;
