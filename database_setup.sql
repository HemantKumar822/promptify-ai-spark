-- =============================================
-- AI Prompt Engineer - Database Setup
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  api_key_encrypted TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_prompts table
CREATE TABLE IF NOT EXISTS user_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  input_prompt TEXT NOT NULL,
  enhanced_prompt TEXT NOT NULL,
  is_image_prompt BOOLEAN DEFAULT FALSE,
  enhancement_mode TEXT DEFAULT 'professional',
  is_saved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  theme TEXT DEFAULT 'light',
  default_enhancement_mode TEXT DEFAULT 'professional',
  auto_save_history BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- Row Level Security Policies
-- =============================================

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- User prompts policies
CREATE POLICY "Users can view own prompts" ON user_prompts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prompts" ON user_prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompts" ON user_prompts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prompts" ON user_prompts
  FOR DELETE USING (auth.uid() = user_id);

-- User settings policies
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- Enable RLS on all tables
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Functions for automatic profile creation
-- =============================================

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$;

-- Trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- Updated_at trigger function
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- =============================================
-- Indexes for better performance
-- =============================================

CREATE INDEX IF NOT EXISTS user_prompts_user_id_idx ON user_prompts(user_id);
CREATE INDEX IF NOT EXISTS user_prompts_created_at_idx ON user_prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS user_prompts_is_saved_idx ON user_prompts(is_saved) WHERE is_saved = true;

-- =============================================
-- Enable Google OAuth (Optional)
-- =============================================

-- This allows Google OAuth integration
-- You can also configure this in the Supabase dashboard under Authentication > Providers

COMMENT ON TABLE profiles IS 'User profiles with encrypted API keys and preferences';
COMMENT ON TABLE user_prompts IS 'User prompt history with enhancement details';
COMMENT ON TABLE user_settings IS 'User preferences and settings';

-- =============================================
-- Sample data (Optional - for testing)
-- =============================================

-- Uncomment below to insert test data after creating a user account
/*
INSERT INTO profiles (id, email, full_name) VALUES
  ('your-user-id-here', 'test@example.com', 'Test User');

INSERT INTO user_prompts (user_id, input_prompt, enhanced_prompt, enhancement_mode) VALUES
  ('your-user-id-here', 'Write a story', 'Write an engaging and captivating story...', 'creative');
*/