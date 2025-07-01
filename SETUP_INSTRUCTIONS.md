# 🚀 Setup Instructions - AI Prompt Engineer V2

## ✅ What's Already Done

✅ **Supabase Integration**: Connected to your Supabase project  
✅ **Authentication System**: Email/password + Google OAuth ready  
✅ **User Profiles**: Complete user management system  
✅ **BYOK System**: Bring Your Own Key with encryption  
✅ **Cloud Sync**: Real-time data sync across devices  
✅ **Enhanced UI**: Professional settings and user interface  

---

## 🗄️ Database Setup (5 minutes)

### **Step 1: Run Database Schema**
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Click on your project: `uhhcyrndddyskxskuswk`
3. Go to **SQL Editor** in the left sidebar
4. Copy and paste the contents of `database_setup.sql` 
5. Click **Run** to execute all the SQL commands

This will create:
- `profiles` table (user data + encrypted API keys)
- `user_prompts` table (prompt history with sync)
- `user_settings` table (preferences)
- Row Level Security policies
- Automatic triggers for profile creation

---

## 🔐 Google OAuth Setup (Optional - 3 minutes)

### **Step 1: Enable Google OAuth in Supabase**
1. In your Supabase dashboard, go to **Authentication > Providers**
2. Find **Google** and click **Enable**
3. You'll need to create a Google OAuth app:

### **Step 2: Create Google OAuth App**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth 2.0 Client IDs**
5. Choose **Web application**
6. Add these authorized redirect URIs:
   ```
   https://uhhcyrndddyskxskuswk.supabase.co/auth/v1/callback
   http://localhost:5173/auth/callback (for development)
   ```

### **Step 3: Configure in Supabase**
1. Copy the **Client ID** and **Client Secret** from Google
2. Paste them in the Supabase Google provider settings
3. Save the configuration

---

## 🧪 Testing the System

### **Test 1: Authentication**
1. Visit your site: `http://localhost:5173`
2. Click **Sign In** button
3. Try both email signup and Google OAuth
4. Verify profile creation in Supabase database

### **Test 2: API Key Management**
1. Sign in to your account
2. Click your avatar > **Settings**
3. Go to **API Keys** tab
4. Add your OpenRouter API key
5. Test with the **Test Key** button
6. Choose **Save to account** for cloud sync

### **Test 3: Cross-Device Sync**
1. Save some prompts on one device
2. Open the site on another device/browser
3. Sign in with the same account
4. Verify all data syncs automatically

---

## 🎯 New Features You Now Have

### **🔐 User Authentication**
- Email/password signup and login
- Google OAuth integration
- Secure session management
- Automatic profile creation

### **🔑 BYOK (Bring Your Own Key)**
- Secure API key encryption
- Choice: save to account or locally
- Cross-device key synchronization
- API key validation

### **☁️ Cloud Data Sync**
- Prompt history syncs across devices
- Saved prompts cloud storage
- Real-time updates
- Offline capability

### **⚙️ Professional Settings**
- User profile management
- API key management interface
- Preferences and customization
- Theme and enhancement mode settings

### **📱 Enhanced Mobile Experience**
- Touch-optimized authentication
- Responsive settings interface
- Mobile-friendly user menu
- Improved navigation

---

## 🔧 Configuration Options

### **Environment Variables**
```bash
# Already configured in .env.local:
VITE_SUPABASE_URL=https://uhhcyrndddyskxskuswk.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_DEFAULT_OPENROUTER_KEY=fallback_key
```

### **Database Security**
- Row Level Security (RLS) enabled
- Users can only access their own data
- Encrypted API key storage
- Automatic profile creation

### **API Key Priority**
1. User's encrypted account key (syncs across devices)
2. User's local browser key (device-specific)
3. Default fallback key (for guests)

---

## 🚀 Next Steps

### **Immediate (This Week)**
1. **Run the database setup SQL**
2. **Test the authentication flow**
3. **Configure Google OAuth** (optional)
4. **Add your own OpenRouter API key**

### **Future Enhancements (Next Phase)**
- Template library system
- Team collaboration features
- Advanced analytics dashboard
- Premium subscription plans
- Multi-AI provider support

---

## 🐛 Troubleshooting

### **Database Issues**
- **Error**: "relation does not exist"
  - **Solution**: Run the `database_setup.sql` in Supabase SQL Editor

### **Authentication Issues**
- **Error**: "Invalid login credentials"
  - **Solution**: Check if user exists, try password reset

### **API Key Issues**
- **Error**: "No API key available"
  - **Solution**: Add your OpenRouter key in Settings > API Keys

### **Google OAuth Issues**
- **Error**: "OAuth error"
  - **Solution**: Check redirect URIs in Google Console

---

## 📊 Database Structure

```sql
profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  api_key_encrypted TEXT,  -- Your encrypted OpenRouter key
  preferences JSONB,
  created_at, updated_at
)

user_prompts (
  id UUID PRIMARY KEY,
  user_id UUID,
  input_prompt TEXT,
  enhanced_prompt TEXT,
  is_image_prompt BOOLEAN,
  enhancement_mode TEXT,
  is_saved BOOLEAN,
  created_at
)

user_settings (
  user_id UUID PRIMARY KEY,
  theme TEXT,
  default_enhancement_mode TEXT,
  auto_save_history BOOLEAN,
  settings JSONB,
  updated_at
)
```

---

## ✅ Success Criteria

After setup, you should be able to:

✅ Sign up/login with email or Google  
✅ Access settings via user menu  
✅ Add and encrypt your OpenRouter API key  
✅ See prompt history sync across devices  
✅ Save prompts to cloud storage  
✅ Use the app from any device with your account  

---

## 🆓 Free Tier Limits

**Supabase Free Tier:**
- 50,000 monthly active users
- 8GB database storage
- 2GB bandwidth
- 1GB file storage

**Current Usage:**
- Database: ~1MB (scales with users)
- Users: Unlimited on free tier
- API calls: User-based (their own keys)

---

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

---

## 📧 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify environment variables are set
3. Ensure database setup was completed
4. Test with a fresh incognito window

The system is designed to be robust and user-friendly. Most issues are resolved by ensuring the database setup is complete and API keys are properly configured.