# Deployment Guide - Render

This guide will help you deploy the VideoCall backend to Render.

## Prerequisites

- A [Render account](https://render.com) (free tier available)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Method 1: Deploy Using Render Blueprint (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket** (if not already done)

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **"New +"** → **"Blueprint"**
   - Connect your repository
   - Render will automatically detect the `render.yaml` file

3. **Deploy**
   - Review the configuration
   - Click **"Apply"**
   - Render will build and deploy your service

## Method 2: Manual Deployment

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Create a New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **"New +"** → **"Web Service"**
   - Connect your repository
   - Select the repository containing your backend code

3. **Configure the Service**
   - **Name**: `videocall-backend` (or your preferred name)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Select **Free** (or your preferred plan)

4. **Environment Variables** (Optional)
   - Add `NODE_ENV` = `production`

5. **Deploy**
   - Click **"Create Web Service"**
   - Render will build and deploy your application

## After Deployment

1. **Get Your Backend URL**
   - Once deployed, Render will provide a URL like: `https://videocall-backend-xxxx.onrender.com`
   - Copy this URL

2. **Update Your Frontend**
   - Update your frontend application to use the new backend URL
   - Replace `http://localhost:5000` with your Render URL

3. **Test the Connection**
   - Open your frontend application
   - Create a room and test video calling functionality

## Important Notes

- **Free Tier Limitations**: Render's free tier spins down after 15 minutes of inactivity. The first request after inactivity may take 30-60 seconds.
- **CORS Configuration**: The server currently allows all origins (`*`). For production, consider restricting this to your frontend domain.
- **WebSocket Support**: Render fully supports WebSocket connections required for Socket.IO.

## Updating CORS for Production (Recommended)

To restrict CORS to your frontend domain, update `server.js`:

```javascript
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"]
  }
});
```

Then add an environment variable in Render:
- **Key**: `FRONTEND_URL`
- **Value**: `https://your-frontend-domain.com`

## Troubleshooting

**Service won't start:**
- Check the logs in Render Dashboard
- Ensure `package.json` has the correct start script: `"start": "node server.js"`

**Connection issues:**
- Verify the backend URL in your frontend
- Check CORS settings
- Ensure WebSocket connections are allowed

**Performance issues:**
- Consider upgrading from the free tier
- Monitor logs for errors

## Local Development

For local development, use:
```bash
npm run dev
```

This uses `nodemon` for auto-reloading during development.
