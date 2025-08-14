# Deployment Guide - Library Management API

This guide will help you deploy the Library Management API to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Database**: Set up a MongoDB database (MongoDB Atlas recommended)
3. **GitHub Repository**: Push your code to GitHub

## Step 1: Prepare Your MongoDB Database

### Option A: MongoDB Atlas (Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Get your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/library-management
   ```

### Option B: Local MongoDB (Development Only)

For local development, you can use:
```
mongodb://localhost:27017/library-management
```

## Step 2: Deploy to Vercel

### Method 1: Using Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Method 2: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project settings

## Step 3: Configure Environment Variables

In your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB connection string |
| `NODE_ENV` | `production` | Environment setting |

## Step 4: Configure Build Settings

In your Vercel project settings:

- **Framework Preset**: Other
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Step 5: Deploy and Test

1. **Trigger Deployment**:
   - If using CLI: `vercel --prod`
   - If using dashboard: Push to your main branch

2. **Test Your API**:
   ```bash
   # Health check
   curl https://your-app.vercel.app/health
   
   # Seed the database
   curl -X POST https://your-app.vercel.app/seed
   
   # Test search
   curl "https://your-app.vercel.app/search?q=harry"
   ```

3. **Access Swagger Documentation**:
   Visit: `https://your-app.vercel.app/api`

## Step 6: Custom Domain (Optional)

1. In Vercel dashboard, go to "Domains"
2. Add your custom domain
3. Configure DNS settings as instructed

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript compilation passes locally

2. **Database Connection Issues**:
   - Verify your MongoDB connection string
   - Check if your IP is whitelisted in MongoDB Atlas
   - Ensure database user has correct permissions

3. **Environment Variables**:
   - Make sure all required variables are set in Vercel
   - Check for typos in variable names

### Debugging

1. **Check Vercel Logs**:
   - Go to your project dashboard
   - Click on "Functions" tab
   - View function logs

2. **Test Locally**:
   ```bash
   npm run start:dev
   ```

3. **Check MongoDB Connection**:
   ```bash
   # Test connection string
   mongosh "your-connection-string"
   ```

## Production Checklist

- [ ] MongoDB Atlas cluster configured
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (if needed)
- [ ] SSL certificate active
- [ ] API endpoints tested
- [ ] Database seeded with sample data
- [ ] Rate limiting configured
- [ ] Monitoring set up

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to your repository
2. **MongoDB Security**: Use strong passwords and IP whitelisting
3. **Rate Limiting**: Configure appropriate limits for your use case
4. **CORS**: Configure CORS settings for your frontend domain

## Performance Optimization

1. **Database Indexes**: Ensure proper indexes are created
2. **Caching**: Consider implementing Redis for caching
3. **CDN**: Use Vercel's global CDN for static assets
4. **Monitoring**: Set up performance monitoring

## Support

If you encounter issues:

1. Check the [Vercel documentation](https://vercel.com/docs)
2. Review the [MongoDB Atlas documentation](https://docs.atlas.mongodb.com)
3. Check the project's [README.md](./README.md)
4. Create an issue in the project repository
