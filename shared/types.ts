// Shared types for MoneyPro HYIP Platform
export interface User {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  is_admin?: boolean;
  totalBalance?: string;
  referral_code?: string;
  referred_by?: string;
  is_online?: boolean;
  last_active_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Transaction {
  id: number;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'profit' | 'referral_bonus';
  amount: string;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PlatformStats {
  id: number;
  total_users: number;
  online_users: number;
  total_investments: number;
  total_invested_amount: string;
  total_profit_paid: string;
  total_transactions: number;
  created_at?: string;
  updated_at?: string;
}

export interface InvestmentPlan {
  id: number;
  name: string;
  description?: string;
  interest_rate: number;
  min_amount: string;
  max_amount: string;
  duration: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Investment {
  id: number;
  user_id: string;
  plan_id: number;
  amount: string;
  status: 'active' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email?: string;
  authenticated?: boolean;
  isActive?: boolean;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}