/*
  # Fix project RLS policies

  1. Changes
    - Drop existing policies
    - Create new policies with proper user_id handling
    - Add default user_id value from auth.uid()

  2. Security
    - Ensure users can only access their own projects
    - Automatically set user_id on insert
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own projects" ON projects;
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;

-- Add default value for user_id
ALTER TABLE projects 
  ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Create new policies
CREATE POLICY "Users can create their own projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id OR 
    (user_id IS NULL AND auth.uid() IS NOT NULL)
  );

CREATE POLICY "Users can view their own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);