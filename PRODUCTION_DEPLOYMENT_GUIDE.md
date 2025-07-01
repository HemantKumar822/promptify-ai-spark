# 🚀 Production Deployment Guide

## 📋 **Pre-Merge Checklist**

Before merging your branch to main and deploying to `https://promptify-ai-ten.vercel.app`, you need to update several configurations:

---

## 🔧 **1. Code Changes (✅ COMPLETED)**

### **OAuth Redirect URL Updated**
- ✅ Updated `src/hooks/useAuth.tsx` to use production URL
- ✅ Changed from test URL to: `https://promptify-ai-ten.vercel.app`

---

## 🗄️ **2. Supabase Configuration Updates**

### **Update Site URL in Supabase Dashboard**

1. **Go to [Supabase Dashboard](https://supabase.com/dashboard)**
2. **Select your project**: `uhhcyrndddyskxskuswk`
3. **Go to Authentication → URL Configuration**
4. **Update Site URL**:
   ```
   FROM: http://localhost:3000
   TO: https://promptify-ai-ten.vercel.app
   ```
5. **Update Additional Redirect URLs** (if any):
   ```
   https://promptify-ai-ten.vercel.app
   https://promptify-ai-ten.vercel.app/**
   ```
6. **Click "Save"**

---

## 🔑 **3. Google OAuth Configuration**

### **Update Google Cloud Console**

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Select your project** (where you configured OAuth)
3. **Go to APIs & Services → Credentials**
4. **Find your OAuth 2.0 Client ID**
5. **Click "Edit"**

### **Update Authorized JavaScript Origins**:
```
Remove: https://promptify-ai-git-cursor-analyz-f21c69-hemants-projects-f496520d.vercel.app
Add: https://promptify-ai-ten.vercel.app
```

### **Update Authorized Redirect URIs**:
```
Keep: https://uhhcyrndddyskxskuswk.supabase.co/auth/v1/callback
```

6. **Click "Save"**

---

## 🔄 **4. Vercel Environment Variables**

### **Check Production Environment Variables**

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Select your production project**: `promptify-ai-ten`
3. **Go to Settings → Environment Variables**
4. **Ensure these are set**:

```bash
VITE_SUPABASE_URL=https://uhhcyrndddyskxskuswk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

5. **Ensure NO default API key** (users must bring their own):
   ```
   ❌ REMOVE: VITE_DEFAULT_OPENROUTER_KEY (if it exists)
   ```

---

## 📝 **5. Git Operations**

### **Merge to Main Branch**

```bash
# 1. Commit all your changes
git add .
git commit -m "feat: Add authentication, BYOK system, and profile fixes"

# 2. Switch to main branch
git checkout main

# 3. Merge your feature branch
git merge your-feature-branch-name

# 4. Push to main
git push origin main
```

### **Vercel Auto-Deployment**
- Vercel will automatically deploy when you push to main
- Monitor the deployment in Vercel dashboard

---

## 🧪 **6. Post-Deployment Testing**

### **Test Authentication Flow**

1. **Visit**: `https://promptify-ai-ten.vercel.app`
2. **Click "Sign In"**
3. **Test Google OAuth**:
   - Should redirect to Google
   - Should redirect back to your site (not localhost)
   - Should successfully authenticate
4. **Test Email/Password**:
   - Sign up with email
   - Check email confirmation
   - Sign in after confirmation

### **Test API Key System**

1. **Without API Key**:
   - Should show "API Key Required" notice
   - Should not allow prompt enhancement
2. **With API Key**:
   - Go to Settings → API Keys
   - Add your OpenRouter API key
   - Test key validation (green checkmark)
   - Save to account or locally
   - Try enhancing a prompt
   - Should work perfectly

### **Test Profile Persistence**

1. **Save API key to account**
2. **Refresh page** - profile should remain visible
3. **Log out and back in** - API key should persist
4. **Test on different device** - should sync

---

## 🚨 **Common Issues & Solutions**

### **Google OAuth Redirects to Localhost**
- ✅ **Fixed**: Code now uses production URL
- **Also check**: Google Cloud Console redirect URIs

### **"Site URL not configured" Error**
- **Solution**: Update Supabase Site URL (Step 2)

### **API Key Not Saving**
- ✅ **Fixed**: Improved error handling and validation
- **Also check**: Database permissions in Supabase

### **Profile Button Disappears**
- ✅ **Fixed**: Enhanced auth state management
- **Also check**: Browser console for errors

---

## 🎯 **Success Criteria**

After deployment, these should all work:

- ✅ **Google OAuth**: Redirects correctly to production site
- ✅ **Email Authentication**: Sign up/in works
- ✅ **Profile Persistence**: Button stays visible after refresh
- ✅ **API Key Management**: Save to account and localStorage
- ✅ **AI Prompt Enhancement**: Works with user's API key
- ✅ **Cross-Device Sync**: API keys sync across devices
- ✅ **Security**: No default API key, users bring their own

---

## 📞 **If You Need Help**

1. **Check browser console** for detailed error logs
2. **Check Vercel deployment logs** for build issues
3. **Check Supabase logs** for authentication issues
4. **Test with fresh incognito window** to avoid cache issues

The enhanced logging in the app will provide detailed information about any remaining issues.

---

## 🔄 **Rollback Plan**

If something goes wrong:

1. **Quick fix**: Revert Supabase Site URL to previous setting
2. **Full rollback**: Revert the merge and redeploy previous version
3. **Google OAuth**: Can temporarily use test URL while fixing

Remember to test thoroughly in production environment!