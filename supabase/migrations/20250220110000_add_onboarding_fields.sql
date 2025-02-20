-- Add job_role and has_completed_onboarding columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS job_role text,
ADD COLUMN IF NOT EXISTS has_completed_onboarding boolean DEFAULT false;
