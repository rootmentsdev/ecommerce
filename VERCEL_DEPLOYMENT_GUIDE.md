# Vercel Deployment Guide - Environment Variables

## Issue Fixed
The newsletter subscription was failing because the frontend wasn't using the correct backend API URL in production.

## What Was Changed
- Updated `frontend/src/services/newsletterService.js` to use the centralized API configuration from `frontend/src/config/api.js`
- This ensures all API calls use the correct production backend URL

## Environment Variables Setup

### Option 1: Using Environment Variable (Recommended)
Set the following environment variable in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variable:

```
VITE_API_URL=https://ecommerce-q0bg.onrender.com
```

**Note:** Do NOT include `/api` at the end - the code adds this automatically.

### Option 2: No Environment Variable Needed
The code now automatically uses the production URL from `api.js`:
- **Development:** `http://localhost:5000/api`
- **Production:** `https://ecommerce-q0bg.onrender.com/api`

## Verifying the Fix

After redeploying, test the newsletter subscription:

1. Open your deployed site: https://ecommerce-pi-six-17.vercel.app
2. Scroll to the "Stay in the Loop" section at the bottom
3. Enter an email address
4. Click "Subscribe"
5. You should see: "✓ Successfully subscribed! Welcome to dappr SQUAD!"

## Backend Endpoints

Your backend is deployed at: `https://ecommerce-q0bg.onrender.com`

Newsletter endpoints:
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter
- `GET /api/newsletter/stats` - Get newsletter statistics (Admin only)
- `GET /api/newsletter/subscribers` - Get all subscribers (Admin only)

## CORS Configuration

The backend is already configured to accept requests from:
- `http://localhost:5173` (Development)
- `http://localhost:3000` (Development)
- `https://ecommerce-pi-six-17.vercel.app` (Production)
- All Vercel subdomains (`*.vercel.app`)

## Deployment Steps

1. **Commit the changes:**
   ```bash
   git add .
   git commit -m "Fix: Newsletter subscription using centralized API config"
   git push origin master
   ```

2. **Vercel will automatically deploy** (if you have auto-deploy enabled)

3. **Manually deploy (if needed):**
   - Go to Vercel dashboard
   - Click "Deployments"
   - Click "Redeploy" on the latest deployment

## Testing After Deployment

1. Check if the backend is running:
   ```
   https://ecommerce-q0bg.onrender.com/health
   ```
   Should return: `{"status":"OK",...}`

2. Test newsletter subscription from your deployed frontend

3. Check browser console (F12) for any errors

## Troubleshooting

### If you still see "Failed to fetch":

1. **Check backend status:**
   - Visit: https://ecommerce-q0bg.onrender.com/health
   - If it's not responding, your backend might be sleeping (Render free tier)
   - Wait 30-60 seconds for it to wake up

2. **Check browser console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for detailed error messages

3. **Verify CORS:**
   - The error might show if it's a CORS issue
   - Check that your Vercel domain is in the allowed origins list in `backend/server.js`

4. **Check backend logs:**
   - Go to Render dashboard
   - View your backend service logs
   - Look for any errors when the newsletter endpoint is called

## Additional Notes

- The backend uses MongoDB to store newsletter subscriptions
- Make sure your backend MongoDB connection is working
- The newsletter controller validates emails before storing them
- Duplicate subscriptions are handled gracefully

