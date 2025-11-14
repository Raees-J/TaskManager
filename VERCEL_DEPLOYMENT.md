# Vercel Frontend Deployment Guide

## Quick Setup

### Step 1: Configure Vercel Project Settings

When deploying on Vercel, use these settings:

**Framework Preset:** Create React App

**Root Directory:** `FrontEnd` (IMPORTANT!)

**Build Command:** `npm run build`

**Output Directory:** `build`

**Install Command:** `npm install`

### Step 2: Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
REACT_APP_API_URL=https://web-production-8c57e.up.railway.app
```

Replace with your actual Railway backend URL.

### Step 3: Deploy

Click "Deploy" and Vercel will build your frontend.

## Alternative: Manual Configuration

If the automatic detection doesn't work:

1. Go to Project Settings in Vercel
2. Set **Root Directory** to `FrontEnd`
3. Override Build Command: `npm run build`
4. Override Output Directory: `build`
5. Redeploy

## Troubleshooting

### Error: "Could not find index.js"

**Solution:** Make sure Root Directory is set to `FrontEnd` in Vercel settings.

### Error: "Module not found"

**Solution:** 
1. Delete the deployment
2. Redeploy with correct Root Directory setting
3. Ensure all dependencies are in FrontEnd/package.json

### CORS Errors

**Solution:** Make sure your backend (Railway) has CORS enabled for your Vercel domain.

## After Deployment

Your frontend will be live at: `https://your-project.vercel.app`

Update your backend CORS settings to allow this domain.
