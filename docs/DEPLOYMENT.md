# Deployment Guide - SABR Logistics Manager

This guide covers deploying SABR Logistics Manager to various hosting platforms.

## 📑 Table of Contents

- [Quick Deploy](#quick-deploy)
- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [GitHub Pages](#github-pages)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Custom Domain](#custom-domain)
- [Troubleshooting](#troubleshooting)

---

## Quick Deploy

### 🌐 Live Demo

The application is currently deployed and running at:
**[https://sabr-ngo-logestics-manager.vercel.app/](https://sabr-ngo-logestics-manager.vercel.app/)**

### One-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/supzammy/SABR-Logistics-Manager-for-NGOs)

### One-Click Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/supzammy/SABR-Logistics-Manager-for-NGOs)

---

## Vercel Deployment

Vercel is the **recommended** hosting platform for this application.

### Method 1: Using Vercel Dashboard (Easiest)

1. **Sign up / Login**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click **"Add New Project"**
   - Select **"Import Git Repository"**
   - Find `supzammy/SABR-Logistics-Manager-for-NGOs`
   - Click **"Import"**

3. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Node Version**: 18.x (or latest LTS)

4. **Environment Variables** (Optional)
   - Click **"Environment Variables"**
   - Add `AI_API_KEY` if you plan to use live AI (leave empty for mock data)

5. **Deploy**
   - Click **"Deploy"**
   - Wait 1-2 minutes for build to complete
   - Your app is live! 🎉

### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project directory
cd SABR-Logistics-Manager-for-NGOs

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your username
# - Link to existing project? No
# - Project name? (press enter for default)
# - Directory? ./ (press enter)
# - Auto-detected Vite, continue? Yes

# Production deployment
vercel --prod
```

### Vercel Configuration File

Create `vercel.json` in project root (optional):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "env": {
    "AI_API_KEY": ""
  }
}
```

---

## Netlify Deployment

### Method 1: Using Netlify UI

1. **Login to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Sign in with GitHub

2. **New Site from Git**
   - Click **"Add new site"** → **"Import an existing project"**
   - Choose **GitHub**
   - Select `SABR-Logistics-Manager-for-NGOs`

3. **Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Production branch**: `main`

4. **Deploy**
   - Click **"Deploy site"**
   - Your site is live at `random-name.netlify.app`

### Method 2: Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

### Netlify Configuration File

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## GitHub Pages

### Prerequisites

- GitHub account
- Repository pushed to GitHub

### Setup

1. **Update `vite.config.ts`**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/SABR-Logistics-Manager-for-NGOs/', // Add this line
  // ... rest of config
});
```

2. **Install gh-pages**

```bash
npm install --save-dev gh-pages
```

3. **Update `package.json`**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

4. **Deploy**

```bash
npm run deploy
```

5. **Enable GitHub Pages**
   - Go to repository **Settings** → **Pages**
   - Source: **gh-pages branch**
   - Save

Your site will be live at: `https://supzammy.github.io/SABR-Logistics-Manager-for-NGOs/`

---

## Docker Deployment

### Dockerfile

Create `Dockerfile` in project root:

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

Create `nginx.conf` for proper routing:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Build & Run

```bash
# Build Docker image
docker build -t sabr-logistics .

# Run container
docker run -p 8080:80 sabr-logistics

# Access at http://localhost:8080
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

---

## Environment Variables

### Available Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `AI_API_KEY` | API key for live AI integration | No | (uses mock data) |

### Setting Environment Variables

**Vercel:**
```bash
# Via CLI
vercel env add AI_API_KEY

# Via Dashboard
Settings → Environment Variables → Add
```

**Netlify:**
```bash
# Via CLI
netlify env:set AI_API_KEY "your-key-here"

# Via Dashboard
Site Settings → Environment Variables → Add variable
```

**Docker:**
```bash
# Docker run
docker run -e AI_API_KEY="your-key" -p 8080:80 sabr-logistics

# Docker compose
services:
  app:
    environment:
      - AI_API_KEY=your-key
```

---

## Custom Domain

### Vercel

1. Go to project **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain (e.g., `sabr-logistics.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 48 hours)

### Netlify

1. Go to **Domain settings**
2. Click **"Add custom domain"**
3. Enter your domain
4. Update DNS records at your registrar:
   - CNAME: `www` → `your-site.netlify.app`
   - A record: `@` → Netlify's IP

### SSL/HTTPS

Both Vercel and Netlify provide **free SSL certificates** automatically via Let's Encrypt.

---

## Performance Optimization

### Build Optimization

**Split Chunks** - Update `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'charts': ['recharts'],
        },
      },
    },
  },
});
```

### CDN Configuration

Both Vercel and Netlify provide global CDN automatically.

**Custom Headers** for caching (Netlify):

```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## Monitoring & Analytics

### Vercel Analytics

1. Go to project dashboard
2. Click **"Analytics"** tab
3. Enable **Vercel Analytics**
4. View real-time metrics

### Netlify Analytics

1. Go to site dashboard
2. Click **"Analytics"** tab
3. Enable **Netlify Analytics** (paid feature)

### Google Analytics

Add to `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## Troubleshooting

### Build Fails on Deployment

**Issue**: Build command fails
```
Error: Cannot find module 'xyz'
```

**Solution**: Ensure all dependencies are in `package.json`
```bash
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

---

### 404 on Page Refresh

**Issue**: Refreshing any page except home shows 404

**Solution**: Configure routing

**Vercel** - Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify** - Create `_redirects` in `public/`:
```
/*  /index.html  200
```

---

### Environment Variables Not Working

**Issue**: `process.env.AI_API_KEY` is undefined

**Solution**: Ensure variables are set in platform dashboard and rebuild

**Vercel**: Settings → Environment Variables → Redeploy
**Netlify**: Site settings → Environment → Trigger deploy

---

### Large Bundle Size Warning

**Issue**: Build shows warning about large chunks

**Solution**: Implement code splitting (see Performance Optimization above)

---

### App Doesn't Load (Blank Screen)

**Issue**: Deployed app shows blank page

**Solution**: 
1. Check browser console for errors
2. Verify `base` path in `vite.config.ts` matches deployment URL
3. Check network tab for failed asset requests
4. Ensure `dist/` folder contains `index.html`

---

## Continuous Deployment

Both Vercel and Netlify automatically redeploy when you push to GitHub:

1. Make changes locally
2. Commit and push to `main` branch
3. Platform detects push and triggers build
4. New version deploys automatically (1-2 minutes)

**Disable auto-deploy** if needed:
- **Vercel**: Settings → Git → Disable auto-deploy
- **Netlify**: Site settings → Build & deploy → Stop builds

---

## Rollback / Version Control

### Vercel
- Go to **Deployments** tab
- Find previous successful deployment
- Click **"Promote to Production"**

### Netlify
- Go to **Deploys** tab
- Find previous deploy
- Click **"Publish deploy"**

---

**Your SABR Logistics Manager is now deployed and ready to make an impact!** 🚀

For issues, see [Troubleshooting](#troubleshooting) or open a [GitHub Issue](https://github.com/supzammy/SABR-Logistics-Manager-for-NGOs/issues).
