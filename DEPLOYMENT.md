# 🚀 Deployment Guide for Dynamic Form Builder

## Backend Deployment (Render.com)

### Required Environment Variables

Set these environment variables in your Render.com dashboard:

```bash
# Database (Required)
DATABASE_URL="postgresql://username:password@host:port/database"
DIRECT_URL="postgresql://username:password@host:port/database"

# API Keys (Required)
OPENROUTER_API_KEY="your_openrouter_api_key_here"

# Frontend URL (Optional - for CORS)
FRONTEND_URL="https://your-frontend-domain.com"

# Environment
NODE_ENV="production"
```

### Render.com Configuration

1. **Build Command**: `npm install`
2. **Start Command**: `npm start`
3. **Node Version**: 18.x or higher
4. **Root Directory**: `backend/`

### Database Setup

1. Create a PostgreSQL database on Render.com
2. Copy the connection string to `DATABASE_URL` and `DIRECT_URL`
3. The deployment will automatically run `prisma db push` to create tables

### Troubleshooting

If you get "Cannot find module './router'" error:
- This is usually a Node.js version compatibility issue
- Make sure you're using Node.js 18+ 
- The updated package.json includes proper engine requirements

## Frontend Deployment (Vercel/Netlify)

### Environment Variables

```bash
VITE_API_URL="https://your-backend-url.onrender.com"
```

### Build Configuration

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x or higher

## Local Development

1. **Backend**: `cd backend && npm run dev`
2. **Frontend**: `cd frontend && npm run dev`
3. **Database**: Make sure PostgreSQL is running locally

## Health Check

The backend includes a health check endpoint at `/health` for monitoring.
