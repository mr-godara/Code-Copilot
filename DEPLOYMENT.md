# Deployment Guide

This guide covers deploying the Code Generation Copilot application to production using free-tier services.

## 🌐 Deployment Architecture

```
User Browser
    ↓
Frontend (Vercel)
    ↓ API Calls
Backend (Render.com)
    ↓
Database (Supabase PostgreSQL)
```

## 📋 Prerequisites

1. GitHub account
2. Accounts on:
   - [Vercel](https://vercel.com) (Frontend)
   - [Render](https://render.com) (Backend)
   - [Supabase](https://supabase.com) (Database)
3. OpenAI API key
4. Git installed locally

---

## 🗄️ Step 1: Deploy Database (Supabase)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create new organization (if needed)
4. Click "New Project"
5. Fill in:
   - **Name:** code-copilot-db
   - **Database Password:** Generate strong password (save it!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free
6. Click "Create new project"
7. Wait ~2 minutes for provisioning

### 1.2 Get Connection String

1. Go to Project Settings → Database
2. Copy the "Connection string" (URI format)
3. Replace `[YOUR-PASSWORD]` with your actual password
4. Should look like:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### 1.3 Run Migrations

**Option A: Using Supabase SQL Editor**

1. Go to SQL Editor in Supabase dashboard
2. Create new query
3. Copy and paste the migration SQL (see below)
4. Click "Run"

**Migration SQL:**
```sql
-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create languages table
CREATE TABLE languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    extension VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create generations table
CREATE TABLE generations (
    id SERIAL PRIMARY KEY,
    prompt TEXT NOT NULL,
    language_id INTEGER NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    code TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_generations_created_at ON generations(created_at DESC);
CREATE INDEX idx_generations_language_id ON generations(language_id);
CREATE INDEX idx_generations_user_id ON generations(user_id);

-- Seed languages
INSERT INTO languages (name, extension) VALUES
    ('Python', '.py'),
    ('JavaScript', '.js'),
    ('TypeScript', '.ts'),
    ('C++', '.cpp'),
    ('Java', '.java'),
    ('Go', '.go'),
    ('Rust', '.rs');

-- Create a demo user (optional)
INSERT INTO users (username, email) VALUES
    ('demo', 'demo@example.com');
```

**Option B: Using Local Migration Script**

1. Install PostgreSQL client locally
2. Run:
   ```bash
   psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" < backend/migrations/init.sql
   ```

### 1.4 Verify Database

1. Go to Table Editor in Supabase
2. Confirm tables exist: `users`, `languages`, `generations`
3. Check `languages` table has 7 rows

---

## 🚀 Step 2: Deploy Backend (Render.com)

### 2.1 Prepare Backend for Deployment

1. Ensure `backend/package.json` has start script:
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

2. Create `backend/.gitignore`:
   ```
   node_modules/
   .env
   .DS_Store
   ```

3. Push to GitHub:
   ```bash
   git add .
   git commit -m "Prepare backend for deployment"
   git push origin main
   ```

### 2.2 Create Render Web Service

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select your repository
5. Configure:
   - **Name:** code-copilot-backend
   - **Region:** Choose closest region
   - **Branch:** main
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

### 2.3 Add Environment Variables

In Render dashboard, go to Environment tab and add:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
OPENAI_API_KEY=sk-proj-your-actual-key-here
CORS_ORIGIN=https://your-frontend-app.vercel.app
```

**Important:** 
- Replace DATABASE_URL with your actual Supabase connection string
- Replace OPENAI_API_KEY with your actual OpenAI key
- Update CORS_ORIGIN after deploying frontend (step 3)

### 2.4 Deploy Backend

1. Click "Create Web Service"
2. Wait for build to complete (~3-5 minutes)
3. Check logs for errors
4. Copy your backend URL: `https://code-copilot-backend.onrender.com`

### 2.5 Test Backend

Test the health endpoint:
```bash
curl https://code-copilot-backend.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-11-22T10:30:00.000Z"
}
```

---

## 💻 Step 3: Deploy Frontend (Vercel)

### 3.1 Prepare Frontend

1. Create `frontend/.env.production`:
   ```
   VITE_API_URL=https://code-copilot-backend.onrender.com
   ```

2. Update `frontend/vite.config.js`:
   ```javascript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     server: {
       port: 3000
     }
   })
   ```

3. Commit changes:
   ```bash
   git add .
   git commit -m "Configure frontend for production"
   git push origin main
   ```

### 3.2 Deploy to Vercel

**Option A: Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? code-copilot-frontend
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

**Option B: Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. Add Environment Variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://code-copilot-backend.onrender.com`

6. Click "Deploy"
7. Wait 2-3 minutes
8. Copy your frontend URL: `https://code-copilot-frontend.vercel.app`

### 3.3 Update Backend CORS

1. Go back to Render dashboard
2. Update `CORS_ORIGIN` environment variable:
   ```
   CORS_ORIGIN=https://code-copilot-frontend.vercel.app
   ```
3. Save and wait for backend to redeploy

---

## ✅ Step 4: Verify Deployment

### 4.1 Test Full Flow

1. Open your Vercel URL
2. Enter prompt: "Write a Python function to sort a list"
3. Select "Python"
4. Click "Generate Code"
5. Verify code appears
6. Check history section
7. Test pagination

### 4.2 Check Database

1. Go to Supabase → Table Editor
2. Open `generations` table
3. Verify new entries appear

### 4.3 Monitor Logs

**Backend Logs (Render):**
1. Go to Render dashboard
2. Click on your service
3. View "Logs" tab

**Frontend Logs (Vercel):**
1. Go to Vercel dashboard
2. Click on your project
3. Go to "Deployments" → Click latest → "View Function Logs"

---

## 🔧 Troubleshooting

### Issue: CORS Error

**Symptom:** Frontend shows "Network Error" or CORS blocked

**Solution:**
1. Check `CORS_ORIGIN` in Render matches exact Vercel URL (no trailing slash)
2. Ensure backend has CORS middleware:
   ```javascript
   app.use(cors({
     origin: process.env.CORS_ORIGIN,
     credentials: true
   }));
   ```

### Issue: Database Connection Failed

**Symptom:** Backend logs show "Connection refused" or "authentication failed"

**Solution:**
1. Verify `DATABASE_URL` in Render environment variables
2. Check password is correct (no special characters need URL encoding)
3. Ensure Supabase project is active (free tier doesn't pause)
4. Test connection locally:
   ```bash
   psql "your-connection-string"
   ```

### Issue: OpenAI API Error

**Symptom:** "Failed to generate code" or "Invalid API key"

**Solution:**
1. Verify `OPENAI_API_KEY` is correct in Render
2. Check API key has credits: https://platform.openai.com/usage
3. Ensure key format is: `sk-proj-...` (new format) or `sk-...` (old format)

### Issue: Build Failed on Render

**Symptom:** "Build failed" error in Render logs

**Solution:**
1. Check `package.json` has all dependencies
2. Verify Node version compatibility (use Node 18+)
3. Check build logs for specific error
4. Ensure `ROOT_DIRECTORY` is set to `backend`

### Issue: Vercel Build Failed

**Symptom:** Build error on Vercel

**Solution:**
1. Check `frontend/package.json` has `build` script
2. Verify all dependencies are in `package.json` (not just devDependencies)
3. Check build logs for specific missing packages
4. Ensure `VITE_API_URL` is set in Vercel environment variables

---

## 🎛️ Alternative Deployment Options

### Backend Alternatives

1. **Railway.app**
   - Pros: Easy setup, auto-deploys, integrated DB
   - Cons: Limited free tier ($5 credit/month)
   - Best for: Quick prototypes

2. **Heroku**
   - Pros: Mature platform, many addons
   - Cons: No longer has free tier
   - Best for: Production apps with budget

3. **AWS Elastic Beanstalk**
   - Pros: Scalable, AWS ecosystem
   - Cons: Complex setup, costs can add up
   - Best for: Enterprise applications

4. **DigitalOcean App Platform**
   - Pros: Simple, affordable
   - Cons: $5/month minimum
   - Best for: Growing projects

### Frontend Alternatives

1. **Netlify**
   - Similar to Vercel
   - Generous free tier
   - Great CI/CD

2. **GitHub Pages**
   - Free for public repos
   - Requires build configuration
   - No server-side rendering

3. **Cloudflare Pages**
   - Fast global CDN
   - Unlimited bandwidth
   - Good for static sites

### Database Alternatives

1. **Neon.tech**
   - Serverless PostgreSQL
   - Generous free tier (3GB storage)
   - Auto-scaling

2. **Railway PostgreSQL**
   - Integrated with Railway backend
   - Simple setup
   - Limited free tier

3. **ElephantSQL**
   - Managed PostgreSQL
   - Free tier: 20MB storage
   - Good for small projects

4. **PlanetScale**
   - MySQL (not PostgreSQL)
   - Serverless scaling
   - Good free tier

---

## 📊 Monitoring and Maintenance

### Health Checks

Set up monitoring for:
- Backend uptime
- Database connection
- API response times
- Error rates

**Tools:**
- UptimeRobot (free)
- Pingdom
- Better Uptime

### Logs

Monitor application logs:
1. **Render:** Built-in log viewer
2. **Vercel:** Function logs in dashboard
3. **Supabase:** Query logs in dashboard

### Backups

**Database Backups:**
1. Supabase auto-backups (free tier: daily)
2. Manual export:
   ```bash
   pg_dump "your-connection-string" > backup.sql
   ```

### Updates

Keep dependencies updated:
```bash
# Check outdated packages
npm outdated

# Update packages
npm update

# Redeploy
git push
```

---

## 💰 Cost Estimation (Free Tier)

| Service | Free Tier Limits | Cost After Limit |
|---------|------------------|------------------|
| Vercel | 100GB bandwidth/month | $20/month |
| Render | 750 hours/month | $7/month |
| Supabase | 500MB DB, 2GB transfer | $25/month |
| OpenAI API | Pay-as-you-go | ~$0.002/request |

**Total Monthly Cost (within free limits):** $0

**Estimated Cost (moderate usage):**
- 1,000 code generations/month: ~$2
- Stay within free tiers: $0 infrastructure
- **Total: ~$2/month**

---

## 🚀 Production Checklist

Before going live:

- [ ] All environment variables set correctly
- [ ] CORS configured properly
- [ ] Database migrations run successfully
- [ ] SSL/HTTPS enabled (auto on Vercel/Render)
- [ ] Error handling tested
- [ ] Rate limiting configured (optional)
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] API keys secured (not in code)
- [ ] Test all features end-to-end
- [ ] Mobile responsiveness verified
- [ ] Loading states work correctly
- [ ] Error messages user-friendly

---

## 📞 Support

If you encounter issues:

1. Check application logs
2. Review this troubleshooting guide
3. Search platform documentation:
   - [Vercel Docs](https://vercel.com/docs)
   - [Render Docs](https://render.com/docs)
   - [Supabase Docs](https://supabase.com/docs)
4. Open GitHub issue
5. Contact platform support

---

**Deployment complete! 🎉**

Your app is now live and accessible worldwide. Share your demo link in your assignment submission.
