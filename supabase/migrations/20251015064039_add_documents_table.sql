/*
  # Add Documents Table

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `type` (text)
      - `size` (text)
      - `uploaded_by` (uuid, references users)
      - `upload_date` (timestamptz)
      - `file_url` (text, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on documents table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  type text NOT NULL,
  size text NOT NULL,
  uploaded_by uuid,
  uploaded_by_name text,
  upload_date timestamptz DEFAULT now(),
  file_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Documents can be read by all authenticated users"
  ON documents FOR SELECT
  USING (true);

CREATE POLICY "Documents can be inserted by authenticated users"
  ON documents FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Documents can be deleted by authenticated users"
  ON documents FOR DELETE
  USING (true);

-- Insert sample documents
INSERT INTO documents (name, category, type, size, uploaded_by_name, upload_date)
VALUES 
  (
    'Employee Handbook 2025.pdf',
    'Company Policy',
    'Policy',
    '2.4 MB',
    'Admin User',
    '2025-10-01'
  ),
  (
    'Leave Policy Guidelines.pdf',
    'HR Policy',
    'Policy',
    '1.8 MB',
    'HR Admin',
    '2025-09-15'
  ),
  (
    'Payroll Template.xlsx',
    'Payroll',
    'Template',
    '156 KB',
    'Payroll Admin',
    '2025-09-01'
  ),
  (
    'Code of Conduct.pdf',
    'Company Policy',
    'Policy',
    '980 KB',
    'Admin User',
    '2025-08-20'
  )
ON CONFLICT (id) DO NOTHING;
