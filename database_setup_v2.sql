-- =============================================
-- AI Prompt Engineer - Database Setup V2
-- A cleaner, more normalized schema for better performance and maintainability.
-- Run this in your Supabase SQL Editor. You may need to delete existing tables first.
-- =============================================

-- =============================================
-- Step 1: Create Tables
-- =============================================

-- Profiles table (central user data)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  api_key_encrypted TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- The user's email is already in auth.users, so we don't need it here.
  CONSTRAINT "full_name_length" CHECK (char_length(full_name) >= 1)
);
COMMENT ON TABLE "profiles" IS 'Stores public user profile information and encrypted API keys.';

-- User Settings table (all user-specific preferences)
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  theme TEXT DEFAULT 'light'::TEXT NOT NULL,
  default_enhancement_mode TEXT DEFAULT 'professional'::TEXT NOT NULL,
  auto_save_history BOOLEAN DEFAULT TRUE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
COMMENT ON TABLE "user_settings" IS 'Stores user-specific application settings and preferences.';

-- Prompt History table
CREATE TABLE IF NOT EXISTS prompt_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  input_prompt TEXT NOT NULL,
  enhanced_prompt TEXT NOT NULL,
  is_image_prompt BOOLEAN DEFAULT FALSE NOT NULL,
  enhancement_mode TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
COMMENT ON TABLE "prompt_history" IS 'Stores the history of all prompts generated by a user.';

-- Saved Prompts table
CREATE TABLE IF NOT EXISTS saved_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  is_image_prompt BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Ensure a user cannot save the exact same prompt twice
  CONSTRAINT "unique_user_prompt" UNIQUE (user_id, text)
);
COMMENT ON TABLE "saved_prompts" IS 'Stores prompts that the user has explicitly saved or "starred".';

-- =============================================
-- Step 2: Create Row Level Security (RLS) Policies
-- =============================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile." ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- User Settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own settings." ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings." ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings." ON user_settings FOR UPDATE USING (auth.uid() = user_id);

-- Prompt History
ALTER TABLE prompt_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own prompt history." ON prompt_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own prompt history." ON prompt_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own prompt history." ON prompt_history FOR DELETE USING (auth.uid() = user_id);

-- Saved Prompts
ALTER TABLE saved_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own saved prompts." ON saved_prompts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own saved prompts." ON saved_prompts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saved prompts." ON saved_prompts FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- Step 3: Create Functions and Triggers
-- =============================================

-- Function to create a profile and settings for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create a profile
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Create default settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Trigger to call the function when a new user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to automatically update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- Apply the trigger to tables with an 'updated_at' column
CREATE TRIGGER on_profiles_update
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_user_settings_update
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- Step 4: Create Indexes for Performance
-- =============================================

CREATE INDEX IF NOT EXISTS "prompt_history_user_id_idx" ON "prompt_history" USING btree (user_id);
CREATE INDEX IF NOT EXISTS "saved_prompts_user_id_idx" ON "saved_prompts" USING btree (user_id);

-- =============================================
-- Setup Complete
-- ============================================= 