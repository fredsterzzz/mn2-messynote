export interface UserCredits {
  id: string;
  user_id: string;
  credits_remaining: number;
  subscription_status: 'active' | 'trialing' | 'canceled' | 'none';
  subscription_end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends UserCredits {
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  content: string;
  template: string;
  tone: string;
  type: string;
  created_at: string;
  updated_at: string;
}