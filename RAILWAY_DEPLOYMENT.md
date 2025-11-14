# Railway Deployment Guide

## Quick Fix for MongoDB Connection Error

### Step 1: Whitelist Railway IP in MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your cluster
3. Click **"Network Access"** (left sidebar)
4. Click **"Add IP Address"**
5. Click **"Allow Access from Anywhere"**
6. Enter `0.0.0.0/0` in the IP Address field
7. Click **"Confirm"**

### Step 2: Set Environment Variables in Railway

Go to your Railway project → Variables tab and add:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.railway.app
```

**Important:** Replace the MongoDB URI with your actual connection string from MongoDB Atlas:
- Go to MongoDB Atlas → Clusters → Connect → Connect your application
- Copy the connection string
- Replace `<password>` with your actual database password
- Replace `<database>` with your database name (e.g., `taskmanager`)

### Step 3: Redeploy

After setting the variables, Railway will automatically redeploy. If not:
1. Go to your Railway project
2. Click **"Redeploy"**

## Troubleshooting

### If deployment still fails:

1. **Check MongoDB URI format:**
   - Must start with `mongodb+srv://`
   - Password must be URL-encoded (no special characters like @, :, /)
   - Database name must be specified

2. **Check Railway Logs:**
   - Click "View Logs" in Railway
   - Look for specific error messages

3. **Verify MongoDB Atlas:**
   - Ensure your cluster is running
   - Check that your database user has read/write permissions
   - Verify the database name exists

## Environment Variables Explained

- `MONGO_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT token generation (use a long random string)
- `PORT` - Port number (Railway sets this automatically, but 5000 is default)
- `NODE_ENV` - Set to "production" for Railway
- `FRONTEND_URL` - Your frontend URL for CORS (if deploying frontend separately)

## Need Help?

If you're still having issues:
1. Check Railway logs for specific errors
2. Verify all environment variables are set correctly
3. Ensure MongoDB Atlas IP whitelist includes 0.0.0.0/0
4. Test your MongoDB connection string locally first
