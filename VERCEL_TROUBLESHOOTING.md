# Vercel Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. FUNCTION_INVOCATION_FAILED Error

**Problem**: Your serverless function crashes with a 500 error.

**Solutions**:

#### A. Check Environment Variables
Make sure you have set the `MONGODB_URI` environment variable in your Vercel dashboard:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`

#### B. MongoDB Connection Issues
If you're using MongoDB Atlas:

1. **Whitelist IP Addresses**: Add `0.0.0.0/0` to allow all IPs (or Vercel's IPs)
2. **Check Connection String**: Ensure it's in the correct format:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/library-management?retryWrites=true&w=majority
   ```
3. **Database User Permissions**: Ensure your database user has read/write permissions

#### C. Build Configuration
In your Vercel project settings:

- **Framework Preset**: Other
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2. Cold Start Issues

**Problem**: First request takes too long or fails.

**Solutions**:

1. **Optimize MongoDB Connection**: The app is configured with `maxPoolSize: 1` for serverless
2. **Use MongoDB Atlas**: Local MongoDB won't work on Vercel
3. **Check Function Timeout**: Set `maxDuration: 30` in vercel.json

### 3. Memory Issues

**Problem**: Function runs out of memory.

**Solutions**:

1. **Reduce Bundle Size**: Ensure only necessary dependencies are included
2. **Optimize Imports**: Use tree-shaking where possible
3. **Check Dependencies**: Remove unused packages

## Step-by-Step Fix

### Step 1: Verify Local Build
```bash
npm run build
```

### Step 2: Test Locally with Production Settings
```bash
NODE_ENV=production npm run start:prod
```

### Step 3: Check Vercel Logs
1. Go to your Vercel dashboard
2. Click on your project
3. Go to Functions tab
4. Check the logs for specific error messages

### Step 4: Update Environment Variables
In Vercel dashboard → Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/library-management?retryWrites=true&w=majority
NODE_ENV=production
```

### Step 5: Redeploy
```bash
vercel --prod
```

## Alternative Deployment Options

If Vercel continues to have issues, consider:

1. **Railway**: Good for Node.js applications
2. **Render**: Free tier available
3. **Heroku**: Traditional deployment option
4. **DigitalOcean App Platform**: Simple deployment

## Testing Your Deployment

After successful deployment:

1. **Health Check**: `GET https://your-app.vercel.app/health`
2. **API Documentation**: `GET https://your-app.vercel.app/api`
3. **Seed Database**: `POST https://your-app.vercel.app/seed`
4. **Test Search**: `GET https://your-app.vercel.app/search?q=harry`

## Common Error Messages

### "Cannot find module"
- Check if all dependencies are in `package.json`
- Ensure `node_modules` is not in `.gitignore`

### "MongoDB connection failed"
- Verify your connection string
- Check MongoDB Atlas network access
- Ensure database user has correct permissions

### "Function timeout"
- Increase `maxDuration` in vercel.json
- Optimize database queries
- Consider using connection pooling

## Support

If issues persist:

1. Check Vercel documentation: https://vercel.com/docs
2. Review MongoDB Atlas documentation: https://docs.atlas.mongodb.com
3. Check the project's main README.md
4. Create an issue in the project repository
