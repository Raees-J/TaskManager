# Render.com Backend Deployment Guide (FREE)

## Important: Fix the Build Error

The error happens because Render is trying to build from the root directory instead of the Backend folder.

## Step-by-Step Fix:

### Option 1: Update Your Existing Service Settings

1. **Go to your Render dashboard**
2. **Click on your service** (taskmanager-backend)
3. **Go to Settings**
4. **Update these settings:**

   **Root Directory:** `Backend` ⚠️ THIS IS CRITICAL!
   
   **Build Command:** `npm install`
   
   **Start Command:** `npm start`

5. **Scroll down and click "Save Changes"**
6. **Go back to the service and click "Manual Deploy" → "Deploy latest commit"**

### Option 2: Delete and Recreate Service

If Option 1 doesn't work:

1. **Delete the current service**
2. **Create New Web Service**
3. **Connect your GitHub repo:** `Raees-J/TaskManager`
4. **Configure:**
   - Name: `taskmanager-backend`
   - Region: Choose closest to you
   - Branch: `main`
   - **Root Directory:** `Backend` ⚠️ IMPORTANT!
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: `Free`

5. **Add Environment Variables** (click "Advanced"):
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key-here
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://task-manager-woad-five.vercel.app
   ```

6. **Click "Create Web Service"**

## After Successful Deployment:

1. **Copy your Render URL** (e.g., `https://taskmanager-backend.onrender.com`)

2. **Update Vercel Environment Variable:**
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Update `REACT_APP_API_URL` to: `https://taskmanager-backend.onrender.com/api`
   - Redeploy Vercel

3. **Update Backend CORS** (if needed):
   - The backend is already configured to accept Vercel domains
   - If you get CORS errors, let me know your Render URL

## Important Notes:

- ⚠️ **Free tier sleeps after 15 minutes of inactivity**
- First request after sleep takes 30-60 seconds to wake up
- This is normal for free tier
- Consider upgrading if you need 24/7 uptime

## Troubleshooting:

### Build still failing?
- Double-check Root Directory is set to `Backend`
- Make sure you saved the settings
- Try manual deploy after saving

### Can't connect to MongoDB?
- Check MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Verify MONGO_URI environment variable is correct
- Check MongoDB Atlas cluster is running

### CORS errors?
- Make sure FRONTEND_URL environment variable is set
- Verify your Vercel URL is correct
- Backend should already allow Vercel domains

## Test Your Deployment:

Visit: `https://your-render-url.onrender.com/`

You should see: `{"message":"Backend running"}`

If you see this, your backend is working! ✅
