# Manikanta Finance — Production Deployment Guide

This guide walks you through deploying the **Manikanta Finance** showroom management application so the shop owner can securely access it from both laptops and mobile phones anywhere.

---

## Pre-Deployment Verification Status

The project was compiled and tested locally:
- **Build Status**: `✓ Next.js 14 Production Build Successful (16/16 pages statically and dynamically generated)`
- **TypeScript Check**: `0 errors`
- **Security Check**: `.env` and SQLite `.db` are protected via `.gitignore`
- **Configuration Templates**: `.env.example` created

---

## Choose Your Deployment Method

### Method 1: Vercel (Recommended — Fastest & Free)
Vercel is the official platform for Next.js and provides the fastest global CDN, automatic SSL (HTTPS), and mobile PWA compatibility.

> [!IMPORTANT]
> Because Vercel uses serverless functions, local SQLite files (`file:./dev.db`) are ephemeral and reset between requests. For Vercel, connect a **free Cloud PostgreSQL database** (e.g., from [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com)).

#### Step 1: Create a Free Cloud PostgreSQL Database
1. Sign up at **[Neon.tech](https://neon.tech)** (free tier) or **[Supabase](https://supabase.com)**.
2. Create a new project: `manikanta-finance`.
3. Copy your PostgreSQL connection string:
   ```text
   postgresql://username:password@ep-xyz.neon.tech/neondb?sslmode=require
   ```

#### Step 2: Switch Prisma to PostgreSQL
In `prisma/schema.prisma`, update the datasource:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
Then run:
```bash
npx prisma db push
node prisma/seed.js
```

#### Step 3: Push Code to GitHub
```bash
git init
git add .
git commit -m "Ready for production deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/manikanta-finance.git
git push -u origin main
```

#### Step 4: Deploy on Vercel
1. Go to **[vercel.com](https://vercel.com)** and log in.
2. Click **Add New Project** and import your GitHub repository.
3. In **Environment Variables**, add:
   - `DATABASE_URL`: `postgresql://username:password@your-host/dbname?sslmode=require`
   - `SESSION_SECRET`: `your-secure-random-key-2026`
   - `NEXT_PUBLIC_APP_NAME`: `Manikanta Finance`
4. Click **Deploy**.
5. Your app will be live at `https://manikanta-finance.vercel.app`!

---

### Method 2: Render.com or Railway.app (Easiest Full-Stack Server)
Both Render and Railway support long-running Node.js processes with persistent disks or 1-click PostgreSQL.

1. Push your code to GitHub.
2. Log into **[Render.com](https://render.com)** or **[Railway.app](https://railway.app)**.
3. Click **New Web Service** and select your GitHub repo.
4. Set Build & Start commands:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
5. Add Environment Variables:
   - `DATABASE_URL`
   - `SESSION_SECRET`
6. Click **Deploy**.

---

### Method 3: Showroom PC Host + Cloudflare Tunnel (100% Free, Keep Local SQLite DB)
If you want to keep running the application on your showroom laptop or desktop computer with your existing SQLite database, but still access it from the owner's mobile phone anywhere in the world:

1. Install [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/create-local-tunnel/) or [ngrok](https://ngrok.com).
2. Start the app on the showroom computer:
   ```bash
   npm run start
   ```
3. Run Cloudflare Tunnel:
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```
4. Cloudflare will give you a secure `https://xxx.trycloudflare.com` URL that works on any phone, laptop, or tablet.

---

## Production Checklist

| Step | Action | Status |
| :--- | :--- | :--- |
| **Build Test** | `npm run build` | Passed (0 errors) |
| **TypeScript** | `npx tsc --noEmit` | Passed (0 errors) |
| **Security** | `.gitignore` configured to exclude `.env` & `.db` | Configured |
| **Responsive Views** | Desktop Sidebar + Mobile Bottom Navigation Bar | Verified |
| **Admin Login** | `manikantareddy` / `manikanta04` | Verified |
