# 🚀 SUPER EASY DEPLOYMENT GUIDE

## Just Follow These 3 Steps:

### 1️⃣ **Create Database on Render.com**
- Go to Render.com → Click "New +" → Select "PostgreSQL"
- Name it: `form-builder-db`
- Click "Create Database"
- **Copy the "External Database URL"** (save this!)

### 2️⃣ **Deploy Backend on Render.com**
- Go to Render.com → Click "New +" → Select "Web Service"
- Connect your GitHub repo
- **Settings:**
  - Root Directory: `backend`
  - Build Command: `npm install`
  - Start Command: `npm start`
- **Environment Variables:**
  - `DATABASE_URL` = (paste your database URL here)
  - `DIRECT_URL` = (paste the same database URL here)
  - `OPENROUTER_API_KEY` = (get from https://openrouter.ai)
- Click "Deploy"

### 3️⃣ **Done!**
Your backend will be live at: `https://your-app-name.onrender.com`

## 🔧 **Get Your API Key:**
1. Go to https://openrouter.ai
2. Sign up/login
3. Go to "Keys" section
4. Create a new API key
5. Copy it to your Render.com environment variables

## ✅ **Test Your Deployment:**
Visit: `https://your-app-name.onrender.com/health`
You should see: `{"status":"OK","timestamp":"..."}`

That's it! Your AI form builder backend is now live! 🎉
