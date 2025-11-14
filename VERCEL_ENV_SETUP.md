# Vercel Environment Variable Setup

## CRITICAL: Set This Environment Variable in Vercel

Your frontend is trying to connect to `localhost:5000` because the environment variable is not set!

### Step-by-Step Fix:

1. **Go to your Vercel project dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on your TaskManager project

2. **Go to Settings → Environment Variables**
   - Click "Settings" in the top menu
   - Click "Environment Variables" in the left sidebar

3. **Add the following variable:**

   **Variable Name:**
   ```
   REACT_APP_API_URL
   ```

   **Variable Value:**
   ```
   https://web-production-8c57e.up.railway.app/api
   ```
   
   ⚠️ **IMPORTANT:** Replace `web-production-8c57e.up.railway.app` with your actual Railway backend URL!

4. **Select Environment:**
   - Check: ✅ Production
   - Check: ✅ Preview
   - Check: ✅ Development

5. **Click "Save"**

6. **Redeploy your application:**
   - Go to "Deployments" tab
   - Click the three dots (...) on the latest deployment
   - Click "Redeploy"

## How to Find Your Railway Backend URL:

1. Go to Railway dashboard
2. Click on your backend service
3. Go to "Settings" tab
4. Look for "Domains" section
5. Copy the URL (e.g., `web-production-8c57e.up.railway.app`)
6. Add `/api` at the end

## Verify It's Working:

After redeploying, open your Vercel site and check the browser console (F12):
- You should see API calls going to your Railway URL
- NOT to `localhost:5000`

## Common Issues:

### Still seeing localhost errors?
- Clear your browser cache
- Do a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check that the environment variable is saved in Vercel
- Verify you redeployed after adding the variable

### CORS errors?
- Make sure your Railway backend is running
- Check that CORS is configured to allow your Vercel domain
- The backend should already be configured for this

## Test Your Setup:

1. Open your Vercel site
2. Try to login or signup
3. Open browser console (F12)
4. Check the Network tab
5. You should see requests going to: `https://your-railway-url.railway.app/api/users/login`

If you see `localhost:5000`, the environment variable is not set correctly!
