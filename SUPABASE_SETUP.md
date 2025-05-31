# Supabase Authentication Setup Guide

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Fill in:
   - **Project Name**: `ai-cost-optimizer` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
6. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Project API Key** (anon/public): `eyJhbGciOiJIUzI1NiIsInR5cCI...`

## 3. Configure Environment Variables

Create a `.env.local` file in your project root and add:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Replace the placeholder values with your actual Supabase credentials!

## 4. Configure Authentication Providers

### Email Authentication (Already enabled by default)
- Users can sign up with email/password
- Email confirmation is enabled by default

### Social Authentication Setup

#### Google OAuth
1. Go to **Authentication** → **Providers**
2. Enable **Google**
3. Get credentials from [Google Cloud Console](https://console.cloud.google.com/):
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
4. Add Client ID and Client Secret to Supabase

#### GitHub OAuth
1. Go to **Authentication** → **Providers**
2. Enable **GitHub**
3. Create OAuth App in [GitHub Settings](https://github.com/settings/applications/new):
   - Application name: `AI Cost Optimizer`
   - Homepage URL: `https://your-domain.com`
   - Authorization callback URL: `https://your-project-id.supabase.co/auth/v1/callback`
4. Add Client ID and Client Secret to Supabase

#### Other Providers (Twitter, Facebook, etc.)
- Follow similar steps for each provider
- Each requires creating OAuth apps in their respective developer consoles

## 5. Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Add your site URL: `http://localhost:4028` (for development)
3. Add redirect URLs:
   - `http://localhost:4028/dashboard`
   - `https://your-production-domain.com/dashboard`

## 6. Email Templates (Optional)

Customize your email templates in **Authentication** → **Email Templates**:
- Confirm signup
- Reset password
- Magic link

## 7. Test Your Setup

1. Start your development server: `npm start`
2. Navigate to `/login`
3. Try signing up with email
4. Check your email for confirmation
5. Test social login providers

## 8. Database Policies (Security)

Supabase uses Row Level Security (RLS). Create policies for your tables:

```sql
-- Enable RLS on your tables
ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;

-- Example policy: Users can only access their own data
CREATE POLICY "Users can view own data" ON your_table_name
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON your_table_name
FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 9. Production Deployment

1. Update environment variables with production URLs
2. Add production domain to Supabase redirect URLs
3. Test authentication flows in production
4. Monitor authentication logs in Supabase dashboard

## Troubleshooting

### Common Issues

1. **"Invalid login credentials"**
   - Check if email confirmation is required
   - Verify user exists in Authentication → Users

2. **Social login doesn't work**
   - Verify OAuth app settings
   - Check redirect URLs match exactly
   - Ensure providers are enabled in Supabase

3. **Environment variables not working**
   - Restart development server after adding .env.local
   - Make sure variables start with `VITE_`

4. **CORS errors**
   - Add your domain to allowed origins in Supabase settings

### Useful Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/auth-signin)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security) 