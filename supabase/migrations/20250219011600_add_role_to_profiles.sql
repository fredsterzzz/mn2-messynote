-- Add role column to profiles if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE profiles ADD COLUMN role text;
    END IF;
END $$;

-- Create admin role policy
CREATE POLICY "Enable all access for admin users" ON "public"."blog_posts"
AS PERMISSIVE FOR ALL
TO authenticated
USING (
  (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.role = 'admin' OR auth.jwt()->>'role' = 'admin')
  ))
)
WITH CHECK (
  (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.role = 'admin' OR auth.jwt()->>'role' = 'admin')
  ))
);

-- Set your user as admin
UPDATE profiles 
SET role = 'admin' 
WHERE id = auth.uid();
