import { createClient } from '@supabase/supabase-js';

// Cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos do banco de dados
export interface Generation {
  id: string;
  created_at: string;
  theme: string;
  niche: string;
  script: string;
  caption: string;
  hashtags: string[];
  performance: {
    viral_score: number;
    engagement_rate: number;
    estimated_views: string;
  };
  user_id?: string;
}
