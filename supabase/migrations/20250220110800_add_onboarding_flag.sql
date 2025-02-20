-- Add has_completed_onboarding flag to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS has_completed_onboarding boolean DEFAULT false;
